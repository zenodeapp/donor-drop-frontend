import React from "react";
import { useTheme } from "../../context/ThemeProvider";
import styles from "../../styles/wallet.module.scss";

const OpenApp = ({}: {}) => {
  const { smoothShowApp } = useTheme();
  return (
    <button
      id={styles["return-to-app"]}
      onClick={() => {
        smoothShowApp(true);
      }}
    >
      return to app
    </button>
  );
};

export default OpenApp;
