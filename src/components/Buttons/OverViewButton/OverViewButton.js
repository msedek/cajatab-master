import React from "react";

import classes from "./OverViewButton.scss";
import FaFileTextO from "react-icons/lib/fa/file-text-o";

const OverViewButton = props => (
  <div className={classes.Container}>
    <div className={classes.Button} onClick={props.overClicked}>
      <FaFileTextO />
    </div>
    <div className={classes.Wrapper} />
    <div className={classes.Text}>Resumen de Caja</div>
  </div>
)

export default OverViewButton;
