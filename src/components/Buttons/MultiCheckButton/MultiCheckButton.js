import React from 'react';

import classes from './MultiCheckButton.scss'
import FaFileTextO from 'react-icons/lib/fa/file-text-o';
import FaFileText from 'react-icons/lib/fa/file-text';

const MultiCheckButton = (props) => (
    <div className={classes.Container}>
        <div
            className={classes.Button}
            onClick={props.multiClicked} >
            <div className={classes.file1}>
                <div className={classes.f11}>
                    <FaFileTextO />
                </div>
                <div className={classes.f12}>
                    <FaFileText />
                </div>
            </div>
            <div className={classes.file2}>
            <div className={classes.f21}>
                    <FaFileTextO />
                </div>
                <div className={classes.f22}>
                    <FaFileText />
                </div>
            </div>
        </div>
        <div className={classes.Text}>Cuentas Separadas</div>
    </div>
);

export default MultiCheckButton