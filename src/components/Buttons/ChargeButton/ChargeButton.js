import React from "react";

import classes from "./ChargeButton.scss";
import FaCreditCardAlt from "react-icons/lib/fa/credit-card-alt";

const ChargeButton = props => (
  <div className={classes.Container}>
    <div
      tabIndex={props.tIndex}
      className={classes.Button}
      onClick={props.execute}
      onKeyPress={props.kPress}
    >
      <FaCreditCardAlt />
    </div>
    <div className={classes.Text}>Cobrar</div>
  </div>
);

export default ChargeButton;
