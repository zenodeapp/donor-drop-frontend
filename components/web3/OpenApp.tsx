import React from "react";
import { useTheme } from "../../context/ThemeProvider";
import styles from "../../styles/wallet.module.scss";

const OpenApp = ({}: {}) => {
  const { setShowApp } = useTheme();
  return (
    <button
      id={styles["return-to-app"]}
      onClick={() => {
        setShowApp(true);
      }}
    >
      return to app
    </button>
  );
};

export default OpenApp;
