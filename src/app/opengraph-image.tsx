import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/constants/site";

export const runtime = "edge";

export const alt = SITE_NAME;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(to bottom right, #1a1a1a, #2d2d2d)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 300,
            letterSpacing: "-0.05em",
            marginBottom: 20,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 300,
            opacity: 0.8,
          }}
        >
          기술, 개발, 그리고 일상을 기록하는 블로그
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}