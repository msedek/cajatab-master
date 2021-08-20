import React from "react";

import classes from "./HeaderTitleProduct.scss";

const HeaderTitleProduct = props => {
  return (
    <div
      className={classes.ZoneTitle}
      style={{
        gridTemplateColumns: "4.5% 1fr 4.2%",
        gridTemplateRows: "45% 1fr",
        fontSize: "1rem"
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
};

export default HeaderTitleProduct;
