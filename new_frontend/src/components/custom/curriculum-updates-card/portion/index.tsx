import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DocCard from '@/components/custom/doc-card/index';

function Portion({ item, textbook }: { item: any; textbook: string }) {

  console.log(item);
  

  const chapterMap: { [chapter: string]: any[] } = {};
  let totalFiles = 0;
  Object.entries(item).forEach(([_, cmapItems]: [string, unknown]) => {
    if (Array.isArray(cmapItems)) {
      cmapItems.forEach((cmapItem) => {
        if (!chapterMap[cmapItem.chapter]) chapterMap[cmapItem.chapter] = [];
        chapterMap[cmapItem.chapter].push(cmapItem);
        totalFiles += cmapItem.count || 0;
      });
    }
  });

  return (
    <Card className="tw-w-full tw-px-5 tw-py-3 !tw-rounded-3xl tw-text-primary/70 tw-flex tw-flex-col tw-gap-2 tw-cursor-pointer" tabIndex={0} role="region">
      <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
        <Badge className="tw-text-xs !tw-px-3 !tw-py-1 !tw-rounded-full !tw-bg-[#544DDB]/10 !tw-text-[#544DDB]" variant="secondary">
          Textbook : {textbook}
        </Badge>
        <span className="tw-text-xs tw-text-right">{totalFiles} files</span>
      </div>
      {Object.entries(chapterMap).map(([chapter, cmapItems]) => (
        <div key={chapter} className="tw-mb-2">
          <div className="tw-text-base tw-font-semibold tw-mb-1 tw-text-primary">Chapter : {cmapItems[0]?.chapter_name || chapter}</div>
          <div className="tw-flex tw-gap-2 tw-overflow-x-scroll">
            {cmapItems.map((cmapItem, idx) =>
              (cmapItem.products || []).map((product: any, pIdx: number) => (
                <DocCard key={pIdx + '-' + idx} name={product.name} url={product.url} type={cmapItem.item_group}/>
              ))
            )}
          </div>
        </div>
      ))}
    </Card>
  );
}

export default Portion;