import type { MetadataRoute } from "next";
import { absolute } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The app behind the age gate has nothing to index and every
      // crawl of it is a wasted budget on a page a bot cannot use.
      disallow: ["/chat"],
    },
    sitemap: absolute("/sitemap.xml"),
  };
}
