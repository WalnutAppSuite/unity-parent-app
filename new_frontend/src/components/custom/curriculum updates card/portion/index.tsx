import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DocCard from '@/components/custom/doc card/index';

function Portion() {
  return (
    <Card
      className="tw-w-full tw-px-5 tw-py-3 !tw-rounded-3xl tw-text-primary/70 tw-flex tw-flex-col tw-gap-[10px] tw-cursor-pointer"
      tabIndex={0}
      role="button"
    >
      <div className="tw-flex tw-items-center tw-justify-between">
        <Badge
          className="tw-text-xs !tw-px-3 !tw-py-1 !tw-rounded-full !tw-bg-[#544DDB]/10 !tw-text-[#544DDB]"
          variant="secondary"
        >
          Textbook: 8 Creative Writing
        </Badge>
        <span className="tw-flex tw-items-center tw-gap-2">
          6 files
        </span>
      </div>
      <div>Chapter : Writing Formal Letters</div>
      <div
        className="tw-flex tw-items-center tw-gap-1 tw-overflow-x-scroll"
        id="doc-card"
      >
        <DocCard />
        <DocCard />
        <DocCard />
      </div>
    </Card>
  );
}

export default Portion;
