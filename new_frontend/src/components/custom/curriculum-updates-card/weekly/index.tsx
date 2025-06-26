import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import DocCard from '../../doc-card';
import { useTranslation } from 'react-i18next';

function Weekly({ data }: { data: any[] | any }) {
  const items = Array.isArray(data) ? data : [data];
  const { t } = useTranslation('weekly_card');

  return (
    <>
      {items.map((item, index) => (
        <Card
          key={item.name || `item-${index}`}
          className="tw-w-full tw-px-5 tw-py-3 !tw-rounded-3xl tw-text-primary tw-flex tw-flex-col tw-gap-2 tw-shadow-md"
          tabIndex={0}
          role="region"
        >
          <div className="tw-flex tw-items-center tw-justify-between">
            <div className="tw-flex tw-items-center tw-gap-2">
              <Badge
                className="tw-text-xs !tw-px-3 !tw-py-1 !tw-rounded-full !tw-bg-[#544DDB]/10 !tw-text-[#544DDB]"
                variant="secondary"
              >
                {t('period')} {item.period}
              </Badge>
            </div>
            <span className="tw-flex tw-items-center tw-gap-2 tw-text-primary/70">
              <CalendarDays /> {formatDate(item.real_date)}
            </span>
          </div>
          <div className="tw-text-lg tw-mt-2">{t('unit')} {item.unit} : {item.products?.[0]?.chapter_name}</div>
          <div className="tw-flex tw-gap-2 tw-overflow-x-scroll">
            {item.products?.map((product: any, productIndex: number) => (
              <DocCard
                key={product.name || `product-${productIndex}`}
                name={product.item}
                url={product.item_data?.custom_product_url}
                type={product.item_group}
              />
            ))}
          </div>
        </Card>
      ))}
    </>
  );
}

export default Weekly;
