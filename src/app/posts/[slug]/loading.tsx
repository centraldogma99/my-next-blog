export default function Loading() {
  return (
    <article className="max-w-full animate-pulse">
      <div className="lg:flex lg:gap-2 relative max-w-full">
        {/* TableOfContents 스켈레톤 */}
        <div className="py-4 w-[280px] hidden lg:block lg:sticky lg:top-20 lg:overflow-y-auto lg:self-start flex-shrink-0">
          <div className="space-y-3 px-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 ml-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 ml-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 ml-4"></div>
          </div>
        </div>
        
        {/* 메인 콘텐츠 스켈레톤 */}
        <div className="flex-1 py-6 pt-12 pb-24 px-6 min-w-0">
          <div className="max-w-4xl mx-auto">
            {/* 제목 스켈레톤 */}
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-8"></div>
            
            {/* 본문 스켈레톤 */}
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-8 mb-4"></div>
              
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              
              {/* 코드 블록 스켈레톤 */}
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded my-6"></div>
              
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-8 mb-4"></div>
              
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}