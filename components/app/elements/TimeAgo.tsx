import React from "react";
import { useTime } from "../../../context/TimeProvider";

const TimeAgo = ({ date }: { date: Date }) => {
  const { currentTimePerMin } = useTime();
  const [value, setValue] = React.useState<string>("");

  React.useEffect(() => {
    const seconds = !currentTimePerMin
      ? undefined
      : (currentTimePerMin - date.getTime()) / 1000;

    console.log(currentTimePerMin);
    console.log(date.toISOString());
    // if (currentTimePerMin) console.log(currentTimePerMin.getTime());
    // console.log(from.getTime());

    if (seconds !== undefined) {
      if (seconds < 60) {
        setValue("just now");
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        setValue(`${minutes} minute${minutes > 1 ? "s" : ""} ago`);
      } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        setValue(`${hours} hour${hours > 1 ? "s" : ""} ago`);
      } else {
        const days = Math.floor(seconds / 86400);
        setValue(`${days} day${days > 1 ? "s" : ""} ago`);
      }
    }
  }, [currentTimePerMin]);

  return <span>{value}</span>;
};

export default TimeAgo;
