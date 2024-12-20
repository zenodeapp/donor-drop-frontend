import React from "react";
import inputStyle from "../../styles/input.module.scss";
import { useTheme } from "../../context/ThemeProvider";
import dynamic from "next/dynamic";
import { getClassNameByStyle } from "../../helpers/layout";

const Input = dynamic(() => import("./Input"));

const DynamicInput = () => {
  const { showApp, inputInitialized } = useTheme();

  return (
    <>
      {(showApp || inputInitialized) && (
        <li
          className={getClassNameByStyle(
            inputStyle,
            `app${showApp ? " active" : ""}`
          )}
        >
          <Input />
        </li>
      )}
    </>
  );
};

export default DynamicInput;
