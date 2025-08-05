import Link from "next/link";

export default function PostNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh_-_64px_-_var(--spacing)*24)] text-center">
      <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">
        404
      </h1>
      <h2 className="text-3xl font-bold mt-4 mb-4 text-gray-800 dark:text-gray-200">
        포스트를 찾을 수 없습니다
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        요청하신 포스트가 존재하지 않거나 삭제되었을 수 있습니다.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
