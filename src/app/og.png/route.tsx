import { ImageResponse } from "next/og";

import { site } from "@/content/site";

export const dynamic = "force-static";
const size = { width: 1200, height: 630 };

/** Social sharing card, generated once at build time as /og.png (a real .png for any static host). */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "72px 80px",
          background:
            "radial-gradient(900px 500px at 80% 20%, rgba(124,92,214,0.35), rgba(11,10,16,0) 70%), #0b0a10",
          color: "#f3f0f8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#b39cf5" }}>
          Applied data science
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, marginTop: 18 }}>{site.name}</div>
        <div style={{ fontSize: 34, color: "#bdb7ca", marginTop: 18, maxWidth: 900 }}>
          Causal analysis · recommender evaluation · evidence-grounded LLM systems
        </div>
      </div>
    ),
    size,
  );
}
