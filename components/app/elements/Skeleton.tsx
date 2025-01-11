import React, { CSSProperties } from "react";

import styles from "../../../styles/skeleton.module.scss";

const Skeleton = ({ height, width }: { width?: string; height?: string }) => {
  return (
    <div
      style={{
        width,
        height,
      }}
      className={styles.skeleton}
    ></div>
  );
};

const SkeletonText = ({
  text,
  style,
  status,
}: {
  text?: React.ReactNode;
  style?: CSSProperties;
  status?: "process" | "stale" | "done";
}) => {
  return (
    <div
      style={style}
      className={`${styles.skeletonText} ${status ? styles[status] : ""}`}
    >
      {text}
    </div>
  );
};

export { Skeleton, SkeletonText };
