const formatUTCDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);

  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  const year = parts.find((part) => part.type === "year")?.value;
  const hour = parts.find((part) => part.type === "hour")?.value;
  const minute = parts.find((part) => part.type === "minute")?.value;

  return `${month} ${day}, ${year} at ${hour}:${minute} UTC`;
};

const formatTimeRemaining = (ms: number | undefined) => {
  if (ms === undefined) {
    return { days: "?", hours: "?", minutes: "?", seconds: "?" };
  }
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400)
    .toString()
    .padStart(2, "0");
  const hours = Math.floor((totalSeconds % 86400) / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return { days, hours, minutes, seconds };
};

const formatDuration = (start: Date, end: Date) => {
  const ms = end.getTime() - start.getTime();
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400).toString();
  const hours = Math.floor((totalSeconds % 86400) / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const formatNumber = (num: number) => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return num.toString();
  }
};

export { formatUTCDate, formatTimeRemaining, formatDuration, formatNumber };
