export default function Loading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 pt-12 pb-24 px-6 animate-pulse">
      {/* 사이드바 스켈레톤 */}
      <aside className="lg:sticky lg:top-6 lg:h-fit">
        <div className="space-y-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </aside>
      
      {/* 포스트 목록 스켈레톤 */}
      <div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <article
              key={i}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
              <div className="flex gap-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}