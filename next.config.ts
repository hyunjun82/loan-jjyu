import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/loan-jjyu",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
