import React, { useState, useEffect } from "react";
import { BigNumber, ethers } from "ethers";
import { useTheme } from "../../../context/ThemeProvider";
import { useDonation } from "../../../context/DonationProvider";
import { getClassNameByStyle } from "../../../helpers/layout";
import styles from "../../../styles/account.module.scss";
import { IoWalletOutline } from "react-icons/io5";
import Image from "next/image";
import { useWeb3 } from "../../../context/Web3Provider";
import { FaSignature, FaEthereum } from "react-icons/fa";
import {
  MAX_ETH_PER_ADDRESS,
  MIN_ETH_PER_ADDRESS,
  REWARD_NAM,
  TARGET_ETH,
} from "../../../donations.config";
import DonationProgress from "../donations/DonationProgress";
import { ethToFloat, truncateEth } from "../../../helpers/web3";

export enum AccountPhases {
  STATUS_NOT_CONNECTED = 0,
  STATUS_NOT_SIGNED = 1,
  STATUS_SERVER_UNREACHABLE = 2,
  STATUS_NEW_USER = 3,
  STATUS_EXISTING_USER = 4,
}

const Account = ({ isActive }: { isActive: boolean }) => {
  const { web3Connections } = useWeb3();
  const { isConnected, signedIn, setShowApp } = useTheme();
  const { userExists, namAddress, ethDonated, setEthDonated, signIn } =
    useDonation();
  const [accountPhase, setAccountPhase] = useState<AccountPhases>(
    AccountPhases.STATUS_NOT_CONNECTED
  );

  const wallet = web3Connections.getConnectedWallet();
  const ethAddress = wallet
    ? web3Connections.connections[wallet].address
    : undefined;

  useEffect(() => {
    if (!isConnected)
      return setAccountPhase(AccountPhases.STATUS_NOT_CONNECTED);
    if (!signedIn) return setAccountPhase(AccountPhases.STATUS_NOT_SIGNED);
    if (!userExists) return setAccountPhase(AccountPhases.STATUS_NEW_USER);
    setAccountPhase(AccountPhases.STATUS_EXISTING_USER);
  }, [isConnected, signedIn, userExists]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setEthDonated({
  //       originalTotalEth: ethDonated.originalTotalEth.add(
  //         BigNumber.from("10000000000000000")
  //       ), // Increase by 0.01 ETH (10^16 wei)
  //       adjustedTotalEth: ethDonated.adjustedTotalEth.add(
  //         BigNumber.from("10000000000000000")
  //       ), // Increase by 0.01 ETH (10^16 wei)
  //     });
  //   }, 5000); // Update every 5 seconds
  //   console.log("hallo");
  //   console.log(ethDonated.originalTotalEth);

  //   return () => clearInterval(interval); // Cleanup on component unmount
  // }, [ethDonated, setEthDonated]); // Dependency array to rerun effect if `ethDonated` changes

  const renderEthereumSection = () => (
    <div className={getClassNameByStyle(styles, `section eth`)}>
      <span className={getClassNameByStyle(styles, `wallet-icon`)}>
        <FaEthereum />
      </span>
      <button
        className={getClassNameByStyle(
          styles,
          `connect${
            accountPhase === AccountPhases.STATUS_NOT_CONNECTED ? " active" : ""
          }`
        )}
        onClick={() => setShowApp(false)}
      >
        <IoWalletOutline size='2rem' />
        <p className={styles.connectText}>Connect a wallet to get started.</p>
      </button>
      {accountPhase !== AccountPhases.STATUS_NOT_CONNECTED && (
        <div className={getClassNameByStyle(styles, `wallet active`)}>
          <h2 className={styles.header}>ETH ADDRESS</h2>
          <p className={styles.text}>{ethAddress}</p>
          <DonationProgress
            totalDonated={ethDonated.adjustedTotalEth}
            max={MAX_ETH_PER_ADDRESS}
            min={MIN_ETH_PER_ADDRESS}
            status={""}
            showActual={false}
            decimals={2}
          />
          <div className={styles.donationInfo}>
            <span>
              — {`donated `}
              <span style={{ color: "#e2ebff" }}>
                {truncateEth(ethDonated.adjustedTotalEth, 2)} ETH{" "}
                {!ethDonated.adjustedTotalEth.eq(ethDonated.originalTotalEth)
                  ? ` (${ethToFloat(
                      ethDonated.originalTotalEth.sub(
                        ethDonated.adjustedTotalEth
                      )
                    )})`
                  : ""}
                {!ethDonated.adjustedTotalEth.isZero() ? "💛" : "😌"}
              </span>{" "}
              —
            </span>
          </div>
        </div>
      )}
    </div>
  );
  const renderNamSection = () => (
    <div className={getClassNameByStyle(styles, `section right`)}>
      <span className={getClassNameByStyle(styles, `wallet-icon`)}>
        <Image
          src='/icon_x192.png'
          alt='Namada'
          width={400}
          height={400}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
      </span>
      <button
        className={getClassNameByStyle(
          styles,
          `connect${
            accountPhase === AccountPhases.STATUS_NOT_SIGNED ? " active" : ""
          }`
        )}
        onClick={signIn}
      >
        <FaSignature size='2rem' />
        <p className={styles.connectText}>Sign to reveal your tnam address.</p>
      </button>
      {accountPhase !== AccountPhases.STATUS_NOT_SIGNED && (
        <div className={getClassNameByStyle(styles, `wallet active`)}>
          <h2 className={styles.header}>NAM ADDRESS</h2>
          <p
            className={getClassNameByStyle(styles, `text`)}
            style={{
              color:
                accountPhase === AccountPhases.STATUS_NEW_USER
                  ? "rgb(107, 114, 129)"
                  : undefined,
            }}
          >
            {accountPhase === AccountPhases.STATUS_NEW_USER
              ? "— no nam address was found —"
              : namAddress}
          </p>
          <div className={styles.donationInfo}>
            <span>
              —{" "}
              {ethDonated.adjustedTotalEth.lt(MIN_ETH_PER_ADDRESS)
                ? "not eligible for any rewards "
                : `will receive min. `}
              <span style={{ color: "#e2ebff" }}>
                {!ethDonated.adjustedTotalEth.lt(MIN_ETH_PER_ADDRESS)
                  ? `${(
                      (parseFloat(
                        ethDonated.adjustedTotalEth.gt(MAX_ETH_PER_ADDRESS)
                          ? MAX_ETH_PER_ADDRESS.toString()
                          : ethDonated.adjustedTotalEth.toString()
                      ) /
                        parseFloat(TARGET_ETH.toString())) *
                      REWARD_NAM
                    ).toFixed(2)} NAM `
                  : ""}
                {ethDonated.adjustedTotalEth.gte(MAX_ETH_PER_ADDRESS)
                  ? "🤯"
                  : ethDonated.adjustedTotalEth.lt(MIN_ETH_PER_ADDRESS)
                  ? "😥"
                  : parseFloat(ethDonated.adjustedTotalEth.toString()) <
                    parseFloat(MAX_ETH_PER_ADDRESS.toString()) / 2
                  ? "😇"
                  : "🥰"}
              </span>{" "}
              —
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={getClassNameByStyle(
        styles,
        `wrapper${isActive ? " visible" : ""}`
      )}
    >
      <div className={getClassNameByStyle(styles, `container`)}>
        {renderEthereumSection()}
      </div>
      <div
        style={{
          display: "block",
          position: "relative",
          zIndex: 5,
          transition: "opacity 0.3s",
          opacity: accountPhase === AccountPhases.STATUS_NOT_CONNECTED ? 0 : 1,
          pointerEvents:
            accountPhase === AccountPhases.STATUS_NOT_CONNECTED
              ? "none"
              : undefined,
        }}
      ></div>
      <div
        className={getClassNameByStyle(
          styles,
          `container${
            accountPhase === AccountPhases.STATUS_NOT_CONNECTED
              ? " invisible"
              : ""
          }`
        )}
      >
        {renderNamSection()}
      </div>
    </div>
  );
};

export default Account;
