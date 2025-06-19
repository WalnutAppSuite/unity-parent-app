import {
  CalendarDays,
  Camera,
  Clock,
  EllipsisVertical,
  Image,
  SquareChevronRight,
  Star,
  Archive,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion } from 'framer-motion';
import type { Notice } from '@/types/notice';
// import { formatDate } from '../../../../utils/formatDate';
import useNoticeActions from '../../../hooks/useNoticeActions'; 

interface NoticeCardProps {
  notice: Notice;

}

function NoticeCard({ notice }: NoticeCardProps) {
 
  const {
    toggleStar,
    toggleArchive,
    
    isStarring,
    isArchiving,
    starError,
    archiveError,
  } = useNoticeActions();

  const handleArchive = () => {
    toggleArchive(notice);
  };

  const handleStar = () => {
    toggleStar(notice);
    console.log(notice);
  };

  

  
  const isStarred = notice.is_stared === 1;
  const isArchived = notice.is_archived === 1;

  // Strip HTML tags from notice content for display
  const stripHtml = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Extract registration info from notice content (simple keyword check)
  const noticeText = stripHtml(notice.notice).toLowerCase();
  const requiresRegistration = noticeText.includes('registration') || 
                              noticeText.includes('register');
  
  const requiresSubmission = noticeText.includes('submit') || 
                            noticeText.includes('submission');

  // Truncate notice content for preview
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card 
      className={`tw-w-full tw-px-5 tw-py-4 !tw-rounded-3xl tw-text-primary/70 tw-cursor-pointer tw-relative
        ${isStarring || isArchiving ? 'tw-opacity-70 tw-pointer-events-none' : ''}
      `}
    >
      {/* Loading overlay */}
      {(isStarring || isArchiving) && (
        <div className="tw-absolute tw-inset-0 tw-bg-white/50 tw-flex tw-items-center tw-justify-center tw-rounded-3xl tw-z-10">
          <div className="tw-animate-spin tw-w-6 tw-h-6 tw-border-2 tw-border-blue-500 tw-border-t-transparent tw-rounded-full"></div>
        </div>
      )}

      <div className="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-mb-2">
        <div className="tw-flex tw-gap-2 tw-flex-wrap">
          {/* Student badge */}
          <Badge
            variant="secondary"
            className="!tw-rounded-full !tw-px-3 !tw-py-1 tw-text-xs tw-font-medium !tw-text-[#544DDB] !tw-bg-[#544DDB]/10"
          >
            {notice.student_first_name}
          </Badge>

          
        </div>
        
        <Popover>
          <PopoverTrigger onClick={(e) => e.stopPropagation()}>
            <EllipsisVertical className="tw-cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="!tw-w-28 tw-p-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.18 }}
              className="tw-flex tw-flex-col tw-gap-1"
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleArchive();
                }}
                disabled={isArchiving}
                className="tw-py-1 tw-px-2 tw-text-left tw-rounded hover:tw-bg-gray-100 tw-transition tw-flex tw-items-center tw-gap-2 disabled:tw-opacity-50"
              >
                <Archive className={`tw-w-4 tw-h-4`}/>
                {isArchiving ? 'Updating...' : (isArchived ? 'Unarchive' : 'Archive')}
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleStar();
                }}
                disabled={isStarring}
                className="tw-py-1 tw-px-2 tw-text-left tw-rounded hover:tw-bg-gray-100 tw-transition tw-flex tw-items-center tw-gap-2 disabled:tw-opacity-50"
              >
                <Star 
                  className={`tw-w-4 tw-h-4`}
                />
                {isStarring ? 'Updating...' : (isStarred ? 'Unstar' : 'Star')}
              </button>
            </motion.div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Error messages */}
      {starError && (
        <div className="tw-text-red-500 tw-text-xs tw-mb-2">
          Failed to star notice: {starError.message}
        </div>
      )}
      {archiveError && (
        <div className="tw-text-red-500 tw-text-xs tw-mb-2">
          Failed to archive notice: {archiveError.message}
        </div>
      )}
      
      <div className="tw-flex tw-flex-col tw-gap-[6px]">
        <h2 className="tw-text-primary tw-font-medium tw-text-xl">Electric Saturday</h2>
        <span className="tw-flex tw-justify-between tw-items-center tw-gap-[6px]">
          <p className="tw-w-fit tw-text-primary">Registration Required</p>
          <span className="tw-w-fit">
            <Badge
              variant="secondary"
              className="!tw-rounded-full !tw-px-3 !tw-py-1 tw-text-xs tw-font-medium !tw-text-[#544DDB] !tw-bg-[#544DDB]/10"
            >
              Yes
            </Badge>{' '}
            <Badge
              variant="secondary"
              className="!tw-rounded-full !tw-px-3 !tw-py-1 tw-text-xs tw-font-medium !tw-text-[#544DDB] !tw-bg-[#544DDB]/10"
            >
              Submit Entry
            </Badge>
          </span>
        </span>
        <p className="tw-mb-2">Dear Parents, We are happy to inform you that the class...</p>
      </div>
      <div className="tw-flex tw-justify-between tw-items-center tw-border-t tw-border-[#544DDB]/10 tw-pt-2">
        <span className="tw-flex tw-w-fit tw-gap-1">
          <CalendarDays />
          <p>6-2-2025</p>
        </span>
        <span className="tw-flex tw-w-fit tw-gap-4">
          <Camera />
          <Image />
          <Clock />
          <SquareChevronRight />
        </span>
      </div>
    </Card>
  );
}

export default NoticeCard;
