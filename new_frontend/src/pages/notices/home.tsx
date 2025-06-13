import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import NoticeCard from '@/components/custom/notice card/index';
import NoticeCardSkeleton from '@/components/custom/notice card/skeleton';
import { useState } from 'react';

function NoticeListingPage() {
  const { t } = useTranslation('notice_listing');

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(searchQuery);
    // add the search logic here
  };

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(searchQuery);
    // add the search logic here
  };

  return (
    <div className="tw-w-full tw-flex tw-flex-col tw-items-center">
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
              type="button"
              className="tw-absolute tw-top-1/2 tw-right-3 tw-transform tw--translate-y-1/2 tw-text-primary"
              onClick={handleSearchClick}
            >
              <Search />
            </button>
          </form>
        </div>
      </div>
      <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-p-4 tw-gap-3">
        <NoticeCard />
        <NoticeCardSkeleton />
      </div>
    </div>
  );
}

export default NoticeListingPage;
