import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, CircleChevronRight } from 'lucide-react';
import DocCard from '@/components/custom/doc card/index';
import type { Cmap } from '@/hooks/useCmapList';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/utils/formatDate';
import { getChapterName } from '@/utils/trimChapterName';

function Daily({ data }: { data: Cmap }) {
  const [open, setOpen] = useState(false);
  const formattedDate = formatDate(data.real_date);

  return (
    <motion.div layout initial={false} className="tw-w-full">
      <Card
        className="tw-w-full tw-px-5 tw-py-3 !tw-rounded-3xl tw-text-primary/70 tw-flex tw-flex-col tw-gap-[10px] tw-cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
        tabIndex={0}
        role="button"
        aria-expanded={open}
      >
        <div className="tw-flex tw-items-center tw-justify-between">
          <Badge
            className="tw-text-xs !tw-px-3 !tw-py-1 !tw-rounded-full !tw-bg-[#544DDB]/10 !tw-text-[#544DDB]"
            variant="secondary"
          >
            Period {data.period}
          </Badge>
          <span className="tw-flex tw-items-center tw-gap-2">
            <CalendarDays /> {formattedDate}
          </span>
        </div>
        <div>Chapter : {getChapterName(data.products[0].chapter)}</div>
        <div
          className="tw-flex tw-items-center tw-gap-1 tw-overflow-x-scroll"
          id="doc-card"
        >
          {data.products.map((product, index) => (
            <DocCard
              key={product.name + index}
              name={product.item_data?.item_name}
              url={product.item_data?.custom_product_url}
              type={product.item_data?.item_group}
            />
          ))}
        </div>
        <div className="tw-flex tw-items-center tw-justify-between tw-mt-2">
          <p className="tw-text-[18px] tw-font-semibold tw-text-primary">Notes</p>
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.45, ease: [0.42, 0, 0.58, 1] }}
          >
            <CircleChevronRight />
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="accordion-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="tw-overflow-hidden"
            >
              <div className="tw-text-primary/80 tw-py-2">
                This is the content inside the accordion. You can add any HTML or components here.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export default Daily;
