import React from "react";
import { IoIosSend } from "react-icons/io";
import inputStyle from "../../../styles/input.module.scss";
import { useTheme } from "../../../context/ThemeProvider";
import { useDonation } from "../../../context/DonationProvider";
import { useWeb3 } from "../../../context/Web3Provider";

const Donate = ({
  activeSlide,
  slideIndex,
  setSlide,
  setTabIndex,
}: {
  activeSlide: number;
  slideIndex: number;
  setSlide: (index: number, e: React.FocusEvent<Element, Element>) => void;
  setTabIndex: (index: number) => -1 | undefined;
}) => {
  const { web3Connections } = useWeb3();
  const wallet = web3Connections.getConnectedWallet();

  const { linkAddresses } = useDonation();
  const { showApp, isCollapsed, isMobileView } = useTheme();

  const [namAddress, setNamAddress] = React.useState<string>("");

  return (
    <form
      id={inputStyle.input}
      autoComplete={"off"}
      onSubmit={async (e) => {
        e.preventDefault();

        if (
          namAddress &&
          wallet &&
          web3Connections.connections[wallet].address
        ) {
          await linkAddresses(namAddress);

          // if (amount && amount >= 0.03) {
          //   await donate(amount);
          // }
        }
      }}
    >
      <div id={inputStyle.sequences}>
        <label
          htmlFor={inputStyle["sequence-b"]}
          className={inputStyle[`label-sequence-b`]}
        >
          <span>ETH ADDRESS</span>
          <input
            type='text'
            name={inputStyle["sequence-b"]}
            id={inputStyle["sequence-b"]}
            placeholder={"your eth address"}
            onFocus={(e) => setSlide(slideIndex, e)}
            value={
              wallet
                ? web3Connections.connections[wallet].address
                : "connect a wallet"
            }
            tabIndex={setTabIndex(0)}
            required={true}
            disabled={true}
          />
        </label>
        <label
          htmlFor={inputStyle["sequence-a"]}
          className={inputStyle[`label-sequence-a`]}
        >
          <span>NAM ADDRESS</span>
          <input
            type='text'
            name={inputStyle["sequence-a"]}
            id={inputStyle["sequence-a"]}
            placeholder={"insert tnam address here"}
            onChange={(e) => {
              setNamAddress(e.target.value);
            }}
            onFocus={(e) => setSlide(slideIndex, e)}
            defaultValue={namAddress}
            tabIndex={setTabIndex(0)}
            required={true}
          />
        </label>
      </div>
      <div id={inputStyle["input-submit-wrapper"]}>
        <button
          type='submit'
          id={inputStyle["input-submit"]}
          className={`${activeSlide === slideIndex ? inputStyle["show"] : ""}${
            namAddress ? "" : ` ${inputStyle.disabled}`
          }`}
          title='Align'
          disabled={!namAddress}
          tabIndex={!showApp || isCollapsed || isMobileView ? -1 : undefined}
        >
          <span>
            <IoIosSend size='3rem' />
            <span>{"LINK ADDRESSES"}</span>
          </span>
        </button>
      </div>
    </form>
  );
};

export default Donate;
