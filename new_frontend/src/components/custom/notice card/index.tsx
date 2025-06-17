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
import {formatDate} from '../../../../utils/formatDate';

interface NoticeCardProps {
  notice: Notice;
  onArchive?: (notice: Notice) => void;
  onStar?: (notice: Notice) => void;
}

function NoticeCard({ notice, onArchive, onStar }: NoticeCardProps) {
  const handleArchive = () => {
    onArchive?.(notice);
  };

  const handleStar = () => {
    onStar?.(notice);
  };

  // Format date from creation timestamp
  

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

  // Get notification type color
  const getNotificationTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'everyone':
        return '!tw-text-blue-600 !tw-bg-blue-100';
      case 'important':
        return '!tw-text-red-600 !tw-bg-red-100';
      case 'urgent':
        return '!tw-text-orange-600 !tw-bg-orange-100';
      default:
        return '!tw-text-[#544DDB] !tw-bg-[#544DDB]/10';
    }
  };

  return (
    <Card className={`tw-w-full tw-px-5 tw-py-4 !tw-rounded-3xl tw-text-primary/70` 
      // ${
      // !notice.is_read ? 'tw-border-l-4 tw-border-l-blue-500' : ''
    // }`
    }>
      <div className="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-mb-2">
        <div className="tw-flex tw-gap-2 tw-flex-wrap">
          {/* Student badge */}
          <Badge
            variant="secondary"
            className="!tw-rounded-full !tw-px-3 !tw-py-1 tw-text-xs tw-font-medium !tw-text-[#544DDB] !tw-bg-[#544DDB]/10"
          >
            {notice.student_first_name} 
            {/* ({notice.student}) */}
          </Badge>
          
          {/* Notification type badge */}
          {/* <Badge
            variant="secondary"
            className={`!tw-rounded-full !tw-px-3 !tw-py-1 tw-text-xs tw-font-medium ${getNotificationTypeColor(notice.type_of_notifications)}`}
          >
            {notice.type_of_notifications}
          </Badge> */}
          
          {/* New badge for unread notices */}
          {/* {!notice.is_read && (
            <Badge
              variant="secondary"
              className="!tw-rounded-full !tw-px-3 !tw-py-1 tw-text-xs tw-font-medium !tw-text-green-600 !tw-bg-green-100"
            >
              New
            </Badge>
          )} */}
        </div>
        
        <Popover>
          <PopoverTrigger>
            <EllipsisVertical className="tw-cursor-pointer" />
          </PopoverTrigger>
          <PopoverContent className="!tw-w-32 tw-p-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.18 }}
              className="tw-flex tw-flex-col tw-gap-1"
            >
              <button 
                onClick={handleArchive}
                className="tw-py-1 tw-px-2 tw-text-left tw-rounded hover:tw-bg-gray-100 tw-transition tw-flex tw-items-center tw-gap-2"
              >
                <Archive className="tw-w-4 tw-h-4" />
                {notice.is_archived ? 'Unarchive' : 'Archive'}
              </button>
              <button 
                onClick={handleStar}
                className="tw-py-1 tw-px-2 tw-text-left tw-rounded hover:tw-bg-gray-100 tw-transition tw-flex tw-items-center tw-gap-2"
              >
                {/* <Star className={`tw-w-4 tw-h-4 ${notice.is_stared ? 'tw-fill-yellow-400 tw-text-yellow-400' : ''}`} /> */}
                {notice.is_stared ? 'Unstar' : 'Star'}
              </button>
            </motion.div>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="tw-flex tw-flex-col tw-gap-[6px]">
        <h2 className="tw-text-primary tw-font-medium tw-text-xl">{notice.subject}</h2>
        
        {/* Show class and division if available */}
        {(notice.class || notice.division) && (
          <div className="tw-flex tw-gap-2 tw-mb-1">
            {notice.class && (
              <Badge
                variant="outline"
                className="!tw-rounded-full !tw-px-2 !tw-py-0.5 tw-text-xs"
              >
                Class: {notice.class}
              </Badge>
            )}
            {notice.division && (
              <Badge
                variant="outline"
                className="!tw-rounded-full !tw-px-2 !tw-py-0.5 tw-text-xs"
              >
                Division: {notice.division}
              </Badge>
            )}
          </div>
        )}
        
        {/* Requirements section */}
        {(requiresRegistration || requiresSubmission) && (
          <span className="tw-flex tw-justify-between tw-items-center tw-gap-[6px] tw-mb-2">
            <p className="tw-w-fit tw-text-primary">Requirements</p>
            <span className="tw-w-fit tw-flex tw-gap-2">
              {requiresRegistration && (
                <Badge
                  variant="secondary"
                  className="!tw-rounded-full !tw-px-3 !tw-py-1 tw-text-xs tw-font-medium !tw-text-[#544DDB] !tw-bg-[#544DDB]/10"
                >
                  Registration
                </Badge>
              )}
              {requiresSubmission && (
                <Badge
                  variant="secondary"
                  className="!tw-rounded-full !tw-px-3 !tw-py-1 tw-text-xs tw-font-medium !tw-text-[#544DDB] !tw-bg-[#544DDB]/10"
                >
                  Submit Entry
                </Badge>
              )}
            </span>
          </span>
        )}
        
        {/* Notice content */}
        <p className="tw-mb-2 tw-text-sm tw-text-gray-600">
          {truncateText(stripHtml(notice.notice))}
        </p>
      </div>
      
      <div className="tw-flex tw-justify-between tw-items-center tw-border-t tw-border-[#544DDB]/10 tw-pt-2">
        <span className="tw-flex tw-w-fit tw-gap-1 tw-items-center tw-text-sm">
          <CalendarDays className="tw-w-4 tw-h-4" />
          <p>{formatDate(notice.creation)}</p>
        </span>
        
        <span className="tw-flex tw-w-fit tw-gap-4">
          {/* Show camera icon if notice mentions photo/image */}
          {(noticeText.includes('photo') || 
            noticeText.includes('image') ||
            noticeText.includes('picture')) && (
            <Camera className="tw-w-5 tw-h-5 tw-text-gray-500" />
          )}
          
          {/* Show image icon if there's HTML content */}
          {notice.html && (
            <Image className="tw-w-5 tw-h-5 tw-text-gray-500" />
          )}
          
          {/* Show clock if notice mentions time/deadline */}
          {(noticeText.includes('deadline') || 
            noticeText.includes('time') ||
            noticeText.includes('due')) && (
            <Clock className="tw-w-5 tw-h-5 tw-text-gray-500" />
          )}
          
          <SquareChevronRight className="tw-w-5 tw-h-5 tw-text-gray-500 tw-cursor-pointer" />
        </span>
      </div>
    </Card>
  );
}

export default NoticeCard;