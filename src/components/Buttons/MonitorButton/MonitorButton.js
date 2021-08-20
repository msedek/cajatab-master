import React from 'react';

import classes from './MonitorButton.scss'
import MdViewCarousel from 'react-icons/lib/md/view-carousel';

const MonitorButton = (props) => (
    <div className={classes.Container}>
        <div
            className={classes.Button}
            onClick={() => props.backHandler()} >
            <MdViewCarousel />
        </div>
        <div className={classes.Text}>Monitoreo de Mesas</div>
    </div>
);

export default MonitorButton