import React from 'react';

import classes from './SingleCheckButton.scss'
import FaFileTextO from 'react-icons/lib/fa/file-text-o';
import FaFileText from 'react-icons/lib/fa/file-text';

const SingleCheckButton = (props) => (
    <div className={classes.Container}>
        <div
            className={classes.Button}
            onClick={props.singleClicked} >
            <div className={classes.file2}>
            <div className={classes.f21}>
                    <FaFileTextO />
                </div>
                <div className={classes.f22}>
                    <FaFileText />
                </div>
            </div>
        </div>
        <div className={classes.Text}>Cuenta Completa</div>
    </div>
);

export default SingleCheckButton






            // onClick={props.singleClicked}
