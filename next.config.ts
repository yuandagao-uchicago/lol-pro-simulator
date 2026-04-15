import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ddragon.leagueoflegends.com',
      },
      {
        protocol: 'https',
        hostname: 'am-a.akamaihd.net',
      },
      {
        protocol: 'https',
        hostname: 'static.lolesports.com',
      },
    ],
  },
};

export default nextConfig;
