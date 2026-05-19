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
    sitemap: "https://inkpotindia.com/sitemap.xml",
  };
}
