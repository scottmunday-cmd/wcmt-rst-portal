import { ImageResponse } from "next/og";

// Next's file-convention OG image route: having this file alone wires up
// og:image (and, via the twitter fallback set in layout.tsx, twitter:image
// too) on every page that doesn't define its own opengraph-image — no
// static PNG to keep in sync with the copy below. Built from text/shapes
// rather than the logo PNGs so it doesn't need to fetch/decode an image at
// request time. Added 21 October 2026 as part of the SEO pass.
export const alt =
  "West Coast Marine Training — WA Recreational Skipper's Ticket (RST) online training";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B2545 0%, #134074 100%)",
          fontFamily: "sans-serif",
          padding: "80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: "#F26B38",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          West Coast Marine Training
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 60,
            fontWeight: 700,
            color: "white",
            lineHeight: 1.15,
          }}
        >
          WA Recreational Skipper&apos;s Ticket — Online
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 30,
            color: "#CBD5E1",
          }}
        >
          Learn Online. Boat Safely. Pass With Confidence.
        </div>
      </div>
    ),
    { ...size }
  );
}
