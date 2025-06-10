import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import NoticeCard from '@/components/custom/notice card/index';
import NoticeCardSkeleton from '@/components/custom/notice card/skeleton';
import ProfileWrapper from '@/components/custom/ProfileWrapper';
import Daily from '@/components/custom/curriculum updates card/daily/index';
import Portion from '@/components/custom/curriculum updates card/portion';
import Weekly from '@/components/custom/curriculum updates card/weekly/index';
import { DailySkeleton } from '@/components/custom/curriculum updates card/daily/skeleton';
import { PortionSkeleton } from '@/components/custom/curriculum updates card/portion/skeleton';
import { WeeklySkeleton } from '@/components/custom/curriculum updates card/weekly/skeleton';

function NoticeListingPage() {
  const { t } = useTranslation('notice_listing');
  return (
    <div className="tw-w-full tw-flex tw-flex-col tw-items-center">
      <div className="tw-flex tw-w-full tw-bg-background-custom tw-p-5">
        <div className="tw-relative tw-w-full tw-bg-secondary tw-rounded-full tw-overflow-hidden">
          <Input
            className="tw-border-none !tw-h-12 tw-w-full tw-placeholder-primary tw-text-primary focus:tw-outline-none tw-rounded-full !tw-p-4"
            placeholder={t('search')}
          />
          <Search
            className="tw-absolute tw-top-1/2 tw-right-2 tw-transform tw--translate-y-1/2 tw-text-primary"
            onClick={() => console.log('Search')}
          />
        </div>
      </div>
      <div className="tw-flex tw-flex-col tw-w-full tw-h-full tw-p-4 tw-gap-3">
        <NoticeCard />
        <NoticeCardSkeleton />
        <ProfileWrapper />
        <Daily />
        <DailySkeleton />
        <Portion />
        <PortionSkeleton />
        <Weekly />
        <WeeklySkeleton />
      </div>
    </div>
  );
}

export default NoticeListingPage;
