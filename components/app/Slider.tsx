import React from "react";
import sliderStyle from "../../styles/slider.module.scss";

const Slider = ({
  slides,
  activeSlide,
  relativeIndex,
}: {
  slides: Array<React.ReactNode>;
  activeSlide: number;
  relativeIndex: number;
}) => {
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
              }%) scale(${activeSlide === 0 ? 1 : 0.9})`,
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
