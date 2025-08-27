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
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

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
  
  // Additional validation: ensure the parsed date matches the input string
  // This catches cases like "2023-02-29" which gets auto-corrected to "2023-03-01"
  const reconstructed = date.toISOString().substr(0, 10); // YYYY-MM-DD
  const inputDatePart = str.match(/(\d{4}[-/]\d{1,2}[-/]\d{1,2})/);
  if (inputDatePart) {
    const normalizedInput = inputDatePart[1]
      .replace(/\b(\d)\b/g, '0$1') // Pad single digits
      .replace(/[-/]/g, '-'); // Normalize separators
    if (reconstructed !== normalizedInput) return false;
  }
  
  // Reasonable date range check (1900 to 2100)
  const year = date.getFullYear();
  return year >= 1900 && year <= 2100;
};

export const trimText = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
