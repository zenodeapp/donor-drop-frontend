import React from "react";
import { getClassNameByStyle } from "../../../helpers/layout";
import { FaPaperPlane, FaWallet } from "react-icons/fa";
import DonationAddress from "../donations/DonationAddress";
import styles from "../../../styles/link.module.scss";

type IStepBubble = {
  stepNumber?: number;
  bubble: React.ReactNode;
  imageContainer?: React.ReactNode;
  relative?: boolean;
  hidden?: boolean;
  ghost?: boolean;
};

const StepBubble = ({
  stepNumber,
  bubble,
  imageContainer,
  relative,
  hidden,
  ghost,
}: IStepBubble) => {
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
        <div className={styles.leftContainer}>{imageContainer}</div>
        <div className={styles.rightContainer}>
          <div className={styles.bubble}>{bubble}</div>
        </div>
      </div>
    </div>
  );
};

const Link = ({
  isActive,
  onFocus,
  tabIndex,
}: {
  isActive: boolean;
  onFocus: React.FocusEventHandler;
  tabIndex?: number;
}) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [sending, setSending] = React.useState(0);

  React.useEffect(() => {
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

  React.useEffect(() => {
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
          If you made a mistake during the process, enter your transparent
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
          <>Address wasn&#39;t sent successfully.</>
        ) : (
          <>Trying to send your address (check your wallet)...</>
        ),
      ghost: true,
      imageContainer: (
        <span
          className={`${styles.rocket} ${
            currentStep === 1 ? styles.animate : ""
          }`}
        >
          <FaPaperPlane size='3rem' />
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
            bubble={step.bubble}
            imageContainer={step.imageContainer}
            relative={step.relative}
            hidden={i !== currentStep}
            ghost={step.ghost}
          />
        ))}
      </div>
    </>
  );
};

export default Link;
