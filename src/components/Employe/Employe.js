import React from 'react';

import classes from './Employe.scss';
import FaUser from 'react-icons/lib/fa/user';

const Employe = (props) => (
    <div
        className={classes.Container}
        onClick={() => props.empClicked(props.nameMesero)} >
        <div className={classes.BigCircle}>
            <div className={classes.SmallCircle}>
                <FaUser style={{
                    'color': '#5D5D5D'
                }} />
            </div>
        </div>
        <div className={classes.Name}>
            {props.nameMesero}
        </div>
    </div>
);

export default Employe