import { Badge } from '@/components/ui/badge';
import {
  FileCode,
  FileText,
  BookOpen,
  FileBarChart,
  FileSignature,
  FileSpreadsheet,
} from 'lucide-react';
import type { ReactNode } from 'react';

interface DocCardProps {
  name?: string;
  url?: string;
  type?: string;
}

interface DocStyle {
  icon: ReactNode;
  className: string;
}

const docTypeStyles: { check: (t: string) => boolean; icon: ReactNode; className: string }[] = [
  {
    check: (t) => t.includes('worksheet'),
    icon: <FileText />,
    className: '!tw-bg-[#FFEDD5]/80 !tw-text-[#F97316]',
  },
  {
    check: (t) => t.includes('ebook') || t.includes('e book'),
    icon: <BookOpen />,
    className: '!tw-bg-[#DBEAFE]/80 !tw-text-[#2563EB]',
  },
  {
    check: (t) => t.includes('test byte'),
    icon: <FileBarChart />,
    className: '!tw-bg-[#DCFCE7]/80 !tw-text-[#22C55E]',
  },
  {
    check: (t) => t.includes('answer sheet'),
    icon: <FileSignature />,
    className: '!tw-bg-[#FCE7F3]/80 !tw-text-[#DB2777]',
  },
  {
    check: (t) => t.includes('presentation') || t.includes('powerpoint'),
    icon: <FileSpreadsheet />,
    className: '!tw-bg-[#FEF9C3]/80 !tw-text-[#CA8A04]',
  },
];

const getDocCardStyleAndIcon = (type?: string): DocStyle => {
  const normalized = type?.toLowerCase() ?? '';
  const matched = docTypeStyles.find(({ check }) => check(normalized));
  return (
    matched || {
      icon: <FileCode />,
      className: '!tw-bg-[#544DDB]/10 !tw-text-primary',
    }
  );
};

const DocCard = ({ name = 'Untitled', url, type = '' }: DocCardProps) => {
  const { icon, className } = getDocCardStyleAndIcon(type);

  const handleClick = () => {
    if (url) window.open(url, '_blank');
    else console.warn('No URL provided for the document');
  };

  return (
    <Badge
      onClick={handleClick}
      variant="secondary"
      className={`
        tw-flex tw-items-center tw-gap-2 tw-justify-center 
        tw-font-normal !tw-px-3 !tw-py-2 !tw-rounded-[6px] 
        ${className}
      `}
    >
      {icon}
      <span className="tw-flex tw-flex-col tw-items-start">{name}</span>
    </Badge>
  );
};

export default DocCard;
