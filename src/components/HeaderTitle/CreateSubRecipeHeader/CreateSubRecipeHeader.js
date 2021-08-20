import React from "react";

import classes from "./CreateSubRecipeHeader.scss";

const CreateSubRecipeHeader = props => (
  <div className={classes.Containe}>
    <div className={classes.HeaderContaier}>
      <div className={classes.ItemName}>
        <span className={classes.RealItemName}>Nombre del Item</span>
      </div>
      <div className={classes.Quantity}>Cantidad</div>
      <div className={classes.Unity}>Unidad</div>
      <div className={classes.Date}>Feche</div>
      <div className={classes.Select}>Seleccionar</div>
    </div>
  </div>
);
export default CreateSubRecipeHeader;
