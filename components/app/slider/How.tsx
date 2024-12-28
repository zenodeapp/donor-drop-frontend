import React, { useEffect, useState } from "react";
import styles from "../../../styles/how.module.scss";
import Image from "next/image";
import { getClassNameByStyle } from "../../../helpers/layout";
import { FaCommentAlt, FaEthereum } from "react-icons/fa";
import { formatUTCDate } from "../../../helpers/format";
import {
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
import { IoRocket, IoWalletSharp } from "react-icons/io5";
import DonationProgress from "../donations/DonationProgress";
import { ethers } from "ethers";
import { FaShield } from "react-icons/fa6";
import DonationMessage from "../donations/DonationMessage";

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
};

const NavigationButtons = ({
  max,
  currentStep,
  setCurrentStep,
  backTitle,
  nextTitle,
  nextOnClick,
  backOnClick,
}: {
  max: number;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  backTitle?: string;
  nextTitle?: string;
  nextOnClick?: React.MouseEventHandler<HTMLButtonElement>;
  backOnClick?: React.MouseEventHandler<HTMLButtonElement>;
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
}: IStepBubble & {
  max: number;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
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
        <div className={styles.rightContainer}>
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

const How = ({ isActive }: { isActive: boolean }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { setActiveSlide } = useLayout();
  const [ethInput, setEthInput] = useState(0.03);
  const [sending, setSending] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (currentStep === 1) {
      timeoutId = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 2500);
    } else if (currentStep === 4) {
      timeoutId = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 2000);
    } else if (currentStep === 8 && sending === 3) {
      timeoutId = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 3000);
    }

    // Cleanup function to clear the timeout if `currentStep` changes or component unmounts
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [currentStep, sending]);

  useEffect(() => {
    if (sending === 1) {
      setCurrentStep(8);
    } else if (sending === 2) {
      setCurrentStep(7);
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
          become eligible, so make sure to follow along as we guide you through
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
          The drop will be on a{" "}
          <span style={{ color: "rgb(128 255 209)" }}>
            First Come First Serve basis (FCFS)
          </span>
          . So once the goal of <FaEthereum />
          <span style={{ color: "rgb(123 199 217)" }}>
            {ethToString(TARGET_ETH)} ETH
          </span>{" "}
          is reached, the window will close.
        </>
      ),
      imageContainer: <IoIosClock size='3rem' />,
      subscript: (
        <>Donations falling outside this window won&#39;t be considered.</>
      ),
      backOnClick: () => {
        setCurrentStep(currentStep - 2);
      },
    },
    {
      bubble: (
        <>
          <ul className={styles.timetable}></ul>A participant has to have
          donated a{" "}
          <span style={{ color: "rgb(123 199 217)" }}>
            minimum of <FaEthereum /> 0.03 ETH
          </span>{" "}
          and a{" "}
          <span style={{ color: "rgb(123 199 217)" }}>
            maximum of <FaEthereum /> 0.30 ETH
          </span>
          . This means that donating more won&#39;t increase your allocation of
          NAM.
          <div style={{ width: "90%", margin: "0 auto" }}>
            <DonationProgress
              totalDonated={ethers.utils.parseEther(ethInput.toString())}
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
                            parseFloat(ethers.utils.formatEther(TARGET_ETH))) *
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
            currentStep === 4 ? styles.animate : ""
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
      relative: true,
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
      stepNumber: 3,
      bubble: (
        <>
          Finally, transfer between <FaEthereum />
          0.03 ETH and <FaEthereum />
          0.30 ETH to{" "}
          <span style={{ color: "rgb(239 183 132)" }}>
            <a
              href='https://etherscan.io/address/0x15322B546e31F5Bfe144C4ae133A9Db6F0059fe3'
              target='_blank'
              rel='noreferrer'
            >
              coincenter.eth
            </a>
          </span>{" "}
          and make sure to type your TNAM address in the Hex data field.
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
    },
    {
      bubble: (
        <>
          That&#39;s it! If you followed these steps and your donation is on
          time, you should be eligible! Head over to the Account page to see
          whether your donation got included.
        </>
      ),
      imageContainer: <GiPartyPopper color='#dbdbdb' size='3rem' />,
      nextOnClick: () => {
        setCurrentStep(0);
        setActiveSlide(3);
      },
      nextTitle: "FINISH",
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
          />
        ))}
      </div>
    </>
  );
};

export default How;
