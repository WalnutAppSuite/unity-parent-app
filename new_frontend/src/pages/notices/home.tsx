import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import NoticeCard from '@/components/custom/notice card/index';
import NoticeCardSkeleton from '@/components/custom/notice card/skeleton';
import { useState, useEffect, useRef } from 'react';
import useNotice from '@/hooks/useNotice';

function NoticeListingPage() {
  const { t } = useTranslation('notice_listing');
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
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
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
    console.log(searchQuery)
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
      <div className="tw-flex tw-w-full tw-bg-background-custom tw-p-5">
        <div className="tw-relative tw-w-full tw-bg-secondary tw-rounded-full tw-overflow-hidden">
          <form onSubmit={handleSearch}>
            <Input
              className="tw-border-none !tw-h-12 tw-w-full tw-placeholder-primary tw-text-primary focus:tw-outline-none tw-rounded-full !tw-p-4"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="tw-absolute tw-top-1/2 tw-right-3 tw-transform tw--translate-y-1/2 tw-text-primary"
              onClick={handleSearch}
            >
              <Search />
            </button>
          </form>
        </div>
      </div>

      <div
        className="tw-flex tw-flex-col tw-w-full tw-flex-1 tw-overflow-y-auto tw-p-4 tw-gap-4"
      >
        {/* Initial loading skeletons */}
        {isLoading && (
          <>
            {
              Array.from({ length: 5 }).map((_, i) => (
                <NoticeCardSkeleton key={i} />
              ))
            }
          </>
        )}

        {/* Render all notices */}
        {allNotices.map((notice) => (
          <NoticeCard key={notice.name} notice={notice} />
        ))}

        {/* Loading more skeletons */}
        {isFetchingNextPage && (
          <>
            {
              Array.from({ length: 5 }).map((_, i) => (
                <NoticeCardSkeleton key={i} />
              ))
            }
          </>
        )}

        {/* Invisible trigger element for intersection observer */}
        {hasNextPage && <div ref={loadMoreRef} className="tw-h-4" />}

        {/* End of list message */}
        {!hasNextPage && allNotices.length > 0 && (
          <div className="tw-text-center tw-text-gray-500 tw-py-8">
            <p>You've reached the end of the notices</p>
          </div>
        )}

        {/* No notices found message */}
        {!isLoading && allNotices.length === 0 && (
          <div className="tw-text-center tw-text-gray-500 tw-py-16">
            <p>No notices found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NoticeListingPage;