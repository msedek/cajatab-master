import React from "react";

import classes from "./Modal.scss";
import BackDrop from "../BackDrop/BackDrop";

const modal = props => (
  <React.Fragment>
    <BackDrop show={props.show} clickOnBackDrop={props.clickOnBackDrop} />
    <div
      className={classes.Modal}
      style={{
        transform: props.show ? `translateY(0)` : "translateY(-1000px)",
        opacity: props.show ? "1" : "0",
        top: props.top,
        left: props.left
      }}
    >
      {props.children}
    </div>
  </React.Fragment>
);

export default modal;
