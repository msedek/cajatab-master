import React from 'react';

import MultiCheckButton from '../../../components/Buttons/MultiCheckButton/MultiCheckButton';
import SingleCheckButton from '../../../components/Buttons/SingleCheckButton/SingleCheckButton';
import classes from './SelectorButtons.scss';

const SelectorButtons = (props) => {

    return <div className={classes.Container}>
        <div className={classes.MultiCh}>
            <MultiCheckButton
                multiClicked={props.multiClicked} />
        </div>
        <div className={classes.SingleCh}>
            <SingleCheckButton
                singleClicked={props.singleClicked} />
        </div>
    </div>
}

export default SelectorButtons