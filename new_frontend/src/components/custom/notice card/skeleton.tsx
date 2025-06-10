import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

function NoticeCardSkeleton() {
  // Animation settings for the breathing effect
  const breathe = {
    initial: { opacity: 0.6, scale: 1 },
    animate: { opacity: [0.6, 1, 0.6], scale: [1, 1.04, 1] },
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  };

  return (
    <Card className="tw-w-full tw-px-5 tw-py-4 !tw-rounded-3xl">
      <div className="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-mb-2">
        <motion.div {...breathe} className="tw-h-6 tw-w-14 tw-bg-gray-300/40 tw-rounded-full" />
        <motion.div {...breathe} className="tw-h-5 tw-w-5 tw-bg-gray-300/40 tw-rounded-full" />
      </div>
      <div className="tw-flex tw-flex-col tw-gap-[6px]">
        <motion.div {...breathe} className="tw-h-6 tw-w-32 tw-bg-gray-300/40 tw-rounded" />
        <span className="tw-flex tw-justify-between tw-items-center tw-gap-[6px]">
          <motion.div {...breathe} className="tw-w-28 tw-h-4 tw-bg-gray-300/40 tw-rounded" />
          <span className="tw-flex tw-gap-2">
            <motion.div {...breathe} className="tw-h-5 tw-w-12 tw-bg-gray-300/40 tw-rounded-full" />
            <motion.div {...breathe} className="tw-h-5 tw-w-20 tw-bg-gray-300/40 tw-rounded-full" />
          </span>
        </span>
        <motion.div {...breathe} className="tw-mb-2 tw-h-4 tw-w-3/4 tw-bg-gray-300/40 tw-rounded" />
      </div>
      <div className="tw-flex tw-justify-between tw-items-center tw-border-t tw-border-[#544DDB]/10 tw-pt-2">
        <span className="tw-flex tw-w-fit tw-gap-1">
          <motion.div {...breathe} className="tw-h-4 tw-w-4 tw-bg-gray-300/40 tw-rounded" />
          <motion.div {...breathe} className="tw-h-4 tw-w-16 tw-bg-gray-300/40 tw-rounded" />
        </span>
        <span className="tw-flex tw-w-fit tw-gap-4">
          <motion.div {...breathe} className="tw-h-4 tw-w-4 tw-bg-gray-300/40 tw-rounded" />
          <motion.div {...breathe} className="tw-h-4 tw-w-4 tw-bg-gray-300/40 tw-rounded" />
          <motion.div {...breathe} className="tw-h-4 tw-w-4 tw-bg-gray-300/40 tw-rounded" />
          <motion.div {...breathe} className="tw-h-4 tw-w-4 tw-bg-gray-300/40 tw-rounded" />
        </span>
      </div>
    </Card>
  );
}

export default NoticeCardSkeleton;
