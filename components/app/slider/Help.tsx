import React, { useEffect, useState } from "react";
import styles from "../../../styles/help.module.scss";
import Image from "next/image";
import { getClassNameByStyle } from "../../../helpers/layout";
import { FaRedo, FaWallet } from "react-icons/fa";
import { MIN_ETH_PER_ADDRESS } from "../../../donations.config";
import { ethToString } from "../../../helpers/web3";
import DonationAddress from "../donations/DonationAddress";

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

const StepBubble = ({
  bubble,
  stepNumber,
  image,
  subscript,
  imageContainer,
  relative,
  hidden,
  ghost,
  maxHeight,
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
        </div>
      </div>
    </div>
  );
};

const Help = ({
  isActive,
  onFocus,
  tabIndex,
}: {
  isActive: boolean;
  onFocus: React.FocusEventHandler;
  tabIndex?: number;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [ethInput, setEthInput] = useState(0.03);
  const [sending, setSending] = useState(0);

  useEffect(() => {
    setEthInput(parseFloat(ethToString(MIN_ETH_PER_ADDRESS)));
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (currentStep === 2) {
      timeoutId = setTimeout(() => {
        setCurrentStep(0);
      }, 3000);
    } else if (currentStep === 3) {
      timeoutId = setTimeout(() => {
        setCurrentStep(0);
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
      setCurrentStep(1);
    } else if (sending === 2) {
      setCurrentStep(0);
      setSending(0);
    }
  }, [sending]);
  const steps: Array<IStepBubble> = [
    {
      bubble: (
        <>
          If you made a mistake during the process, type your transparent
          address here and sign a message with the Ethereum wallet you used.
          <DonationAddress
            setSending={setSending}
            onFocus={onFocus}
            tabIndex={tabIndex}
          />
        </>
      ),
      imageContainer: <FaWallet size='3rem' />,
      relative: true,
    },
    {
      bubble:
        sending === 3 ? (
          <>Address sent successfully!</>
        ) : sending === 2 ? (
          <>Address wasn't sent successfully.</>
        ) : (
          <>Trying to send your address (check your wallet)...</>
        ),
      ghost: true,
      navEnabled: false,
      imageContainer: (
        <span
          className={`${styles.rocket} ${
            currentStep === 4 ? styles.animate : ""
          }`}
        >
          <FaRedo size='3rem' />
        </span>
      ),
    },
  ];

  return (
    <>
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

export default Help;
