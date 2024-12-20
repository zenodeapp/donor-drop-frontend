import React from "react";
import { IContent } from "./_types";

const Content = ({ id, children }: IContent) => {
  return <div id={id ? id : "content"}>{children}</div>;
};

export default Content;
