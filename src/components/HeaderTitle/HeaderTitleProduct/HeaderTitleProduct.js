import React from "react";

import classes from "./HeaderTitleProduct.scss";

const HeaderTitleProduct = props => (
  <div
    className={classes.ZoneTitle}
    style={{
      gridTemplateColumns: props.confGridColumns
        ? props.confGridColumns
        : "4.5% 1fr 4.2%",
      gridTemplateRows: props.confGridRow ? props.confGridRow : "45% 1fr",
      fontSize: props.confFontSize ? props.confFontSize : "1.35rem"
    }}
  >
    <div className={classes.HeaderContaier}>
      <div className={classes.ItemName}>
        <span className={classes.RealName}>
          {props.spanText ? props.spanText : "Nombre del Item"}
        </span>
      </div>
      <div className={classes.Select}>
        <span className={classes.RealSelect}>Seleccionar</span>
      </div>
    </div>
  </div>
);

export default HeaderTitleProduct;
