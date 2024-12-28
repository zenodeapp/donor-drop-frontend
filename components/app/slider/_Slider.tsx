import React from "react";
import sliderStyle from "../../../styles/slider.module.scss";
import { useLayout } from "../../../context/LayoutProvider";

const Slider = ({
  slides,
  relativeIndex,
}: {
  slides: Array<React.ReactNode>;
  relativeIndex: number;
}) => {
  const { activeSlide } = useLayout();

  return (
    <div className={sliderStyle.slider}>
      {slides.map((slide, i) => {
        return (
          <div
            key={i}
            className={`${
              relativeIndex === i
                ? sliderStyle["slide-relative"]
                : sliderStyle.slide
            }`}
            style={{
              transform: `translateX(${
                (i + 1) * 100 - 100 * (activeSlide + 1)
              }%) scale(${activeSlide === i ? 1 : 0.9})`,
            }}
          >
            {slide}
          </div>
        );
      })}
    </div>
  );
};

export default Slider;
