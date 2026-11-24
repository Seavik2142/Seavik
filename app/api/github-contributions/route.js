import { NextResponse } from "next/server";
import { getGitHubContributions } from "../../../lib/github";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get("year") || "last";
  const safeYear = yearParam === "last" || /^20\d{2}$/.test(yearParam) ? yearParam : "last";

  const data = await getGitHubContributions(safeYear);

  return NextResponse.json(data, {
    status: data.contributions.length > 0 ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
  });
}
