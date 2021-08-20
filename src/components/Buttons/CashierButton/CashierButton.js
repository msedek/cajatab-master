import React from 'react';

import classes from './CashierButton.scss';

const CashierButton = (props) => (
  <div className={classes.ButtonContainer}
    onClick={props.clicked}>
    <div className={classes.TopIcon}>
      <div className={classes.Rectangle}>
        <div className={classes.ActualRectangle} />
      </div>
      <div className={classes.Circle}>
        <div className={classes.Sticks}>
          <div className={classes.Stick1}>
            <div className={classes.Ball}></div>
            <div className={classes.Line}></div>
          </div>
          <div className={classes.Stick2}>
            <div className={classes.Ball2}></div>
            <div className={classes.Line2}></div>
          </div>
          <div className={classes.Stick3}>
            <div className={classes.Ball3}></div>
            <div className={classes.Line3}></div>
          </div>
        </div>
        <div className={classes.ActualCircle} />
      </div>
    </div>
    <div className={classes.BottomText}>
      <span>Arquear Caja</span>
    </div>
  </div>
);

export default CashierButton