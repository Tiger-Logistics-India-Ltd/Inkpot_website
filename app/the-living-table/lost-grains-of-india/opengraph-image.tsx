import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "The Living Table — Lost Grains of India | Chapter Two by Inkpot India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  const svgRaw = readFileSync(
    join(process.cwd(), "public/images/thelivingtable/logo_the_right_one_1.svg"),
    "utf-8"
  );
  // Crop the 384×384 SVG canvas to the region the text + swirl actually occupy
  // so the logo fills the img element instead of rendering tiny.
  const croppedSvg = svgRaw
    .replace('viewBox="0 0 384 383.999986"', 'viewBox="0 40 384 245"')
    .replace('width="512"', 'width="384"')
    .replace('height="512"', 'height="245"');
  const logoDataUrl = `data:image/svg+xml;base64,${Buffer.from(croppedSvg).toString("base64")}`;

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
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 7, background: "#901A1C", display: "flex" }} />

        {/* Left — text content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "56px 56px 56px 72px",
          }}
        >
          <p
            style={{
              fontFamily: "serif",
              fontSize: 14,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: "#901A1C",
              margin: "0 0 24px",
              display: "flex",
            }}
          >
            Inkpot India Presents · Chapter Two
          </p>

          <img
            src={logoDataUrl}
            alt=""
            width={470}
            height={300}
            style={{ objectFit: "contain", objectPosition: "left center", marginBottom: 18 }}
          />

          <p
            style={{
              fontFamily: "serif",
              fontStyle: "italic",
              fontSize: 30,
              color: "#1a1a1a",
              margin: "0 0 22px",
              display: "flex",
            }}
          >
            Lost Grains of India
          </p>

          <div style={{ width: 48, height: 1, background: "#901A1C", margin: "0 0 22px", display: "flex" }} />

          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: 21,
              color: "rgba(0,0,0,0.48)",
              margin: "0 0 10px",
              letterSpacing: "0.06em",
              display: "flex",
            }}
          >
            26 September 2026 &nbsp;·&nbsp; Greenr Cafe, GK1, New Delhi
          </p>

          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: 19,
              color: "rgba(0,0,0,0.35)",
              margin: 0,
              letterSpacing: "0.04em",
              display: "flex",
            }}
          >
            ₹4,500 per seat &nbsp;·&nbsp; In Association with Dewar&#39;s Experiences
          </p>
        </div>

        {/* Right — primary red panel */}
        <div
          style={{
            width: 300,
            background: "#901A1C",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 28px",
            gap: 24,
          }}
        >
          <div style={{ width: 1, height: 72, background: "rgba(255,255,255,0.2)", display: "flex" }} />
          <p
            style={{
              fontFamily: "serif",
              fontStyle: "italic",
              fontSize: 24,
              color: "#ffffff",
              margin: 0,
              textAlign: "center",
              lineHeight: 1.6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            Where stories find{"\n"}their way onto{"\n"}the plate.
          </p>
          <div style={{ width: 1, height: 72, background: "rgba(255,255,255,0.2)", display: "flex" }} />
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
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
