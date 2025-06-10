import { Menu } from "lucide-react";

interface HeaderProps {
    onMenuClick: () => void;
    headerTitle: string;
    className?: string;
}

function Header({ onMenuClick, headerTitle , className }: HeaderProps) {
    return (
        <div className={`tw-w-full tw-bg-[#0A1A3B] tw-text-white tw-p-4 tw-flex tw-flex-col ${className}`}>
            <div className="tw-flex tw-items-center tw-justify-between">
                <div className="tw-flex tw-items-center tw-gap-4">
                    <button onClick={onMenuClick} className="tw-cursor-pointer">
                        <Menu />
                    </button>
                    <h2 className="tw-text-xl">{headerTitle}</h2>
                </div>
            </div>
        </div>
    )
}

export default Header;