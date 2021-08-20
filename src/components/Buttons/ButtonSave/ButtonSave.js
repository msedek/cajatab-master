import React from "react";

import classes from "./ButtonSave.scss";

const ButtonSave = props => {
  return (
    <div
      className={classes.BtnSave}
      onClick={()=>props.clicked(props.from)}
      style={{
        gridTemplateRows: props.confGridRows
          ? props.confGridRows
          : "50% 18% 1fr"
      }}
    >
      <div
        className={classes.IconSave}
        style={{
          paddingTop: props.confPaddingTop ? props.confPaddingTop : "0.3rem",
          marginLeft: props.confMarginLeftIcon
            ? props.confMarginLeftIcon
            : "0.6rem"
        }}
      >
        <span className="fas fa-sign-in-alt" />
      </div>
      <div className={classes.Text}>
        <span
          className={classes.RealText}
          style={{
            marginLeft: props.confMarginLeftText
              ? props.confMarginLeftText
              : "0rem",
            marginTop: props.confMarginTopText
              ? props.confMarginTopText
              : "0rem"
          }}
        >
          {props.action}
        </span>
      </div>
    </div>
  );
};

export default ButtonSave;
