import type { NextConfig } from "next";

const isGithubPages = process.env.DEPLOY_ENV === 'github';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isGithubPages ? '/Monyx' : '',
  assetPrefix: isGithubPages ? '/Monyx/' : '',
  images: {
     unoptimized: true
  }
};

export default nextConfig;
