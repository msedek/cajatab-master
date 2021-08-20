import React from "react";

import classes from "./InventoryHeader.scss";

const InventoryHeader = props => {
  return (
    <div className={classes.ContaineInventoryHeader}>
      <div className={classes.ZonaDescription}>
        <span className={classes.Text}>Descripcion</span>
      </div>
      <div className={classes.ZonaCrit1}>
        <span className={classes.Text}>Crit</span>
      </div>
      <div className={classes.ZonaMin1}>
        <span className={classes.Text}>Min</span>
      </div>
      <div className={classes.ZonaMax}>
        <span className={classes.Text}>Max</span>
      </div>
      <div className={classes.ZonaUn}>
        <span className={classes.Text}>Un</span>
      </div>
      <div className={classes.ZonaInventory}>
        <span className={classes.Text}>Inv</span>
      </div>
      <div className={classes.ZonaZero}>
        <span className={classes.Text}>0</span>
      </div>
      <div className={classes.ZonaCrit2}>
        <span className={classes.Text}>Crit</span>
      </div>
      <div className={classes.ZonaMin2}>
        <span className={classes.Text}>Min</span>
      </div>
      <div className={classes.ZonaOpt}>
        <span className={classes.Text}>Max</span>
      </div>
      <div className={classes.ZonaObservation}>
        <span className={classes.Text}>Observaciones</span>
      </div>
    </div>
  );
};

export default InventoryHeader;
