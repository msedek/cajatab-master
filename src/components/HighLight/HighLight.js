import React from 'react';

import classes from './HighLight.scss'

const HighLight = (props) => (
    <div
        className={classes.Container}>
        <div
            className={classes.Circle}
            style={{
                background: props.backCircle
            }} >
            <div
                className={classes.SmallCircle}
                style={{
                    background: props.backSmallCircle,
                    border: '1px solid ' + props.backBorder
                }} />
        </div>
    </div>
);

export default HighLight