export function TimeAgo(date) {
  if (!date) return ""; // or "just now"

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return ""; // invalid date → no crash

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const seconds = (parsed - new Date()) / 1000;

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  for (let key in intervals) {
    if (Math.abs(seconds) >= intervals[key] || key === "second") {
      return formatter.format(Math.round(seconds / intervals[key]), key);
    }
  }
}
