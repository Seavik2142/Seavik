import Portfolio from "../components/Portfolio";
import { getAvailableGitHubYears, getGitHubContributions } from "../lib/github";

export const revalidate = 3600;

export default async function Home() {
  const [contributionsData, availableYears] = await Promise.all([
    getGitHubContributions("last"),
    getAvailableGitHubYears(),
  ]);

  return (
    <Portfolio
      initialContributions={{
        ...contributionsData,
        availableYears,
      }}
    />
  );
}
