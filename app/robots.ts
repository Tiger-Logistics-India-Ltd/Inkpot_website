import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/signin", "/work-with-us"],
      },
    ],
    sitemap: "https://www.inkpotindia.com/sitemap.xml",
  };
}
