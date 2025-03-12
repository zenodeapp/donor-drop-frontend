import React, { useEffect, useState } from "react";
import styles from "../../../styles/donate.module.scss";
import Image from "next/image";
import { getClassNameByStyle } from "../../../helpers/layout";
import {
  FaClipboard,
  FaCommentAlt,
  FaCopy,
  FaEthereum,
  FaExclamation,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { formatUTCDate } from "../../../helpers/format";
import {
  CURRENT_CAMPAIGN,
  DONOR_NETWORK,
  EXPLORER_LINK,
  MAX_ETH_PER_ADDRESS,
  MIN_ETH_PER_ADDRESS,
  REWARD_NAM,
  TARGET_ETH,
} from "../../../drop.variables";
import { IoIosClock } from "react-icons/io";
import { ethToFloat, ethToString } from "../../../helpers/web3";
import { GiPartyPopper } from "react-icons/gi";
import { useLayout } from "../../../context/LayoutProvider";
import { IoRocket, IoWalletSharp, IoWarning } from "react-icons/io5";
import DonationProgress from "../donations/DonationProgress";
import { ethers } from "ethers";
import { FaShield } from "react-icons/fa6";
import DonationMessage from "../donations/DonationMessage";
import AsciiToHex from "../elements/AsciiToHex";
import { copyToClipboard } from "../../../helpers/interaction";
import { useNotification } from "../../../context/NotificationProvider";

// TODO: this component is a mess and needs refactoring

type IStepBubble = {
  bubble: React.ReactNode;
  stepNumber?: number | string;
  image?: { src: string; alt: string; width: number; height: number };
  subscript?: React.ReactNode;
  imageContainer?: React.ReactNode;
  relative?: boolean;
  hidden?: boolean;
  backTitle?: string;
  nextTitle?: string;
  navEnabled?: boolean;
  nextOnClick?: React.MouseEventHandler<HTMLButtonElement>;
  backOnClick?: React.MouseEventHandler<HTMLButtonElement>;
  ghost?: boolean;
  maxHeight?: string;
  nextDisabled?: boolean;
};

const NavigationButtons = ({
  max,
  currentStep,
  setCurrentStep,
  backTitle,
  nextTitle,
  nextOnClick,
  backOnClick,
  onFocus,
  tabIndex,
  nextDisabled,
}: {
  max: number;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  backTitle?: string;
  nextTitle?: string;
  nextOnClick?: React.MouseEventHandler<HTMLButtonElement>;
  backOnClick?: React.MouseEventHandler<HTMLButtonElement>;
  onFocus: React.FocusEventHandler<HTMLButtonElement>;
  tabIndex?: number;
  nextDisabled?: boolean;
}) => {
  return (
    <div className={styles.navigationButtons}>
      {currentStep !== 0 && currentStep !== max && (
        <button
          className={getClassNameByStyle(styles, "navButton backButton")}
          onClick={
            backOnClick
              ? backOnClick
              : () => {
                  if (currentStep > 0) setCurrentStep(currentStep - 1);
                }
          }
          onFocus={onFocus}
          tabIndex={tabIndex}
        >
          <span className={styles.back}>{backTitle ? backTitle : "BACK"}</span>
          <span className={styles.line}></span>
        </button>
      )}
      <button
        className={getClassNameByStyle(
          styles,
          `navButton nextButton ${nextDisabled ? "disabled" : ""}`
        )}
        onClick={
          nextOnClick
            ? nextOnClick
            : () => {
                if (currentStep < max) setCurrentStep(currentStep + 1);
              }
        }
        onFocus={onFocus}
        tabIndex={tabIndex}
        disabled={nextDisabled}
      >
        <span className={styles.next}>{nextTitle ? nextTitle : "NEXT"}</span>
        <span className={styles.line}></span>
      </button>
    </div>
  );
};

const StepBubble = ({
  bubble,
  stepNumber,
  image,
  subscript,
  imageContainer,
  relative,
  hidden,
  backTitle,
  nextTitle,
  currentStep,
  setCurrentStep,
  max,
  nextOnClick,
  backOnClick,
  navEnabled = true,
  ghost,
  onFocus,
  tabIndex,
  maxHeight,
  nextDisabled,
}: IStepBubble & {
  max: number;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  onFocus: React.FocusEventHandler<HTMLButtonElement>;
  tabIndex?: number;
  nextDisabled?: boolean;
}) => {
  return (
    <div
      className={`${styles.innerContainer} ${hidden ? styles.hidden : ""} ${
        ghost ? styles.ghost : ""
      }`}
      style={{
        position: relative ? "relative" : undefined,
      }}
    >
      <div
        className={`${getClassNameByStyle(
          styles,
          `section${!stepNumber ? " zero" : ""}`
        )}`}
      >
        <div className={styles.leftContainer}>
          {imageContainer}
          {image && (
            <div className={styles.image}>
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                draggable={false}
                onContextMenu={(e) => {
                  e.preventDefault();
                  return false;
                }}
              />
            </div>
          )}
        </div>
        <div
          className={styles.rightContainer}
          style={{ maxHeight: maxHeight || undefined }}
        >
          {stepNumber && (
            <h3 className={styles.header}>
              {typeof stepNumber === "string"
                ? stepNumber
                : `STEP ${stepNumber}`}
            </h3>
          )}
          <div className={styles.bubble}>{bubble}</div>
          {subscript && <p className={styles.subscript}>{subscript}</p>}
          {navEnabled && (
            <NavigationButtons
              max={max}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              backTitle={backTitle}
              nextTitle={nextTitle}
              nextOnClick={nextOnClick}
              backOnClick={backOnClick}
              onFocus={onFocus}
              tabIndex={tabIndex}
              nextDisabled={nextDisabled}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const Donate = ({
  isActive,
  onFocus,
  tabIndex,
}: {
  isActive: boolean;
  onFocus: React.FocusEventHandler;
  tabIndex?: number;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { smoothNavigate } = useLayout();
  const [ethInput, setEthInput] = useState(0.03);
  const [sending, setSending] = useState(0);
  const { notify } = useNotification();
  const [allowNext, setAllowNext] = React.useState(false);

  useEffect(() => {
    setEthInput(parseFloat(ethToString(MIN_ETH_PER_ADDRESS)));
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (currentStep === 1) {
      timeoutId = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 2500);
    } else if (currentStep === 5) {
      timeoutId = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 2000);
    } else if (currentStep === 7 && sending === 3) {
      timeoutId = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 3000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentStep, sending]);

  useEffect(() => {
    if (sending === 1) {
      setCurrentStep(7);
    } else if (sending === 2) {
      setCurrentStep(6);
      setSending(0);
    }
  }, [sending]);
  const steps: Array<IStepBubble> = [
    {
      bubble: (
        <>
          Namada will use its on-chain Public Goods Funding (PGF) to reward{" "}
          {CURRENT_CAMPAIGN.title} donors with NAM. There are{" "}
          <span style={{ color: "#80fffa" }}>required steps</span> involved to
          be recognized, so make sure to follow along as we guide you through
          the process.
        </>
      ),
      imageContainer: <FaEthereum color='#dbdbdb' size='3rem' />,
      image: { src: "/icon_x192.png", alt: "Namada", width: 96, height: 96 },
      nextTitle: "START",
    },
    {
      bubble: <>Some ground rules before we start...</>,
      ghost: true,
      navEnabled: false,
      imageContainer: (
        <span
          className={`${styles.shield} ${
            currentStep === 1 ? styles.animate : ""
          }`}
        >
          <FaShield size='3rem' />
        </span>
      ),
    },
    {
      bubble: (
        <div
          style={{
            fontSize: "0.9rem",
            padding: "0px 0 15px 0",
          }}
        >
          <h4 style={{ textAlign: "center" }}>
            Beware: nobody from Namada will be handling donations!
          </h4>
          <ul className={styles.table}>
            <li>Anyone is free to donate</li>
            <li>Namada and its community are not an intermediary</li>
            <li>{CURRENT_CAMPAIGN.title} is not involved in this campaign</li>
            <li>
              A recorded donation does not mean recognized-the Namada community
              will do this (so don&#39;t bot!)
            </li>
          </ul>
        </div>
      ),
      imageContainer: <IoWarning size='3rem' color='#ffff00' />,
      subscript: (
        <i>
          Since we are not handling donations, we cannot refund your donation,
          even if you make a mistake. So make sure you{" "}
          <u>read carefully and follow each step closely</u>.
        </i>
      ),
      backOnClick: () => {
        setCurrentStep(currentStep - 2);
      },
      maxHeight: "265px",
    },
    {
      bubble: (
        <>
          <ul className={styles.timetable}>
            <li>
              <h4>OPENS</h4>
              <span style={{ color: "rgb(209 209 209)" }}>
                {formatUTCDate(CURRENT_CAMPAIGN.startDate)}
              </span>
            </li>
            <li>
              <h4>CLOSES</h4>
              <span style={{ color: "rgb(209 209 209)" }}>
                {formatUTCDate(CURRENT_CAMPAIGN.endDate)}
              </span>{" "}
            </li>
          </ul>
          Participants in the Donor Drop will be recognized on a{" "}
          <span style={{ color: "rgb(128 255 209)" }}>
            First Come First Serve basis
          </span>
          . So once the goal of <FaEthereum />
          <span style={{ color: "rgb(123 199 217)" }}>
            {ethToString(TARGET_ETH)} ETH
          </span>{" "}
          is reached, the donation recognition period will end.
        </>
      ),
      imageContainer: <IoIosClock size='3rem' />,
      subscript: (
        <>Donations falling outside this period won&#39;t be recognized.</>
      ),
    },
    {
      bubble: (
        <>
          <ul className={styles.timetable}></ul>A participant has to have
          donated a{" "}
          <span style={{ color: "rgb(123 199 217)" }}>
            minimum of <FaEthereum /> {ethToFloat(MIN_ETH_PER_ADDRESS, 2)} ETH.
          </span>{" "}
          Feel free to donate more, but we will recognize a{" "}
          <span style={{ color: "rgb(123 199 217)" }}>
            maximum of <FaEthereum /> {ethToFloat(MAX_ETH_PER_ADDRESS, 2)} ETH
          </span>
          .
          <div style={{ width: "87%", margin: "0 auto" }}>
            <DonationProgress
              value={ethers.parseEther(ethInput.toString())}
              min={MIN_ETH_PER_ADDRESS}
              max={MAX_ETH_PER_ADDRESS}
              showActual={false}
              style={{ width: "100%", maxWidth: "93%" }}
              status={
                <div style={{ fontSize: "0.9rem" }}>
                  <input
                    className={styles.ethInput}
                    type='number'
                    step={0.01}
                    min={0}
                    max={1}
                    value={ethInput}
                    onChange={(e) => {
                      setEthInput(Math.max(0, parseFloat(e.target.value) || 0));
                    }}
                    onFocus={onFocus}
                    tabIndex={-1}
                  />
                  <span
                    style={{
                      marginBottom: "0px",
                      marginLeft: "5px",
                      display: "inline-block",
                    }}
                    className={styles.text}
                  >
                    {"ETH "}={" "}
                    {ethInput < parseFloat(ethToString(MIN_ETH_PER_ADDRESS))
                      ? "not eligible 😞"
                      : `${(
                          (Math.min(0.3, ethInput) /
                            parseFloat(ethers.formatEther(TARGET_ETH))) *
                          REWARD_NAM
                        ).toFixed(2)} NAM ${ethInput >= 0.3 ? "🤯" : "🥰"}`}
                  </span>
                </div>
              }
              showSuperscript={true}
            />
          </div>
        </>
      ),
      subscript: (
        <>
          Multiple transactions are possible, as long as the sum total meets the
          above criteria.
        </>
      ),
      imageContainer: <IoWalletSharp size='3rem' />,
    },
    {
      bubble: <>Alright, let&#39;s get started!</>,
      ghost: true,
      navEnabled: false,
      imageContainer: (
        <span
          className={`${styles.rocket} ${
            currentStep === 5 ? styles.animate : ""
          }`}
        >
          <IoRocket size='3rem' />
        </span>
      ),
    },
    {
      stepNumber: "BUT FIRST...",
      bubble: (
        <>
          Would you like to attach a message to your donation?
          <DonationMessage
            setSending={setSending}
            onFocus={onFocus}
            tabIndex={tabIndex}
          />
        </>
      ),
      imageContainer: <FaCommentAlt size='3rem' />,
      nextTitle: "SKIP",
      nextOnClick: () => {
        setCurrentStep(currentStep + 2);
      },
      backOnClick: () => {
        setCurrentStep(currentStep - 2);
      },
    },
    {
      bubble:
        sending === 3 ? (
          <>Message sent successfully!</>
        ) : (
          <>Trying to send your message (check your wallet)...</>
        ),
      ghost: true,
      navEnabled: false,
      imageContainer: (
        <span
          className={`${styles.rocket} ${
            currentStep === 4 ? styles.animate : ""
          }`}
        >
          <FaCommentAlt size='3rem' />
        </span>
      ),
    },
    {
      stepNumber: 1,
      bubble: (
        <>
          Open MetaMask, go to{" "}
          <span style={{ color: "#ab91e5" }}>Settings {">"} Advanced</span> and
          toggle <span style={{ color: "#ab91e5" }}>Show Hex Data</span> on.
        </>
      ),
      image: {
        src: "/logos/metamask.png",
        alt: "MetaMask",
        width: 96,
        height: 96,
      },
      subscript: (
        <>
          <span>Not using MetaMask or on a mobile device?</span> See{" "}
          <a
            href='https://www.myetherwallet.com/blog/how-to-send-a-message-onchain/'
            target='_blank'
            rel='noreferrer'
            onFocus={onFocus}
            tabIndex={tabIndex}
          >
            this guide
          </a>{" "}
          on how to do this using MyEtherWallet.
        </>
      ),
      nextTitle: "NEXT",
      backOnClick: () => {
        setCurrentStep(currentStep - 2);
      },
    },
    {
      stepNumber: 2,
      bubble: (
        <>
          Open your MetaMask wallet in a dedicated tab (
          <span style={{ color: "#ab91e5" }}>Expand View</span>) and prepare to
          send{" ETH "}
          <span style={{ color: "#d1d1d1" }}>
            (<FaEthereum />
            {CURRENT_CAMPAIGN.minEthPerAddress}-
            <FaEthereum />
            {CURRENT_CAMPAIGN.maxEthPerAddress})
          </span>{" "}
          to{" "}
          <button
            className={styles.copyButton}
            onFocus={onFocus}
            tabIndex={tabIndex}
            onClick={() => {
              const addressType = CURRENT_CAMPAIGN.donorAddressEns
                ? "ENS domain"
                : "address";

              copyToClipboard(
                CURRENT_CAMPAIGN.donorAddressEns ||
                  CURRENT_CAMPAIGN.donorAddress,
                () => {
                  notify({
                    type: "success",
                    message: `Copied ${addressType} to clipboard!`,
                    options: {
                      duration: 4000,
                      Icon: FaClipboard,
                    },
                  });
                },
                () => {
                  notify({
                    type: "error",
                    message: `Failed to copy ${addressType} to clipboard!`,
                    options: {
                      duration: 4000,
                      Icon: FaExclamation,
                    },
                  });
                }
              );
            }}
          >
            {CURRENT_CAMPAIGN.donorAddressEns || CURRENT_CAMPAIGN.donorAddress}{" "}
            <FaCopy />
          </button>{" "}
          on the{" "}
          <span style={{ background: "#262626", color: "white" }}>
            {DONOR_NETWORK}
          </span>
          . <span style={{ color: "white" }}>Do not transfer just yet!</span>
        </>
      ),
      subscript: (
        <>
          {CURRENT_CAMPAIGN.donorAddressEns && (
            <>
              ENS domains not working?
              <button
                className={styles.copyButtonSmall}
                onFocus={onFocus}
                tabIndex={tabIndex}
                onClick={() => {
                  copyToClipboard(
                    CURRENT_CAMPAIGN.donorAddress,
                    () => {
                      notify({
                        type: "success",
                        message: "Copied address to clipboard!",
                        options: {
                          duration: 4000,
                          Icon: FaClipboard,
                        },
                      });
                    },
                    () => {
                      notify({
                        type: "error",
                        message: "Failed to copy the address to clipboard!",
                        options: {
                          duration: 4000,
                          Icon: FaExclamation,
                        },
                      });
                    }
                  );
                }}
              >
                {CURRENT_CAMPAIGN.donorAddress} <FaCopy />
              </button>
              <br />
            </>
          )}
        </>
      ),
      // imageContainer: <FaEthereum size='3rem' color='#70f7ff' />,
      image: {
        src: "/logos/metamask.png",
        alt: "MetaMask",
        width: 96,
        height: 96,
      },
      nextTitle: "NEXT",
    },
    {
      stepNumber: 3,
      bubble: (
        <>
          Use the{" "}
          <a
            href='https://namada.net/keychain'
            target='_blank'
            rel='noreferrer'
            className={styles.extension}
            onFocus={onFocus}
            tabIndex={tabIndex}
          >
            Namada extension <FaExternalLinkAlt size={"0.7rem"} />{" "}
          </a>{" "}
          to view your keys and paste your Transparent address here to get its{" "}
          <span style={{ color: "#5cefef" }}>Hex value</span>.
          <AsciiToHex
            onFocus={onFocus}
            tabIndex={tabIndex}
            setAllowNext={setAllowNext}
          />
        </>
      ),
      image: { src: "/icon_x192.png", alt: "Namada", width: 96, height: 96 },
      // imageContainer: <FaHashtag size='3rem' />,
      subscript: (
        <>
          If you don&#39;t own a transparent address,{" "}
          <a
            href='https://namada.net/keychain'
            target='_blank'
            rel='noreferrer'
            className={styles.extension}
            onFocus={onFocus}
            tabIndex={tabIndex}
          >
            download the extension
          </a>{" "}
          and create new keys.
        </>
      ),
      nextTitle: "NEXT",
      relative: true,
      nextDisabled: !allowNext,
    },
    {
      stepNumber: 4,
      bubble: (
        <>
          Finally, in MetaMask, paste the{" "}
          <span style={{ color: "#5cefef" }}>Hex value</span> into the{" "}
          <span style={{ color: "#ab91e5" }}>Hex Data</span>-field and send your
          donation to{" "}
          <span className={styles.donorLink}>
            <a
              href={`${EXPLORER_LINK}/address/${CURRENT_CAMPAIGN.donorAddress}`}
              target='_blank'
              rel='noreferrer'
              onFocus={onFocus}
              tabIndex={tabIndex}
            >
              {CURRENT_CAMPAIGN.title}
            </a>
          </span>
          .
        </>
      ),
      image: {
        src: "/logos/metamask.png",
        alt: "MetaMask",
        width: 96,
        height: 96,
      },
      subscript: (
        <>
          We have no control over anything you send, so participate at your own
          risk 💀.
        </>
      ),
    },
    {
      bubble: (
        <>
          That&#39;s it! If you follow these steps during the donation
          recognition period, you should be eligible! Head over to the{" "}
          <span
            className={styles.account}
            onClick={() => {
              smoothNavigate(3);
            }}
          >
            Account page
          </span>{" "}
          to see whether your donation was recorded.
        </>
      ),
      imageContainer: <GiPartyPopper color='#dbdbdb' size='3rem' />,
      nextOnClick: () => {
        // setCurrentStep(0);
        smoothNavigate(3);
      },
      nextTitle: "FINISH",
      subscript: (
        <>
          Please participate with one address & don&#39;t bot 🤖. The Namada
          community will use a PGF governance proposal to distribute NAM to
          recognized addresses.
        </>
      ),
    },
  ];

  return (
    <>
      <div className={styles.progress}>
        {steps.map((step, index) => (
          <div
            key={index}
            className={`${styles.step} ${
              index <= currentStep ? styles.activeStep : ""
            } ${step.ghost ? styles.ghost : ""}`}
            onClick={() => setCurrentStep(index)}
          />
        ))}
      </div>
      <div className={`${styles.container} ${isActive ? styles.visible : ""}`}>
        {steps.map((step, i) => (
          <StepBubble
            key={i}
            stepNumber={step.stepNumber}
            bubble={step.bubble}
            image={step.image}
            subscript={step.subscript}
            imageContainer={step.imageContainer}
            relative={step.relative}
            hidden={i !== currentStep}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            max={steps.length - 1}
            backTitle={step.backTitle}
            nextTitle={step.nextTitle}
            navEnabled={step.navEnabled}
            nextOnClick={step.nextOnClick}
            backOnClick={step.backOnClick}
            ghost={step.ghost}
            onFocus={onFocus}
            tabIndex={tabIndex}
            maxHeight={step.maxHeight}
            nextDisabled={step.nextDisabled}
          />
        ))}
      </div>
    </>
  );
};

export default Donate;
