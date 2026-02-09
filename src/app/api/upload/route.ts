import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { validateAuth } from "@/utils/api";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];

const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

/** 서버 업로드 최대 크기: 4.5MB (Vercel 서버 제한) */
const MAX_FILE_SIZE = 4.5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const authResult = await validateAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "파일이 없습니다." },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          message: `허용되지 않는 파일 형식입니다. 허용: ${ALLOWED_TYPES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          message: `파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / 1024 / 1024}MB까지 허용됩니다.`,
        },
        { status: 400 },
      );
    }

    const blob = await put(`blog-assets/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    return NextResponse.json({
      url: blob.url,
      type: isVideo ? "video" : "image",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "파일 업로드 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
