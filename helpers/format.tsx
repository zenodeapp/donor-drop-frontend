const formatUTCDate = (date: Date) =>
  date
    .toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
      timeZoneName: "short",
    })
    .toUpperCase();

export { formatUTCDate };
