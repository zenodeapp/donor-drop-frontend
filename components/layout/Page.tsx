import React from "react";
import { IPage } from "../../context/LayoutTypes";

const Page = ({ id, className, heading, sub, children }: IPage) => {
  return (
    <div id={id} className={className ? className : "page"}>
      {heading && <h2>{heading}</h2>}
      {sub && <h3>{sub}</h3>}
      {children}
    </div>
  );
};

export default Page;
