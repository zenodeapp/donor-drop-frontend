import React from "react";

import bgStyle from "../../styles/background.module.scss";
import { getClassNameByStyle } from "../../helpers/layout";

const Background = () => {
  return (
    <div id={bgStyle["ripple-bg"]}>
      <div className={bgStyle["circle-wrapper-2"]}>
        <div className={bgStyle["circle-wrapper"]}>
          <div
            className={getClassNameByStyle(bgStyle, "circle xxlarge shade1")}
          ></div>
          <div
            className={getClassNameByStyle(bgStyle, "circle xlarge shade2")}
          ></div>
          <div
            className={getClassNameByStyle(bgStyle, "circle large shade3")}
          ></div>
          <div
            className={getClassNameByStyle(bgStyle, "circle medium shade4")}
          ></div>
          <div
            className={getClassNameByStyle(bgStyle, "circle small shade5")}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Background;
