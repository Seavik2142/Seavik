export const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "Seavik2142";
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`;

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const CONTRIBUTIONS_API_BASE = "https://github-contributions-api.jogruber.de/v4";

const GRAPHQL_LEVEL_MAP = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const CONTRIBUTIONS_GRAPHQL_QUERY = `
  query GetUserContributions($login: String!, $from: DateTime, $to: DateTime) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionYears
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

function getGitHubToken() {
  return (
    process.env.GITHUB_TOKEN ||
    process.env.GH_TOKEN ||
    process.env.GITHUB_API_KEY ||
    ""
  ).trim();
}

function getDefaultFallbackYears() {
  const currentYear = new Date().getUTCFullYear();
  return [String(currentYear), String(currentYear - 1)];
}

/**
 * Fetch live contributions directly from the official GitHub GraphQL API
 * using the server-side `GITHUB_TOKEN` environment variable.
 * Always uses `cache: "no-store"` so commits appear immediately.
 */
async function fetchFromGitHubGraphQL(safeYear, username, token) {
  const variables = { login: username };
  if (safeYear !== "last") {
    variables.from = `${safeYear}-01-01T00:00:00Z`;
    variables.to = `${safeYear}-12-31T23:59:59Z`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "SeavikPortfolio/1.0",
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_GRAPHQL_QUERY,
        variables,
      }),
    });

    if (!res.ok) return null;

    const payload = await res.json();
    if (payload?.errors?.length) return null;

    const collection = payload?.data?.user?.contributionsCollection;
    const calendar = collection?.contributionCalendar;
    const weeks = calendar?.weeks;
    if (!Array.isArray(weeks) || weeks.length === 0) return null;

    const contributions = [];
    for (const week of weeks) {
      for (const day of week?.contributionDays || []) {
        if (!day?.date) continue;
        contributions.push({
          date: day.date,
          count: Number(day.contributionCount) || 0,
          level: GRAPHQL_LEVEL_MAP[day.contributionLevel] ?? 0,
        });
      }
    }

    contributions.sort((a, b) => a.date.localeCompare(b.date));

    const availableYears = Array.isArray(collection?.contributionYears)
      ? collection.contributionYears
          .map((y) => String(y))
          .filter((y) => /^\d{4}$/.test(y))
          .sort((a, b) => Number(b) - Number(a))
      : getDefaultFallbackYears();

    const total =
      typeof calendar.totalContributions === "number"
        ? calendar.totalContributions
        : contributions.reduce((sum, item) => sum + item.count, 0);

    return {
      username,
      profileUrl: `https://github.com/${username}`,
      year: safeYear,
      total,
      contributions,
      availableYears: availableYears.length > 0 ? availableYears : getDefaultFallbackYears(),
      source: "github-graphql",
      authenticated: true,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Parse GitHub's native contributions HTML fragment directly (real-time, no token needed).
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
 * Fetch available contribution years (fallback when GraphQL token isn't configured).
 */
export async function getAvailableGitHubYears(username = GITHUB_USERNAME) {
  const fallbackYears = getDefaultFallbackYears();

  try {
    const res = await fetch(`${CONTRIBUTIONS_API_BASE}/${encodeURIComponent(username)}`, {
      cache: "no-store",
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
 * Fetch live, real-time GitHub contribution activity for `@Seavik2142`.
 * Priority:
 *  1. Official GitHub GraphQL API (`GITHUB_TOKEN` env var — instant updates + private repos if permitted)
 *  2. Direct GitHub `/users/{username}/contributions` HTML (real-time, public contributions)
 *  3. `github-contributions-api.jogruber.de` fallback
 */
export async function getGitHubContributions(year = "last", username = GITHUB_USERNAME) {
  const safeYear = year === "last" || /^20\d{2}$/.test(String(year)) ? String(year) : "last";
  const token = getGitHubToken();

  // 1. Official GitHub GraphQL API (when GITHUB_TOKEN is configured)
  if (token) {
    const graphqlResult = await fetchFromGitHubGraphQL(safeYear, username, token);
    if (graphqlResult) {
      return graphqlResult;
    }
  }

  // 2. Direct live GitHub HTML contributions page (real-time, no third-party cache delay)
  try {
    const htmlUrl =
      safeYear === "last"
        ? `https://github.com/users/${encodeURIComponent(username)}/contributions`
        : `https://github.com/users/${encodeURIComponent(username)}/contributions?from=${safeYear}-01-01&to=${safeYear}-12-31`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const [res, availableYears] = await Promise.all([
      fetch(htmlUrl, {
        cache: "no-store",
        signal: controller.signal,
        headers: {
          "User-Agent": "SeavikPortfolio/1.0",
          Accept: "text/html",
        },
      }).finally(() => clearTimeout(timeout)),
      getAvailableGitHubYears(username),
    ]);

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
          availableYears,
          source: "github-html",
          authenticated: false,
          fetchedAt: new Date().toISOString(),
        };
      }
    }
  } catch {
    // Fall through to JSON proxy fallback
  }

  // 3. Fallback: github-contributions-api.jogruber.de
  try {
    const url = `${CONTRIBUTIONS_API_BASE}/${encodeURIComponent(username)}?y=${encodeURIComponent(safeYear)}`;
    const [res, availableYears] = await Promise.all([
      fetch(url, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      }),
      getAvailableGitHubYears(username),
    ]);

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
          safeYear === "last" ? data?.total?.lastYear : data?.total?.[safeYear];
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
          availableYears,
          source: "github-api",
          authenticated: false,
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
    availableYears: getDefaultFallbackYears(),
    source: "unavailable",
    authenticated: false,
    fetchedAt: new Date().toISOString(),
  };
}
