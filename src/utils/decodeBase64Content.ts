export const decodeBase64Content = (base64String: string): string => {
  try {
    // Node.js 환경에서 Buffer 사용
    return Buffer.from(base64String, "base64").toString("utf-8");
  } catch (error) {
    console.error("Base64 디코딩 실패:", error);
    throw new Error("Base64 디코딩에 실패했습니다");
  }
};
