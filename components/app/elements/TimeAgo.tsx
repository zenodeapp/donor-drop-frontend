import React from "react";
import { useTime } from "../../../context/TimeProvider";

function TimeAgo({ date }: { date: Date }) {
  const { currentTimePerMin } = useTime();

  const timeAgo = (from: Date): string => {
    const seconds = Math.floor(
      (currentTimePerMin.getTime() - from.getTime()) / 1000
    );

    if (seconds < 60) {
      return "just now";
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(seconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  return <span>{timeAgo(date)}</span>;
}

export default TimeAgo;
