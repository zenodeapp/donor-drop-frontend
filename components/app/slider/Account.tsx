import React from "react";
import { IoIosSend, IoMdLink } from "react-icons/io";
import inputStyle from "../../../styles/input.module.scss";
import { useTheme } from "../../../context/ThemeProvider";
import { useDonation } from "../../../context/DonationProvider";
import { useWeb3 } from "../../../context/Web3Provider";

import warningStyle from "../../../styles/warning.module.scss";
import { getClassNameByStyle } from "../../../helpers/layout";
import { IoPencil } from "react-icons/io5";
import { useNotification } from "../../../context/NotificationProvider";

const Account = ({
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

  const {
    requestSignature,
    verifySignature,
    namAddress,
    setNamAddress,
    lockAddress,
    setLockAddress,
    userExists,
    setUserExists,
  } = useDonation();
  const { showApp, isMobileView } = useTheme();
  const { notify } = useNotification();

  // React.useEffect(() => {
  //   const _fetchNamAddress = async () => {
  //     const _address = await signIn();

  //     if (_address) {
  //       setNamAddress(_address);
  //     } else {
  //       setLockAddress(false);
  //     }
  //   };

  //   _fetchNamAddress();
  // }, []);

  return (
    <form
      id={inputStyle.input}
      autoComplete={"off"}
      onSubmit={async (e) => {
        e.preventDefault();
        const ethAddress = wallet
          ? web3Connections.connections[wallet].address
          : undefined;

        if (namAddress && ethAddress) {
          const request = await requestSignature();

          if (request) {
            const result = await verifySignature(
              request.signature,
              request.message,
              ethAddress,
              namAddress
            );

            console.log(result);
            if (result) {
              setLockAddress(true);
              setUserExists(true);
            }
          }
        }
      }}
    >
      {/* <div className={getClassNameByStyle(warningStyle, "alert-box warning")}>
        <strong>Warning:</strong> You haven't donated yet. Therefore, you cannot
        link any NAM wallet to an Ethereum address. Please donate first.
      </div> */}
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
            disabled={lockAddress}
            pattern='^tnam1[A-Za-z0-9]{40}$'
          />
          {userExists && (
            <button
              type='button'
              className={inputStyle["lock-button"]}
              onClick={() => setLockAddress(!lockAddress)}
            >
              <IoPencil />
            </button>
          )}
        </label>
      </div>
      <div id={inputStyle["input-submit-wrapper"]}>
        <button
          type='submit'
          id={inputStyle["input-submit"]}
          className={`${activeSlide === slideIndex ? inputStyle["show"] : ""}${
            namAddress && !lockAddress ? "" : ` ${inputStyle.disabled}`
          }`}
          title='Align'
          disabled={!namAddress || lockAddress}
          tabIndex={!showApp || isMobileView ? -1 : undefined}
        >
          <span>
            <IoMdLink size='3rem' />
            <span>{"LINK ADDRESSES"}</span>
          </span>
        </button>
      </div>
    </form>
  );
};

export default Account;
