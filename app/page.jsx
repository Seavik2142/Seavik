import Portfolio from "../components/Portfolio";
import { getGitHubContributions } from "../lib/github";

// Always fetch live GitHub contribution data on every visit (no stale cache)
export const dynamic = "force-dynamic";

export default async function Home() {
  const contributionsData = await getGitHubContributions("last");

  return <Portfolio initialContributions={contributionsData} />;
}
