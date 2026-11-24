export const GITHUB_USERNAME = "Seavik2142";
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

const CONTRIBUTIONS_API_BASE = "https://github-contributions-api.jogruber.de/v4";
const GITHUB_HTML_BASE = `https://github.com/users/${GITHUB_USERNAME}/contributions`;

/**
 * Parse GitHub's native contributions HTML fragment as a resilient fallback
 * if the JSON API is temporarily unavailable.
 */
function parseGitHubContributionsHtml(html) {
  const countById = new Map();
  const tooltipRegex =
    /<tool-tip[^>]*for="(contribution-day-component-\d+-\d+)"[^>]*>([\s\S]*?)<\/tool-tip>/g;
  let match;
  while ((match = tooltipRegex.exec(html)) !== null) {
    const id = match[1];
    const text = match[2].replace(/<[^>]+>/g, "").trim();
    const numMatch = text.match(/^([\d,]+)\s+contribution/i);
    countById.set(id, numMatch ? Number(numMatch[1].replace(/,/g, "")) : 0);
  }

  const contributions = [];
  const tdRegex =
    /<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-\d+-\d+)"[^>]*data-level="(\d)"[^>]*>/g;
  while ((match = tdRegex.exec(html)) !== null) {
    const date = match[1];
    const id = match[2];
    const level = Math.max(0, Math.min(4, Number(match[3]) || 0));
    const count = countById.has(id) ? countById.get(id) : 0;
    contributions.push({ date, count, level });
  }

  contributions.sort((a, b) => a.date.localeCompare(b.date));
  const total = contributions.reduce((sum, item) => sum + item.count, 0);
  return { contributions, total };
}

/**
 * Fetch available contribution years for the GitHub account (cached 24h).
 */
export async function getAvailableGitHubYears(username = GITHUB_USERNAME) {
  const currentYear = new Date().getUTCFullYear();
  const fallbackYears = [String(currentYear), String(currentYear - 1)];

  try {
    const res = await fetch(`${CONTRIBUTIONS_API_BASE}/${encodeURIComponent(username)}`, {
      next: { revalidate: 86400 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return fallbackYears;
    const data = await res.json();
    const years = Object.entries(data?.total || {})
      .filter(([key, count]) => /^\d{4}$/.test(key) && Number(count) > 0)
      .map(([key]) => key)
      .sort((a, b) => Number(b) - Number(a));
    return years.length > 0 ? years : fallbackYears;
  } catch {
    return fallbackYears;
  }
}

/**
 * Fetch real GitHub contribution activity for `@Seavik2142`.
 * - Primary: github-contributions-api.jogruber.de (same source used by ChanhDai)
 * - Fallback: GitHub's native `/users/{username}/contributions` HTML fragment
 * Revalidates every hour via Next.js data cache / ISR.
 */
export async function getGitHubContributions(year = "last", username = GITHUB_USERNAME) {
  const safeYear = year === "last" || /^20\d{2}$/.test(String(year)) ? String(year) : "last";

  // 1. Primary JSON API
  try {
    const url = `${CONTRIBUTIONS_API_BASE}/${encodeURIComponent(username)}?y=${encodeURIComponent(safeYear)}`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      const rawList = Array.isArray(data?.contributions) ? data.contributions : [];
      if (rawList.length > 0) {
        const contributions = rawList
          .filter((item) => item && typeof item.date === "string")
          .map((item) => ({
            date: item.date,
            count: Number(item.count) || 0,
            level: Math.max(0, Math.min(4, Number(item.level) || 0)),
          }))
          .sort((a, b) => a.date.localeCompare(b.date));

        const totalFromApi =
          safeYear === "last"
            ? data?.total?.lastYear
            : data?.total?.[safeYear];
        const computedTotal = contributions.reduce((sum, item) => sum + item.count, 0);
        const total =
          typeof totalFromApi === "number" && Number.isFinite(totalFromApi)
            ? totalFromApi
            : computedTotal;

        return {
          username,
          profileUrl: `https://github.com/${username}`,
          year: safeYear,
          total,
          contributions,
          source: "github-api",
          fetchedAt: new Date().toISOString(),
        };
      }
    }
  } catch {
    // Fall through to direct GitHub HTML fallback
  }

  // 2. Fallback: Direct GitHub contributions HTML fragment
  try {
    const htmlUrl =
      safeYear === "last"
        ? `https://github.com/users/${encodeURIComponent(username)}/contributions`
        : `https://github.com/users/${encodeURIComponent(username)}/contributions?from=${safeYear}-01-01&to=${safeYear}-12-31`;

    const res = await fetch(htmlUrl, {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent": "SeavikPortfolio/1.0",
        Accept: "text/html",
      },
    });

    if (res.ok) {
      const html = await res.text();
      const { contributions, total } = parseGitHubContributionsHtml(html);
      if (contributions.length > 0) {
        return {
          username,
          profileUrl: `https://github.com/${username}`,
          year: safeYear,
          total,
          contributions,
          source: "github-html",
          fetchedAt: new Date().toISOString(),
        };
      }
    }
  } catch {
    // Return graceful empty response below
  }

  return {
    username,
    profileUrl: `https://github.com/${username}`,
    year: safeYear,
    total: 0,
    contributions: [],
    source: "unavailable",
    fetchedAt: new Date().toISOString(),
  };
}
