export interface FormatDate {
    (dateString: string): string;
}

export const formatDate: FormatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
        return new Date().toLocaleDateString('en-GB');
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

export interface FormatDateFromISO {
    (date?: Date): string;
}

export const formatDateFromISO: FormatDateFromISO = function (date?: Date): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
};

export interface GetDatesBetween {
    (start?: Date, end?: Date): string[];
}

export const getDatesBetween: GetDatesBetween = function (start?: Date, end?: Date): string[] {
    if (!start || !end) return [];
    const dates: string[] = [];
    let current = new Date(start);
    while (current <= end) {
        dates.push(formatDateFromISO(current));
        current.setDate(current.getDate() + 1);
    }
    return dates;
};

export function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}