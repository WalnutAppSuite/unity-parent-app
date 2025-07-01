import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface SingleDatePickerProps {
    className?: string;
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    placeHolder?: string;
    minDate?: Date;
}

export function SingleDatePicker({
    className,
    value,
    onChange,
    placeHolder,
    minDate
}: SingleDatePickerProps) {
    const [open, setOpen] = useState(false);
    const handleClear = () => onChange(undefined);

    // Close popover when a date is selected
    useEffect(() => {
        if (value) {
            setOpen(false);
        }
    }, [value]);

    const handleSelect = (date: Date | undefined) => {
        onChange(date);
    };

    return (
        <div className={cn("tw-relative", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className="tw-w-full !tw-justify-start tw-text-left tw-font-normal tw-bg-black/10 tw-border tw-text-secondary"
                    >
                        <CalendarIcon className="tw-h-4 tw-w-4" />
                        {value ? (
                            format(value, "LLL dd, y")
                        ) : (
                            <span>{placeHolder}</span>
                        )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="tw-w-[300px] !tw-p-0" align="center">
                    <Calendar
                        className="tw-w-full"
                        initialFocus
                        mode="single"
                        defaultMonth={value}
                        selected={value}
                        onSelect={handleSelect}
                        numberOfMonths={1}
                        disabled={minDate ? (date => date < minDate) : undefined}
                    />
                </PopoverContent>
            </Popover>

            {value ? (
                <button
                    type="button"
                    onClick={handleClear}
                    className="tw-absolute tw-top-1/2 tw-right-3 -tw-translate-y-1/2 tw-p-1 hover:tw-bg-muted tw-rounded-md"
                >
                    <X className="tw-h-4 tw-w-4 tw-text-secondary" />
                </button>
            ) : null}
        </div>
    )
}