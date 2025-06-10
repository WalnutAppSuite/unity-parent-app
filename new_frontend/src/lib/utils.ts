import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
function addPrefix(value: string): string {
  if (typeof value !== 'string') return value;
  if (value.includes('tw-')) return value;
  
  return value.split(' ').map(cls => {
    if (!cls || cls.startsWith('[')) return cls;
    if (cls.includes(':')) {
      const [pseudo, ...rest] = cls.split(':');
      return `${pseudo}:tw-${rest.join(':')}`;
    }
    
    return `tw-${cls}`;
  }).join(' ');
}

export function cn(...inputs: ClassValue[]): string {
  const mergedClasses = clsx(inputs);
  const prefixedClasses = addPrefix(mergedClasses);
  return twMerge(prefixedClasses);
}