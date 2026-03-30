export function timeAgoPH(date: string | Date): string {
  const now = new Date();
  const past = date instanceof Date ? date : new Date(date + "Z"); 

  const diffMs = now.getTime() - past.getTime();
  if (diffMs < 0) return "In the future";

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const yearDiff = now.getUTCFullYear() - past.getUTCFullYear();
  const monthDiff = now.getUTCMonth() - past.getUTCMonth() + yearDiff * 12;

  if (yearDiff > 0) return `${yearDiff} year${yearDiff > 1 ? "s" : ""} ago`;
  if (monthDiff > 0) return `${monthDiff} month${monthDiff > 1 ? "s" : ""} ago`;
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  return "Just now";
}