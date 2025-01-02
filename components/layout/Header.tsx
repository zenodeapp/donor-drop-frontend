import React from "react";
import { IHeader } from "./_types";

const Header = ({ title, children }: IHeader) => {
  return (
    <header>
      {title && <h1>{title}</h1>}
      {children}
    </header>
  );
};

Header.defaultProps = {
  showSocials: false,
};

export default Header;
