import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "The Living Table — A One-Night Dinner by Inkpot India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const svgRaw = readFileSync(
    join(process.cwd(), "public/images/thelivingtable/logo_the_right_one_1.svg"),
    "utf-8"
  );
  const logoDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgRaw).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#F4EFE6",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          position: "relative",
        }}
      >
        {/* Red top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 7, background: "#901A1C", display: "flex" }} />

        {/* Left — text content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px 72px 72px 80px",
          }}
        >
          <p
            style={{
              fontFamily: "serif",
              fontSize: 14,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "#901A1C",
              margin: "0 0 28px",
              display: "flex",
            }}
          >
            Inkpot India Presents
          </p>

          {/* Logo image */}
          <img
            src={logoDataUrl}
            width={420}
            height={168}
            style={{ objectFit: "contain", objectPosition: "left center", marginBottom: 36 }}
          />

          {/* Divider */}
          <div style={{ width: 48, height: 1, background: "#901A1C", margin: "0 0 28px", display: "flex" }} />

          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: 22,
              color: "rgba(0,0,0,0.48)",
              margin: "0 0 10px",
              letterSpacing: "0.06em",
              display: "flex",
            }}
          >
            28 June 2026 &nbsp;·&nbsp; Kathika Cultural Centre, Delhi
          </p>

          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: 20,
              color: "rgba(0,0,0,0.35)",
              margin: 0,
              letterSpacing: "0.04em",
              display: "flex",
            }}
          >
            ₹6,500 per seat &nbsp;·&nbsp; Limited to 100 guests
          </p>
        </div>

        {/* Right — dark accent panel */}
        <div
          style={{
            width: 320,
            background: "#0A0806",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 32px",
            gap: 24,
          }}
        >
          <div style={{ width: 1, height: 80, background: "rgba(255,255,255,0.12)", display: "flex" }} />
          <p
            style={{
              fontFamily: "serif",
              fontStyle: "italic",
              fontSize: 26,
              color: "#F4EFE6",
              margin: 0,
              textAlign: "center",
              lineHeight: 1.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            Food remembers{"\n"}what cities forget.
          </p>
          <div style={{ width: 1, height: 80, background: "rgba(255,255,255,0.12)", display: "flex" }} />
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              margin: 0,
              display: "flex",
            }}
          >
            inkpotindia.com
          </p>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
