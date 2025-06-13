import {
  CalendarDays,
  Camera,
  Clock,
  EllipsisVertical,
  Image,
  SquareChevronRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion } from 'framer-motion';

function NoticeCard() {
  const handleMenuClick = () => {
    console.log('Menu Clicked');
  };

  return (
    <Card className="tw-w-full tw-px-5 tw-py-4 !tw-rounded-3xl tw-text-primary/70">
      <div className="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-mb-2">
        <Badge
          variant="secondary"
          className="!tw-rounded-full !tw-px-3 !tw-py-1 tw-text-xs tw-font-medium !tw-text-[#544DDB] !tw-bg-[#544DDB]/10"
        >
          Adarsh
        </Badge>
        <Popover>
          <PopoverTrigger>
            <EllipsisVertical />
          </PopoverTrigger>
          <PopoverContent className="!tw-w-28 tw-p-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.18 }}
              className="tw-flex tw-flex-col tw-gap-1"
            >
              <button className="tw-py-1 tw-px-2 tw-text-left tw-rounded hover:tw-bg-gray-100 tw-transition">Archive</button>
              <button className="tw-py-1 tw-px-2 tw-text-left tw-rounded hover:tw-bg-gray-100 tw-transition">Star</button>
            </motion.div>
          </PopoverContent>
        </Popover>
      </div>
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
