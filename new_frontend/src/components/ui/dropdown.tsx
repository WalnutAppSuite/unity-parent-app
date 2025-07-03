import { useState, useRef, useEffect } from 'react';

export interface DropdownOption {
    value: string | number;
    label: string;
}

export interface DropdownProps {
    options: DropdownOption[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;
    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div
            ref={ref}
            className={`tw-relative tw-w-full ${disabled ? 'tw-opacity-50 tw-pointer-events-none' : ''}`}
        >
            <button
                type="button"
                className="tw-w-full tw-bg-white tw-border tw-rounded-md tw-px-4 tw-py-2 tw-text-left tw-shadow-sm tw-text-sm tw-cursor-pointer tw-flex tw-justify-between tw-items-center"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <span>{selectedLabel}</span>
                <svg
                    className={`tw-w-4 tw-h-4 tw-transition-transform ${isOpen ? 'tw-rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <ul className="tw-absolute tw-z-50 tw-mt-1 tw-w-full tw-bg-white tw-border tw-rounded-md tw-shadow-lg tw-max-h-60 tw-overflow-auto tw-text-sm">
                    {options.map((opt) => (
                        <li
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={`tw-px-4 tw-py-2 hover:tw-bg-gray-100 tw-cursor-pointer ${opt.value === value ? 'tw-bg-gray-100 tw-font-semibold' : ''
                                }`}
                        >
                            {opt.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
