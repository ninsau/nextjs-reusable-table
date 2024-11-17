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
  return date.toLocaleDateString(undefined, options);
};

export const isDateString = (str: string): boolean => {
  if (str.length < 10) return false;
  const parsedDate = Date.parse(str);
  return !isNaN(parsedDate) && !isNaN(new Date(parsedDate).getTime());
};

export const trimText = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
