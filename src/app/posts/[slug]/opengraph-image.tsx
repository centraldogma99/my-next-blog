import { ImageResponse } from "next/og";
import { fetchSingleBlogPost } from "@/utils/api/github";
import { SITE_NAME } from "@/constants/site";

export const runtime = "edge";

export const alt = "Blog Post";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await fetchSingleBlogPost(slug, false);
  const title = post.frontmatter.title;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(to bottom right, #1a1a1a, #2d2d2d)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 300,
            opacity: 0.8,
            marginBottom: 20,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 600,
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "80%",
          }}
        >
          {title}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
