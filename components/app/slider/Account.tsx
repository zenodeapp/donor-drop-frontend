import React from "react";
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

const Account = ({
  isActive,
  onFocus,
}: {
  isActive: boolean;
  onFocus: React.FocusEventHandler;
}) => {
  const { web3Connections } = useWeb3();
  const { isConnected, signedIn, smoothShowApp } = useTheme();
  const { userExists, namAddress, userTotal, signIn } = useDonation();
  const [accountPhase, setAccountPhase] = React.useState<AccountPhases>(
    AccountPhases.STATUS_NOT_CONNECTED
  );

  const wallet = web3Connections.getConnectedWallet();
  const ethAddress = wallet
    ? web3Connections.connections[wallet].address
    : undefined;

  // Fix account phase
  React.useEffect(() => {
    if (!isConnected)
      return setAccountPhase(AccountPhases.STATUS_NOT_CONNECTED);
    if (!signedIn) return setAccountPhase(AccountPhases.STATUS_NOT_SIGNED);
    if (!userExists) return setAccountPhase(AccountPhases.STATUS_NEW_USER);
    setAccountPhase(AccountPhases.STATUS_EXISTING_USER);
  }, [isConnected, signedIn, userExists]);

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
        onClick={() => smoothShowApp(false)}
        onFocus={onFocus}
      >
        <IoWalletOutline size='2rem' />
        <p className={styles.connectText}>Connect a wallet to get started.</p>
      </button>
      {accountPhase !== AccountPhases.STATUS_NOT_CONNECTED && (
        <div className={getClassNameByStyle(styles, `wallet active`)}>
          <h2 className={styles.header}>ETH ADDRESS CHECKER</h2>
          <p className={styles.text}>{ethAddress}</p>
          <DonationProgress
            value={userTotal.eligible}
            max={MAX_ETH_PER_ADDRESS}
            min={MIN_ETH_PER_ADDRESS}
            status={""}
            showActual={false}
            decimals={2}
            colorBasedOn={userTotal.total}
          />
          <div className={styles.donationInfo}>
            <span>
              — {`donated `}
              <span style={{ color: "#e2ebff" }}>
                {truncateEth(userTotal.total, 2)} ETH{" "}
                {userTotal.eligible !== 0n ? "💛" : "😌"}
              </span>{" "}
              —
            </span>
            <span style={{ display: "block", fontSize: "0.8rem" }}>
              {userTotal.eligible !== userTotal.total ? (
                <>
                  — eligible{" "}
                  <span style={{ color: "#e2ebff" }}>
                    {ethToFloat(userTotal.eligible)} ETH
                  </span>{" "}
                  —
                </>
              ) : (
                ""
              )}
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
        onFocus={onFocus}
      >
        <FaSignature size='2rem' />
        <p className={styles.connectText}>Sign to reveal your tnam address.</p>
      </button>
      {accountPhase !== AccountPhases.STATUS_NOT_SIGNED && (
        <div className={getClassNameByStyle(styles, `wallet active`)}>
          <h2 className={styles.header}>NAM ADDRESS CHECKER</h2>
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
              {userTotal.eligible < MIN_ETH_PER_ADDRESS
                ? "not eligible for any rewards "
                : `will receive min. `}
              <span style={{ color: "#e2ebff" }}>
                {userTotal.eligible >= MIN_ETH_PER_ADDRESS
                  ? `${(
                      (parseFloat(
                        userTotal.eligible > MAX_ETH_PER_ADDRESS
                          ? MAX_ETH_PER_ADDRESS.toString()
                          : userTotal.eligible.toString()
                      ) /
                        parseFloat(TARGET_ETH.toString())) *
                      REWARD_NAM
                    ).toFixed(2)} NAM `
                  : ""}
                {userTotal.eligible >= MAX_ETH_PER_ADDRESS
                  ? "🤯"
                  : userTotal.eligible < MIN_ETH_PER_ADDRESS
                  ? "😥"
                  : parseFloat(userTotal.eligible.toString()) <
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

  const renderNoteSection = () => {
    return (
      <div
        className={`${styles.container} ${styles.tip} ${styles.note}`}
        style={{
          transition: "opacity 0.3s",
          opacity: accountPhase === AccountPhases.STATUS_NOT_CONNECTED ? 0 : 1,
          pointerEvents:
            accountPhase === AccountPhases.STATUS_NOT_CONNECTED
              ? "none"
              : undefined,
        }}
      >
        <span className={styles.title} style={{ display: "inline-block" }}>
          NOTE:
        </span>{" "}
        Recorded donations will be recognized by the Namada community (so
        don&#39;t bot!) and distributed using a PGF governance proposal. The
        goal is to reward donors within 14 days of the conclusion of the Donor
        Drop.
      </div>
    );
  };

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
      {renderNoteSection()}
    </div>
  );
};

export default Account;
