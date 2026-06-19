import type { NextConfig } from "next";

const repoName = "Home-Forge-AI";
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,

  basePath: isGitHubPages ? `/${repoName}` : "",

  images: {
    unoptimized: true,
  },
};

export default nextConfig;