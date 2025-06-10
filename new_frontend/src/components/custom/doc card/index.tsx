import { Badge } from '@/components/ui/badge';
import { FileCode } from 'lucide-react';

function DocCard() {
  return (
    <Badge
      className="tw-flex tw-justify-center tw-items-center tw-font-normal !tw-px-3 !tw-py-2 !tw-rounded-[6px] !tw-bg-[#544DDB]/10 !tw-text-primary tw-gap-2"
      variant="secondary"
    >
      <FileCode />
      AKDDJDKSMSS
    </Badge>
  );
}

export default DocCard;
