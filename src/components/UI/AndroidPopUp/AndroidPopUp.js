import React from "react";

import classes from "./AndroidPopUp.scss";

const AndroidPopUp = props => {
  return (
    <div
      className={classes.Popup}
      style={{
        transform: props.showPop ? "translateX(0)" : "translateX(-100vh)",
        opacity: !props.showPop ? "1" : "0"
      }}
    >
      {props.popupText ? props.popupText : "POP UP"}
    </div>
  );
};

export default AndroidPopUp;
