import React, { useEffect, useState } from "react";
import styles from "../../../styles/donate.module.scss";
import Image from "next/image";
import { getClassNameByStyle } from "../../../helpers/layout";
import { FaCommentAlt, FaEthereum, FaHashtag } from "react-icons/fa";
import { formatUTCDate } from "../../../helpers/format";
import {
  DONOR_NETWORK,
  END_DATE,
  MAX_ETH_PER_ADDRESS,
  MIN_ETH_PER_ADDRESS,
  REWARD_NAM,
  START_DATE,
  TARGET_ETH,
} from "../../../donations.config";
import { IoIosClock } from "react-icons/io";
import { ethToString } from "../../../helpers/web3";
import { GiPartyPopper } from "react-icons/gi";
import { useLayout } from "../../../context/LayoutProvider";
import { IoRocket, IoWalletSharp, IoWarning } from "react-icons/io5";
import DonationProgress from "../donations/DonationProgress";
import { ethers } from "ethers";
import { FaShield } from "react-icons/fa6";
import DonationMessage from "../donations/DonationMessage";
import AsciiToHex from "../elements/AsciiToHex";

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
}: {
  max: number;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  backTitle?: string;
  nextTitle?: string;
  nextOnClick?: React.MouseEventHandler<HTMLButtonElement>;
  backOnClick?: React.MouseEventHandler<HTMLButtonElement>;
  onFocus: React.FocusEventHandler<HTMLButtonElement>;
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
        >
          <span className={styles.back}>{backTitle ? backTitle : "BACK"}</span>
          <span className={styles.line}></span>
        </button>
      )}
      <button
        className={getClassNameByStyle(styles, "navButton nextButton")}
        onClick={
          nextOnClick
            ? nextOnClick
            : () => {
                if (currentStep < max) setCurrentStep(currentStep + 1);
              }
        }
        onFocus={onFocus}
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
  maxHeight,
}: IStepBubble & {
  max: number;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  onFocus: React.FocusEventHandler<HTMLButtonElement>;
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
}: {
  isActive: boolean;
  onFocus: React.FocusEventHandler;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { smoothNavigate } = useLayout();
  const [ethInput, setEthInput] = useState(0.03);
  const [sending, setSending] = useState(0);

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
    } else if (currentStep === 10 && sending === 3) {
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
      setCurrentStep(10);
    } else if (sending === 2) {
      setCurrentStep(9);
      setSending(0);
    }
  }, [sending]);
  const steps: Array<IStepBubble> = [
    {
      bubble: (
        <>
          Namada will use its on-chain Public Goods Funding (PGF) to reward Coin
          Center donors with NAM. There are{" "}
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
            <li>Anyone is free to donate as usual</li>
            <li>Namada and its community are not an intermediary</li>
            <li>Coin Center is not involved in this campaign</li>
            <li>
              A recorded donation does not mean recognized-the Namada community
              will do this (so don&#39;t bot!)
            </li>
          </ul>
          <p>
            It&#39;s literally just: send ETH to{" "}
            {process.env.NEXT_PUBLIC_DONOR_ADDRESS_ENS} with your tnam address
            in the memo so that the Namada community can see and recognize it.
          </p>
        </div>
      ),
      imageContainer: <IoWarning size='3rem' color='#ffff00' />,
      subscript: (
        <>
          Since we are not handling donations, we cannot refund your donation,
          even if you make a mistake. Anyone trying to convince you to do
          anything but send ETH to {process.env.NEXT_PUBLIC_DONOR_ADDRESS}{" "}
          <i>or</i> {process.env.NEXT_PUBLIC_DONOR_ADDRESS_ENS} is likely
          scamming you.
          <br />
          <br />
          We have no control over anything you send, so participate at your own
          risk 💀
        </>
      ),
      backOnClick: () => {
        setCurrentStep(currentStep - 2);
      },
      relative: true,
      maxHeight: "235px",
    },
    {
      bubble: (
        <>
          <ul className={styles.timetable}>
            <li>
              <h4>OPENS</h4>
              <span style={{ color: "rgb(209 209 209)" }}>
                {formatUTCDate(START_DATE)}
              </span>
            </li>
            <li>
              <h4>CLOSES</h4>
              <span style={{ color: "rgb(209 209 209)" }}>
                {formatUTCDate(END_DATE)}
              </span>{" "}
            </li>
          </ul>
          Participants in the Donation Drop will be recognized on a{" "}
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
            minimum of <FaEthereum /> 0.03 ETH.
          </span>{" "}
          Feel free to donate more, but we will recognize a{" "}
          <span style={{ color: "rgb(123 199 217)" }}>
            maximum of <FaEthereum /> 0.30 ETH
          </span>
          .
          <div style={{ width: "90%", margin: "0 auto" }}>
            <DonationProgress
              value={ethers.parseEther(ethInput.toString())}
              min={MIN_ETH_PER_ADDRESS}
              max={MAX_ETH_PER_ADDRESS}
              showActual={false}
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
                    {ethInput < 0.03
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
      stepNumber: 1,
      bubble: (
        <>
          Have your <span style={{ color: "#ffffa8" }}>TNAM address</span> ready
          for the donation.
        </>
      ),
      subscript: (
        <>
          If you don&#39;t own a TNAM address,{" "}
          <a
            href='https://namada.net/keychain'
            target='_blank'
            rel='noreferrer'
            className={styles.extension}
            onFocus={onFocus}
          >
            download the extension
          </a>{" "}
          and create a new wallet.
        </>
      ),
      image: { src: "/icon_x192.png", alt: "Namada", width: 96, height: 96 },
      nextTitle: "NEXT",
      backOnClick: () => {
        setCurrentStep(currentStep - 2);
      },
    },
    {
      stepNumber: 2,
      bubble: (
        <>
          Paste your TNAM address here to get its{" "}
          <span style={{ color: "#5cefef" }}>Hex value</span> and copy it to
          your clipboard.
          <AsciiToHex />
        </>
      ),
      imageContainer: <FaHashtag size='3rem' />,
      subscript: (
        <>This Hex value is essential for completing the donation process.</>
      ),
      nextTitle: "NEXT",
    },
    {
      stepNumber: 3,
      bubble: (
        <>
          Open MetaMask, go to{" "}
          <span style={{ color: "#ab91e5" }}>Settings {">"} Advanced</span> and
          toggle <span style={{ color: "#ab91e5" }}>Show Hex Data</span> to
          enable it.
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
          This step is required for attaching data to a transfer.{" "}
          <span style={{ color: "#cdcdcd" }}>Don&#39;t use MetaMask?</span> Then{" "}
          <a
            href='https://www.myetherwallet.com/blog/how-to-send-a-message-onchain/'
            target='_blank'
            rel='noreferrer'
            onFocus={onFocus}
          >
            click here
          </a>{" "}
          for a guide on how to do this using MyEtherWallet.
        </>
      ),
      nextTitle: "NEXT",
    },
    {
      stepNumber: "OPTIONAL STEP",
      bubble: (
        <>
          Before continuing, would you like to attach a message to your
          donation?
          <DonationMessage setSending={setSending} />
        </>
      ),
      imageContainer: <FaCommentAlt size='3rem' />,
      nextTitle: "SKIP",
      nextOnClick: () => {
        setCurrentStep(currentStep + 2);
      },
    },
    {
      bubble:
        sending === 3 ? (
          <>Message sent successfully!</>
        ) : (
          <>Trying to send your message...</>
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
      stepNumber: 4,
      bubble: (
        <>
          Finally, transfer between <FaEthereum />
          0.03 ETH and <FaEthereum />
          0.30 ETH to{" "}
          <span style={{ color: "rgb(239 183 132)" }}>
            <a
              href={`https://etherscan.io/address/${process.env.NEXT_PUBLIC_DONOR_ADDRESS}`}
              target='_blank'
              rel='noreferrer'
              onFocus={onFocus}
            >
              {process.env.NEXT_PUBLIC_DONOR_ADDRESS_ENS}
            </a>
          </span>{" "}
          on the{" "}
          <span style={{ background: "#262626", color: "white" }}>
            {DONOR_NETWORK}
          </span>{" "}
          and make sure to type the hex variant of your TNAM address in the Hex
          data field.
        </>
      ),
      image: {
        src: "/logos/coin_center.png",
        alt: "Coin Center",
        width: 400,
        height: 400,
      },
      backOnClick: () => {
        setCurrentStep(currentStep - 2);
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
          Please participate with one ETH address & don&#39;t bot 🤖. The Namada
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
            maxHeight={step.maxHeight}
          />
        ))}
      </div>
    </>
  );
};

export default Donate;
