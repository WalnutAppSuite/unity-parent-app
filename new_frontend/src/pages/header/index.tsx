import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  headerTitle: string;
  className?: string;
  isDarkHeader?: boolean;
}

function Header({ onMenuClick, headerTitle, className, isDarkHeader }: HeaderProps) {
  console.log({ isDarkHeader });

  return (
    <div
      className={
        `tw-w-full tw-p-4 tw-flex tw-flex-col ${className} ` +
        (isDarkHeader
          ? 'tw-bg-primary tw-text-secondary'
          : 'tw-bg-background-asscent tw-text-primary')
      }
    >
      <div className="tw-flex tw-items-center tw-justify-between">
        <div className="tw-flex tw-items-center tw-gap-4">
          <button onClick={onMenuClick} className="tw-cursor-pointer">
            <Menu />
          </button>
          <h2 className="tw-text-xl">{headerTitle}</h2>
        </div>
      </div>
    </div>
  );
}

export default Header;
