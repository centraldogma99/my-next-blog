"use client";

import { useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { commands } from "@uiw/react-md-editor";
import type { ICommand } from "@uiw/react-md-editor";
import { ImagePlus } from "lucide-react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false },
);

const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
];

const VIDEO_TYPES = ["video/mp4", "video/webm"];

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  theme: string;
  height?: number;
}

function isAcceptedFile(file: File): boolean {
  return ACCEPTED_FILE_TYPES.includes(file.type);
}

function createPlaceholder(fileName: string): string {
  return `![Uploading ${fileName}...]()`;
}

function createMarkdown(
  url: string,
  fileName: string,
  isVideo: boolean,
): string {
  if (isVideo) {
    return `<video src="${url}" controls></video>`;
  }
  return `![${fileName}](${url})`;
}

async function uploadFile(
  file: File,
): Promise<{ url: string; type: "image" | "video" }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "업로드 실패");
  }

  return response.json();
}

function extractFilesFromEvent(
  e: React.DragEvent | React.ClipboardEvent,
): File[] {
  const items =
    "dataTransfer" in e ? e.dataTransfer?.files : e.clipboardData?.files;

  if (!items) return [];
  return Array.from(items).filter(isAcceptedFile);
}

export default function MarkdownEditor({
  value,
  onChange,
  theme,
  height = 500,
}: MarkdownEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  const handleUpload = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        const placeholder = createPlaceholder(file.name);
        const withPlaceholder = valueRef.current + "\n" + placeholder;
        onChange(withPlaceholder);
        valueRef.current = withPlaceholder;

        try {
          const result = await uploadFile(file);
          const isVideo = VIDEO_TYPES.includes(file.type);
          const markdown = createMarkdown(result.url, file.name, isVideo);
          const replaced = valueRef.current.replace(placeholder, markdown);
          onChange(replaced);
          valueRef.current = replaced;
        } catch (error) {
          console.error("Upload failed:", error);
          const replaced = valueRef.current.replace(
            placeholder,
            `<!-- 업로드 실패: ${file.name} -->`,
          );
          onChange(replaced);
          valueRef.current = replaced;
        }
      }
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      const files = extractFilesFromEvent(e);
      if (files.length === 0) return;

      e.preventDefault();
      e.stopPropagation();
      handleUpload(files);
    },
    [handleUpload],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const files = extractFilesFromEvent(e);
      if (files.length === 0) return;

      e.preventDefault();
      handleUpload(files);
    },
    [handleUpload],
  );

  const imageUploadCommand: ICommand = {
    name: "image-upload",
    keyCommand: "image-upload",
    buttonProps: { "aria-label": "이미지/동영상 업로드" },
    icon: <ImagePlus size={14} />,
    execute: () => {
      fileInputRef.current?.click();
    },
  };

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const acceptedFiles = Array.from(files).filter(isAcceptedFile);
      if (acceptedFiles.length > 0) {
        handleUpload(acceptedFiles);
      }

      e.target.value = "";
    },
    [handleUpload],
  );

  return (
    <div
      data-color-mode={theme}
      className="min-h-[500px]"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onPaste={handlePaste}
    >
      <div className="wmde-markdown-var">
        <MDEditor
          value={value}
          onChange={(v: string | undefined) => onChange(v || "")}
          preview="live"
          height={height}
          extraCommands={[
            imageUploadCommand,
            commands.divider,
            commands.codeEdit,
            commands.codeLive,
            commands.codePreview,
            commands.fullscreen,
          ]}
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES.join(",")}
        className="hidden"
        onChange={handleFileInputChange}
        multiple
      />
    </div>
  );
}
