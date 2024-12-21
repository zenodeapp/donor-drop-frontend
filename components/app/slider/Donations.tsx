import React from "react";

import inputStyle from "../../../styles/input.module.scss";
import { useDonation } from "../../../context/DonationProvider";
import { getClassNameByStyle } from "../../../helpers/layout";
import warningStyle from "../../../styles/warning.module.scss";

const Donations = ({
  onFocus,
  tabIndex,
}: {
  onFocus: React.FocusEventHandler<HTMLButtonElement>;
  tabIndex?: number;
}) => {
  const { donations } = useDonation();
  const [amount, setAmount] = React.useState<number | undefined>(undefined);

  return (
    <form
      id={inputStyle.input}
      // autoComplete={"off"}
      onSubmit={async (e) => {
        e.preventDefault();
      }}
    >
      <div className={getClassNameByStyle(warningStyle, "alert-box error")}>
        <strong>Notice:</strong> You've donated more than 0.3 ETH, which is the
        maximum amount to be considered for the donation drop.
      </div>
      <label htmlFor={"donations"} className={inputStyle["label-donations"]}>
        {donations.length === 0 ? (
          <span className={inputStyle["none-found"]}>
            — No donations found —
          </span>
        ) : (
          // show donations
          // and option to donate again
          <></>
        )}
      </label>
    </form>
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
export default Donations;
