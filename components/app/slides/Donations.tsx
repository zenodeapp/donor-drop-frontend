import React from "react";

import inputStyle from "../../../styles/input.module.scss";
import { useDonation } from "../../../context/DonationProvider";

const Matrices = ({
  onFocus,
  tabIndex,
}: {
  onFocus: React.FocusEventHandler<HTMLButtonElement>;
  tabIndex?: number;
}) => {
  const { donations } = useDonation();
  const [amount, setAmount] = React.useState<number | undefined>(undefined);

  return (
    <label htmlFor={"donations"} className={inputStyle["label-donations"]}>
      {donations.length === 0 ? (
        <span className={inputStyle["none-found"]}>— No donations found —</span>
      ) : (
        // show donations
        // and option to donate again
        <></>
      )}
    </label>
  );
};
{
  /* <Limit
        onFocus={(e) => setSlide(0, e)}
        tabIndex={setTabIndex(0)}
        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter")
            document.getElementById(inputStyle["input-submit"])?.click();
          //  e.currentTarget.form?.submit();
        }}
        value={amount}
        setValue={setAmount}
      /> */
}
export default Matrices;
