import React from "react";

import inputStyle from "../../../styles/input.module.scss";

const Stats = ({
  onFocus,
  tabIndex,
}: {
  onFocus: React.FocusEventHandler<HTMLButtonElement>;
  tabIndex?: number;
}) => {
  return (
    <label htmlFor={"stats"} className={inputStyle["label-stats"]}>
      <span className={inputStyle["none-found"]}>— No stats found —</span>
    </label>
  );
};

export default Stats;
