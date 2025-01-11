import React from "react";
import styles from "../../../styles/tooltip.module.scss";

const TooltipQuestion = ({ message }: { message: React.ReactNode }) => {
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const tooltipRef = React.useRef<HTMLSpanElement>(null);
  const tooltipTextRef = React.useRef<HTMLSpanElement>(null);
  const [leftSide, setLeftSide] = React.useState(false);

  React.useEffect(() => {
    const handleMouseOver = () => {
      if (tooltipRef.current && tooltipTextRef.current) {
        const boundingRect = tooltipRef.current.getBoundingClientRect();
        const boundingRectQ = tooltipTextRef.current.getBoundingClientRect();

        const isRightPossible =
          boundingRectQ.x + boundingRectQ.width + boundingRect.width + 5 <
          window.innerWidth;

        if (isRightPossible) {
          setLeftSide(false);
        } else {
          setLeftSide(true);
        }
      }
    };

    if (tooltipTextRef.current) {
      tooltipTextRef.current.addEventListener("mouseover", handleMouseOver);
    }

    return () => {
      if (tooltipTextRef.current) {
        tooltipTextRef.current.removeEventListener(
          "mouseover",
          handleMouseOver
        );
      }
    };
  }, []);

  return (
    <span
      className={`${styles["tooltip"]}${
        tooltipOpen ? ` ${styles.tooltipOpen}` : ""
      }`}
    >
      <span
        className={styles["tooltip-text"]}
        onClick={() => {
          setTooltipOpen(!tooltipOpen);
        }}
        ref={tooltipTextRef}
      >
        ?
        <span
          className={`${styles["tooltip-balloon"]}${
            tooltipOpen ? ` ${styles.tooltipOpen}` : ""
          }${leftSide ? ` ${styles.leftSide}` : ""}`}
          onMouseLeave={() => {
            setTooltipOpen(false);
          }}
          ref={tooltipRef}
        >
          {message}
        </span>
      </span>
    </span>
  );
};

export default TooltipQuestion;
