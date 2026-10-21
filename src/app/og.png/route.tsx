import { ImageResponse } from "next/og";

import { copy } from "@/content/copy";
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
            "radial-gradient(900px 500px at 80% 20%, rgba(94,61,158,0.14), rgba(252,250,246,0) 70%), #fcfaf6",
          color: "#0b0917",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#3a1c6c" }}>
          {copy.meta.titleSuffix}
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, marginTop: 18 }}>{site.name}</div>
        <div style={{ fontSize: 34, color: "#3f3d4a", marginTop: 18, maxWidth: 900 }}>
          {copy.meta.ogLine}
        </div>
      </div>
    ),
    size,
  );
}
