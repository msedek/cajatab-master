import React from "react";

import classes from './HeaderStatistics.scss';

const HeaderStatistics = (props) => {
  return (
    <div className={classes.ContainerHeaderStatistics} >
      <div className={classes.ZoneHoursWorked} >
        <div className={classes.RealTextHoursWorked}>
          <div className={classes.Text} >Horas trabajadas</div>
        </div>
      </div>
      <div className={classes.ZoneTablesServed} >
        <div className={classes.Text} >Mesas atendidas</div>
      </div>
      <div className={classes.ZoneSales} >
        <div className={classes.Text} >Ventas (S/.)</div>
      </div>
      <div className={classes.ZoneSalesHours} >
        <div className={classes.Text} >Ventas por horas (S/.)</div>
      </div>
    </div>
  );
}

export default HeaderStatistics