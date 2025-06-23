import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import NoticeCard from '@/components/custom/notice card/index';
import NoticeCardSkeleton from '@/components/custom/notice card/skeleton';
import { useState, useEffect, useRef } from 'react';
import useNotice from '@/hooks/useNotice';

function ArchivedNoticesPage() {
  const { t } = useTranslation('notice_listing');
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useNotice({
    search_query: submittedQuery,
    staredOnly: false,
    archivedOnly: true,  
    limit: 10,
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  
  
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }
  
 
  timeoutRef.current = setTimeout(() => {
    console.log("search clicked")
    setSubmittedQuery(searchQuery);
  }, 500);
};

  // Flatten all notices from all pages into a single array
  const allNotices = data?.pages.flatMap(page => page.message.notices) || [];

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;
    if (!loadMoreElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: '100px', // Trigger 100px before the element comes into view
      }
    );

    observer.observe(loadMoreElement);

    return () => {
      observer.unobserve(loadMoreElement);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="tw-w-full tw-flex tw-flex-col tw-items-center tw-h-screen">
     
      {/* Search Bar */}
      <div className="tw-flex tw-w-full tw-bg-background-custom tw-p-5">
        <div className="tw-relative tw-w-full tw-bg-secondary tw-rounded-full tw-overflow-hidden">
          <form onSubmit={handleSearch}>
            <Input
              className="tw-border-none !tw-h-12 tw-w-full tw-placeholder-primary tw-text-primary focus:tw-outline-none tw-rounded-full !tw-p-4"
               placeholder={`${t('search')} in archived notices...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="tw-absolute tw-top-1/2 tw-right-3 tw-transform tw--translate-y-1/2 tw-text-primary hover:tw-text-[#544DDB] tw-transition-colors"
              onClick={handleSearch}
            >
              <Search />
            </button>
          </form>
        </div>
      </div>

      <div className="tw-flex tw-flex-col tw-w-full tw-flex-1 tw-overflow-y-auto tw-p-4 tw-gap-4">
        {/* Initial loading skeletons */}
        {isLoading && (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <NoticeCardSkeleton key={`loading-${i}`} />
            ))}
          </>
        )}

        {/* Render all archived notices */}
        {!isLoading && allNotices.map((notice) => (
          <NoticeCard key={notice.name} notice={notice} />
        ))}

        {/* Loading more skeletons */}
        {isFetchingNextPage && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <NoticeCardSkeleton key={`loading-more-${i}`} />
            ))}
          </>
        )}

        {/* Invisible trigger element for intersection observer */}
        {hasNextPage && <div ref={loadMoreRef} className="tw-h-4" />}

        {/* End of list message */}
        {!hasNextPage && allNotices.length > 0 && (
          <div className="tw-text-center tw-text-gray-500 tw-py-8">
            <div className="tw-flex tw-items-center tw-justify-center tw-gap-2">
              <p>You've reached the end of your archived notices</p>
            </div>
          </div>
        )}

        {/* No archived notices found message */}
        {!isLoading && allNotices.length === 0 && (
          <div className="tw-text-center tw-text-gray-500 tw-py-16">
            <div className="tw-flex tw-flex-col tw-items-center tw-gap-4">
              
              
              {submittedQuery ? (
                <>
                  <h3 className="tw-text-lg tw-font-medium tw-text-gray-700">
                    No archived notices match "{submittedQuery}"
                  </h3>
                  <p className="tw-text-sm tw-max-w-sm tw-mx-auto tw-text-gray-500">
                    Try a different search term or clear the search to see all your archived notices.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSubmittedQuery('');
                    }}
                    className="tw-mt-2 tw-px-4 tw-py-2 tw-bg-[#544DDB] tw-text-white tw-rounded-full tw-text-sm hover:tw-bg-[#544DDB]/90 tw-transition-colors"
                  >
                    Clear Search
                  </button>
                </>
              ) : (
                <>
                  <h3 className="tw-text-lg tw-font-medium tw-text-gray-700">
                    No archived notices yet
                  </h3>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArchivedNoticesPage;