import React from "react";

import inputStyle from "../../../styles/input.module.scss";
import textStyle from "../../../styles/text.module.scss";

const Limit = ({
  onFocus,
  tabIndex,
  onKeyUp,
  value,
  setValue,
}: {
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  tabIndex?: number;
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement>;
  value?: number;
  setValue: React.Dispatch<React.SetStateAction<number | undefined>>;
}) => {
  return (
    <>
      <label
        htmlFor={inputStyle["limit"]}
        className={inputStyle["label-limit"]}
      >
        <div className={textStyle["text-label"]}>
          AMOUNT (ETH; min: 0.03, max: 0.3)
        </div>
        <input
          type='number'
          name={inputStyle["limit"]}
          id={inputStyle["limit"]}
          className={textStyle["text-mono"]}
          min='0.03'
          step='0.01'
          max='0.3'
          defaultValue={value}
          onChange={(e) => {
            const limit = parseInt(e.target.value) || 0;
            setValue(limit);
          }}
          tabIndex={tabIndex}
          onKeyUp={onKeyUp}
          onFocus={onFocus}
        />
      </label>
      <span>(leave this empty if you already donated)</span>
    </>
  );
};

export default Limit;
