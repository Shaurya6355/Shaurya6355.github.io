import type { NextConfig } from "next";

// Static export: the whole site is prebuilt HTML/CSS/JS in `out/`, so it can be
// hosted for free on any static host (Vercel Hobby, GitHub Pages, Cloudflare Pages).
// Set NEXT_PUBLIC_BASE_PATH only when hosting under a sub-path, e.g. "/portfolio".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
