/**
 * Formats a Date object into a readable string
 * @param date - The date to format
 * @param includeTime - Whether to include time in the formatted string
 * @returns Formatted date string or "Invalid Date" if parsing fails
 */
export const formatDate = (date: Date, includeTime = false): string => {
  const options: Intl.DateTimeFormatOptions = includeTime
    ? {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    : { year: "numeric", month: "short", day: "numeric" };
  try {
    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch {
    return "Invalid Date";
  }
};

/**
 * Determines if a string represents a valid date
 * @param str - The string to test
 * @returns True if the string represents a valid date, false otherwise
 */
export const isDateString = (str: string): boolean => {
  if (typeof str !== "string" || str.length < 8) return false;
  
  // Don't treat pure numbers as dates (even if they could be timestamps)
  if (/^\d+$/.test(str.trim())) return false;
  
  // Check for common date patterns first
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?([+-]\d{2}:\d{2}|Z)?)?$/,     // ISO format with timezone
    /^\d{4}-\d{1,2}-\d{1,2}$/,                                    // YYYY-M-D or YYYY-MM-DD
    /^\d{1,2}\/\d{1,2}\/\d{4}$/,                                  // M/D/YYYY or MM/DD/YYYY
    /^\d{1,2}-\d{1,2}-\d{4}$/,                                    // M-D-YYYY or MM-DD-YYYY
    /^(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4}$/i, // Month DD, YYYY
  ];
  
  const hasDatePattern = datePatterns.some(pattern => pattern.test(str.trim()));
  if (!hasDatePattern) return false;
  
  // If it matches a pattern, verify it's actually a valid date
  const parsedDate = Date.parse(str);
  if (Number.isNaN(parsedDate)) return false;
  
  const date = new Date(parsedDate);
  if (Number.isNaN(date.getTime())) return false;
  
  // Additional validation: ensure the parsed date matches the input components (Y, M, D)
  // This catches cases like "2023-02-29" auto-correcting to "2023-03-01"
  const ymd = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const isoWithTime = str.match(/^(\d{4})-(\d{2})-(\d{2})T/);
  const mdy = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (ymd || mdy || isoWithTime) {
    let inputYear: number;
    let inputMonth: number; // 1-12
    let inputDay: number;
    let parsedYear: number;
    let parsedMonth: number;
    let parsedDay: number;
    if (isoWithTime) {
      // ISO with time is UTC-based comparison
      inputYear = Number(isoWithTime[1]);
      inputMonth = Number(isoWithTime[2]);
      inputDay = Number(isoWithTime[3]);
      parsedYear = date.getUTCFullYear();
      parsedMonth = date.getUTCMonth() + 1;
      parsedDay = date.getUTCDate();
    } else if (ymd) {
      // YYYY-M-D compare with UTC parts as many parsers normalize to UTC for ISO-like dates
      inputYear = Number(ymd[1]);
      inputMonth = Number(ymd[2]);
      inputDay = Number(ymd[3]);
      parsedYear = date.getUTCFullYear();
      parsedMonth = date.getUTCMonth() + 1;
      parsedDay = date.getUTCDate();
    } else {
      // M/D/YYYY compare with local parts
      inputMonth = Number(mdy?.[1]);
      inputDay = Number(mdy?.[2]);
      inputYear = Number(mdy?.[3]);
      parsedYear = date.getFullYear();
      parsedMonth = date.getMonth() + 1;
      parsedDay = date.getDate();
    }
    if (parsedYear !== inputYear || parsedMonth !== inputMonth || parsedDay !== inputDay) {
      return false;
    }
  }
  
  // Reasonable date range check (1900 to 2100)
  const year = ymd || isoWithTime ? date.getUTCFullYear() : date.getFullYear();
  return year >= 1900 && year <= 2100;
};

/**
 * Truncates text to a specified maximum length and adds ellipsis
 * @param text - The text to truncate
 * @param maxLength - The maximum length of the returned string
 * @returns Truncated text with ellipsis if needed
 */
export const trimText = (text: string, maxLength: number): string => {
  if (maxLength <= 0) return "...";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
