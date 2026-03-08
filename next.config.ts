import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 구버전 /products/* → 홈으로 301 리다이렉트 (SEO 404 방지)
      {
        source: "/products/:path*",
        destination: "/",
        permanent: true,
      },
      // 구버전 /guides/* → 홈으로 301 리다이렉트 (SEO 404 방지)
      {
        source: "/guides/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
