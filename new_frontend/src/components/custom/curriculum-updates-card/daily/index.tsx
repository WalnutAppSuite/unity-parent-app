import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, CircleChevronRight } from 'lucide-react';
import DocCard from '@/components/custom/doc-card/index';
import type { Cmap } from '@/hooks/useCmapList';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '@/utils/formatDate';
import { useTranslation } from 'react-i18next';

function Daily({ data }: { data: Cmap }) {
  const [open, setOpen] = useState(false);
  const formattedDate = formatDate(data.real_date);
  const { t } = useTranslation('daily_card');

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
            {t('period')} {data.period}
          </Badge>
          <span className="tw-flex tw-items-center tw-gap-2">
            <CalendarDays /> {formattedDate}
          </span>
        </div>
        <div>{t('chapter')} : {data.products[0].chapter_name}</div>
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
          <p className="tw-text-[18px] tw-font-semibold tw-text-primary">{t('notes')}</p>
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
              <div className="tw-text-primary/80 tw-py-2 tw-space-y-3">
                {/* Extract unique, non-empty values */}
                {(() => {
                  const broadcasts = Array.from(new Set(data.products.map(p => p.broadcast_description).filter(Boolean)));
                  const parentNotes = Array.from(new Set(data.products.map(p => p.parentnote_description).filter(Boolean)));
                  const homeworks = Array.from(new Set(data.products.map(p => p.homework_description).filter(Boolean)));
                  const hasContent = broadcasts.length || parentNotes.length || homeworks.length;
                  return (
                    <>
                      {broadcasts.length > 0 && (
                        <div>
                          <div className="tw-font-semibold tw-mb-1">{t('broadcasts', 'Broadcasts')}</div>
                          <ul className="tw-list-disc tw-ml-5">
                            {broadcasts.map((b, i) => <li key={i}>{b}</li>)}
                          </ul>
                        </div>
                      )}
                      {parentNotes.length > 0 && (
                        <div>
                          <div className="tw-font-semibold tw-mb-1">{t('parentNotes', 'Parent Note')}</div>
                          <ul className="tw-list-disc tw-ml-5">
                            {parentNotes.map((n, i) => <li key={i}>{n}</li>)}
                          </ul>
                        </div>
                      )}
                      {homeworks.length > 0 && (
                        <div>
                          <div className="tw-font-semibold tw-mb-1">{t('homeworks', 'Home Work')}</div>
                          <ul className="tw-list-disc tw-ml-5">
                            {homeworks.map((h, i) => <li key={i}>{h}</li>)}
                          </ul>
                        </div>
                      )}
                      {!hasContent && (
                        <div className="tw-text-primary/50 tw-text-sm">{t('noNotes', 'No additional notes')}</div>
                      )}
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export default Daily;
