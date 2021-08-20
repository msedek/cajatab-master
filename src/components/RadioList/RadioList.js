import React from "react";

import classes from "./RadioList.scss";

const RadioList = props => {
  let data = props.name;

  if (
    props.origen === "descuentos" ||
    props.origen === "pagos" ||
    props.origen === "empleados" ||
    props.origen === "justificacion" ||
    props.origen === "mesas"
  ) {
    data = props.data;
  }

  return (
    <div className={classes.Container}>
      <input
        onChange={() => props.onChangeHandlerRadios(data)}
        style={{
          marginLeft: props.confMarfinLeftBox,
          marginTop: props.confMarginTopBox,
          marginRight: props.confMarginRightBox,
          height: props.confiHeight,
          marginBottom: props.ConfmarginBottomBox,
          paddingTop: props.confiPaddingTopBox,
          paddingBottom: props.confiPaddingBottomBox
        }}
        type="radio"
        name="radio-group"
        checked={props.type}
      />
    </div>
  );
};

export default RadioList;
