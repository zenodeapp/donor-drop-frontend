import React from "react";
import { useTheme } from "../../../context/ThemeProvider";
import { useDonation } from "../../../context/DonationProvider";
import { getClassNameByStyle } from "../../../helpers/layout";
import styles from "../../../styles/account.module.scss";
import { IoWalletOutline } from "react-icons/io5";
import Image from "next/image";
import { useWeb3 } from "../../../context/Web3Provider";
import { FaSignature, FaEthereum, FaClock } from "react-icons/fa";
import {
  MAX_ETH_PER_ADDRESS,
  MIN_ETH_PER_ADDRESS,
  REWARD_NAM,
  TARGET_ETH,
} from "../../../donations.config";
import DonationProgress from "../donations/DonationProgress";
import { truncateEth } from "../../../helpers/web3";
import TooltipQuestion from "../elements/TooltipQuestion";
import { GiCheckMark } from "react-icons/gi";
import { SkeletonText } from "../elements/Skeleton";

// TODO: this component is a mess and needs refactoring

export enum AccountPhases {
  STATUS_NOT_CONNECTED = 0,
  STATUS_NOT_SIGNED = 1,
  STATUS_SERVER_UNREACHABLE = 2,
  STATUS_NEW_USER = 3,
  STATUS_EXISTING_USER = 4,
}

export enum TotalsPhases {
  STATUS_IDLE = 0,
  STATUS_IS_BELOW_THRESHOLD = 1,
  STATUS_IS_PROCESSING = 2,
  STATUS_IS_PROCESSED = 3,
}

const Account = ({
  isActive,
  onFocus,
  tabIndex,
}: {
  isActive: boolean;
  onFocus: React.FocusEventHandler;
  tabIndex?: number;
}) => {
  const { web3Connections } = useWeb3();
  const { isConnected, signedIn, smoothShowApp } = useTheme();
  const { userExists, namAddress, userTotal, userTotalFinalized, signIn } =
    useDonation();
  const [accountPhase, setAccountPhase] = React.useState<AccountPhases>(
    AccountPhases.STATUS_NOT_CONNECTED
  );
  const [totalsPhase, setTotalsPhase] = React.useState<TotalsPhases>(
    TotalsPhases.STATUS_IDLE
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

  React.useEffect(() => {
    if (userTotal.total === 0n && userTotal.eligible === 0n) {
      setTotalsPhase(TotalsPhases.STATUS_IDLE);
    } else if (
      userTotal.total < MIN_ETH_PER_ADDRESS &&
      userTotal.eligible === 0n
    ) {
      setTotalsPhase(TotalsPhases.STATUS_IS_BELOW_THRESHOLD);
    } else if (
      userTotal.eligible === userTotalFinalized.eligible ||
      userTotalFinalized.eligible >= MAX_ETH_PER_ADDRESS
    ) {
      setTotalsPhase(TotalsPhases.STATUS_IS_PROCESSED);
    } else {
      setTotalsPhase(TotalsPhases.STATUS_IS_PROCESSING);
    }
  }, [userTotal, userTotalFinalized]);

  // if we're in a phase that's higher than this TotalsPhase then the user should have rewards.
  const hasRewards = totalsPhase > TotalsPhases.STATUS_IS_BELOW_THRESHOLD;

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
        tabIndex={tabIndex}
      >
        <IoWalletOutline size='2rem' />
        <p className={styles.connectText}>Connect a wallet to get started.</p>
      </button>
      {accountPhase !== AccountPhases.STATUS_NOT_CONNECTED && (
        <div className={getClassNameByStyle(styles, `wallet active`)}>
          <h2 className={styles.header}>ETH ADDRESS CHECKER</h2>
          <p className={styles.text}>{ethAddress}</p>
          <DonationProgress
            value={
              userTotal.total < MIN_ETH_PER_ADDRESS
                ? userTotal.total
                : totalsPhase === TotalsPhases.STATUS_IS_PROCESSED
                ? userTotal.eligible
                : userTotal.total
            }
            finalized={
              userTotalFinalized.total < MIN_ETH_PER_ADDRESS
                ? userTotalFinalized.total
                : totalsPhase === TotalsPhases.STATUS_IS_PROCESSED
                ? userTotalFinalized.eligible
                : userTotalFinalized.total
            }
            max={MAX_ETH_PER_ADDRESS}
            min={MIN_ETH_PER_ADDRESS}
            status={""}
            showActual={false}
            decimals={2}
            colorBasedOn={userTotal.total}
            style={{ width: "100%", maxWidth: "100%" }}
          />
          <div className={styles.donationInfo}>
            <span style={{ display: "block", fontSize: "0.9rem" }}>
              — {`donated `}
              <span style={{ color: "#e2ebff" }}>
                {truncateEth(userTotal.total, 2)} ETH {hasRewards ? "💛" : "😌"}
              </span>{" "}
              {hasRewards && <>eligible </>}
              {totalsPhase !== TotalsPhases.STATUS_IDLE && (
                <>
                  <SkeletonText
                    text={
                      totalsPhase === TotalsPhases.STATUS_IS_BELOW_THRESHOLD ? (
                        <>below threshold</>
                      ) : (
                        <>{truncateEth(userTotalFinalized.eligible, 2)} ETH</>
                      )
                    }
                    status={
                      totalsPhase === TotalsPhases.STATUS_IS_PROCESSED
                        ? "done"
                        : totalsPhase === TotalsPhases.STATUS_IS_BELOW_THRESHOLD
                        ? "stale"
                        : totalsPhase === TotalsPhases.STATUS_IS_PROCESSING
                        ? "process"
                        : undefined
                    }
                  />
                  {totalsPhase === TotalsPhases.STATUS_IS_BELOW_THRESHOLD
                    ? " 😥"
                    : ""}
                </>
              )}{" "}
              —
            </span>
          </div>
          <div
            className={`${styles.finalized} ${
              !hasRewards ? styles.noRewards : ""
            }`}
          >
            <span
              className={`${styles.text} ${
                totalsPhase === TotalsPhases.STATUS_IS_PROCESSED
                  ? styles.final
                  : totalsPhase === TotalsPhases.STATUS_IS_PROCESSING
                  ? styles.pending
                  : ""
              }`}
            >
              {totalsPhase === TotalsPhases.STATUS_IS_PROCESSED ? (
                <>
                  <GiCheckMark size={"0.7rem"} />
                  PROCESSED
                </>
              ) : totalsPhase === TotalsPhases.STATUS_IS_PROCESSING ? (
                <>
                  <FaClock size={"0.7rem"} />
                  PROCESSING
                </>
              ) : undefined}
            </span>
            <TooltipQuestion
              message={
                totalsPhase === TotalsPhases.STATUS_IS_PROCESSED ? (
                  <>
                    All blocks containing transactions of yours are finalized
                    on-chain and can be considered valid.
                  </>
                ) : totalsPhase === TotalsPhases.STATUS_IS_PROCESSING ? (
                  <>
                    Blocks have to be finalized on-chain before they can be
                    considered valid (
                    <a
                      href='https://docs.tatum.io/docs/evm-block-finality-and-confidence'
                      target='_blank'
                    >
                      learn more
                    </a>
                    ). Please wait ~15 minutes to see your final eligible
                    amount.
                  </>
                ) : undefined
              }
            />
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
        tabIndex={tabIndex}
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
            <span style={{ fontSize: "0.9rem" }}>
              — {hasRewards && "receives "}
              <SkeletonText
                text={
                  totalsPhase === TotalsPhases.STATUS_IDLE ||
                  totalsPhase === TotalsPhases.STATUS_IS_BELOW_THRESHOLD ? (
                    "not eligible for any rewards "
                  ) : hasRewards ? (
                    <>
                      {`${(
                        (parseFloat(userTotalFinalized.eligible.toString()) /
                          parseFloat(TARGET_ETH.toString())) *
                        REWARD_NAM
                      ).toFixed(2)} NAM `}
                    </>
                  ) : (
                    "waiting for block finality"
                  )
                }
                status={
                  totalsPhase === TotalsPhases.STATUS_IDLE ||
                  totalsPhase === TotalsPhases.STATUS_IS_PROCESSED
                    ? "done"
                    : totalsPhase === TotalsPhases.STATUS_IS_BELOW_THRESHOLD
                    ? "stale"
                    : totalsPhase === TotalsPhases.STATUS_IS_PROCESSING
                    ? "process"
                    : undefined
                }
              />{" "}
              <span style={{ color: "#e2ebff" }}>
                {userTotalFinalized.eligible >= MAX_ETH_PER_ADDRESS
                  ? "🤯"
                  : totalsPhase === TotalsPhases.STATUS_IDLE
                  ? ""
                  : totalsPhase === TotalsPhases.STATUS_IS_BELOW_THRESHOLD
                  ? "😥"
                  : totalsPhase === TotalsPhases.STATUS_IS_PROCESSING
                  ? "🕔"
                  : parseFloat(userTotalFinalized.eligible.toString()) <
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
