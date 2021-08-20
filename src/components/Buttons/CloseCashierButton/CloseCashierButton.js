import React from 'react';

import classes from './CloseCashierButton.scss'
import FaClose from 'react-icons/lib/fa/close';

const CloseCashierButton = (props) => (

  <div className={classes.Container}
    onClick={props.clicked}>
    <div className={classes.Button}>
      <FaClose />
    </div>
    <div className={classes.Text}>Cierre Parcial de Caja</div>
  </div>
);

export default CloseCashierButton