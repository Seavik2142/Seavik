import { NextResponse } from "next/server";
import { getAvailableGitHubYears, getGitHubContributions } from "../../../lib/github";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get("year") || "last";
  const safeYear = yearParam === "last" || /^20\d{2}$/.test(yearParam) ? yearParam : "last";

  const [data, availableYears] = await Promise.all([
    getGitHubContributions(safeYear),
    getAvailableGitHubYears(),
  ]);

  return NextResponse.json(
    {
      ...data,
      availableYears,
    },
    {
      status: data.contributions.length > 0 ? 200 : 503,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
