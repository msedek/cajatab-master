import React from "react";

import classes from './InventoryTwoHeader.scss';

const InventoryTwoHeader = (props) => {
  return (
    <div className={classes.Container} >
      <div className={classes.ZoneDescription} >
        <span className={classes.Text}>Descripción</span>
      </div>
      <div className={classes.ZoneUn} >
        <span className={classes.Text}>Un</span>
      </div>
      <div className={classes.ZoneInventorySystem} >
        <span className={classes.Text}>Inv. en sistema</span>
      </div>
      <div className={classes.ZoneYesNo} >
        <div className={classes.Text1} >¿Coinciden ambas?</div>
        <div className={classes.ZoneText}>
          <div className={classes.Yes}>Si</div>
          <div className={classes.No}>No</div>
        </div>
      </div>
      <div className={classes.ZonePhysicalInventory} >
        <span className={classes.Text}>Inv. Físico</span>
      </div>
      <div className={classes.ZoneObservation} >
        <span className={classes.Text}>Observaciones</span>
      </div>
    </div>
  );
}

export default InventoryTwoHeader