import React from "react";

import classes from "./Totalizator.scss";

const Totalizator = props => {
  let shadow = null;
  let confMaxHeight = "100%";
  let confPadding = null;
  let confMarginLeft = "-0.9rem";
  let confMarginLeft2 = "0.55rem";

  if (props.bShadow) {
    shadow = props.bShadow;
    confPadding = "8px";
    confMarginLeft = "2rem";
    confMarginLeft2 = "0.9rem";
  }

  if (props.confMaxHeight) {
    confMaxHeight = props.confHeight;
  }

  return (
    <div
      className={classes.Container}
      style={{
        background: props.backTotal,
        color: props.backColor,
        fontSize: props.backFontSize,
        width: props.backWidth,
        borderRadius: props.backBorderRad,
        boxShadow: shadow,
        height: props.confHeight,
        maxHeight: confMaxHeight,
        padding: confPadding
      }}
    >
      <div
        className={classes.FirstText}
        style={{
          marginLeft: confMarginLeft2
        }}
      >
        <span className={classes.ActualText}>{props.totalFirstText}</span>
      </div>
      <div
        className={classes.SecondText}
        style={{
          marginLeft: props.confMarginLeft
            ? props.confMarginLeft
            : confMarginLeft
        }}
      >
        {props.totalSecondText}
      </div>
    </div>
  );
};

export default Totalizator;
