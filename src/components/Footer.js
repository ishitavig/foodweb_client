import React from "react";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = (props) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        textAlign: "center",
        backgroundColor: "black",
        color: "white",
      }}
    >
      <FontAwesomeIcon icon={faCopyright} /> FoodWeb 2021. All rights reserved.
    </div>
  );
};

export default Footer;
