
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, X } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"

interface DateRangePickerProps {
  className?: string;
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
}

export function DateRangePicker({
  className,
  value,
  onChange,
  placeholder
}: DateRangePickerProps) {
  const handleClear = () => onChange(undefined);

  return (
    <div className={cn("tw-relative", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className="tw-w-full tw-justify-start tw-text-left tw-font-normal tw-bg-black/10 tw-border tw-text-secondary"
          >
            <CalendarIcon className="tw-h-4 tw-w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} - {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="tw-w-[300px] !tw-p-0" align="center">
          <Calendar
            className="tw-w-full"
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>

      {value?.from || value?.to ? (
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
