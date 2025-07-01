import {
  CalendarDays,
  Star,
  Archive,
  Circle,
}
  from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Notice } from '@/types/notice';
import { formatDate } from '@/utils/formatDate';
import { useNavigate } from 'react-router-dom';
import useNoticeActions from '@/hooks/useNoticeActions';
import { useEffect, useState } from 'react';

interface NoticeCardProps {
  notice: Notice;
}

function NoticeCard({ notice }: NoticeCardProps) {

  const { toggleArchive, toggleStar } = useNoticeActions();
  const [isStarred, setIsStarred] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  useEffect(() => {
    setIsStarred(notice?.is_stared === 1);
    setIsArchived(notice?.is_archived === 1);
  }, [notice]);

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsArchived(true);
    toggleArchive(notice);
  };

  const handleStar = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStarred(true);
    toggleStar(notice);
  };

  const navigate = useNavigate();

  const stripHtml = (html: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleRedirect = () => {
    navigate(`/notices/${notice.name}`, {
      state: {
        notice: notice.name,
        studentId: notice.student,
      }
    });
  }

  return (
    <Card onClick={handleRedirect} className='tw-w-full tw-h-fit !tw-rounded-3xl tw-text-primary/70 tw-bg-white'>
      <div className={`tw-py-4 tw-px-5 !tw-rounded-3xl ${notice.is_read ? 'tw-bg-secondary' : 'tw-bg-primary/5'}`} >
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
          <div className='tw-flex tw-gap-2 '>
            <button onClick={handleStar} className='tw-z-10'><Star size={24} className={`${isStarred ? 'tw-fill-yellow-400 tw-text-yellow-400' : ''}`} /></button>
            <button onClick={handleArchive} className='tw-z-10'><Archive size={24} className={`${isArchived ? 'tw-fill-blue-400 tw-text-blue-400' : ''}`} /></button>
          </div>
        </div>

        <div className="tw-flex tw-flex-col tw-gap-[6px]">
          <h2 className="tw-text-primary tw-font-medium tw-text-xl">{notice.subject}</h2>
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

          <span className='tw-flex tw-w-fit tw-gap-1 tw-items-center tw-text-sm'>
            <Circle className={`tw-w-4 tw-h-4 ${!notice.is_read ? 'tw-fill-green-500 tw-text-green-500' : 'tw-fill-orange-500 tw-text-orange-500'}`} />
            {notice.is_read ? 'Read' : 'Unread'}
          </span>
        </div>
      </div>
    </Card >
  );
}

export default NoticeCard;