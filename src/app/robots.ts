import { MetadataRoute } from "next";
import { DOMAIN } from "@/constants/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
}