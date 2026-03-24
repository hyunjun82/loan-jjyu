import { MetadataRoute } from "next";

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://loan.jjyu.co.kr/sitemap.xml",
    host: "https://loan.jjyu.co.kr",
  };
}
