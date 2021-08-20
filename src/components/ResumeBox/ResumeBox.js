import React from 'react';

import classes from './ResumeBox.scss'
import MultiButton from '../Buttons/MultiButton/MultiButton';

const ResumeBox = (props) => (
  <div className={classes.Container}>
    <div className={classes.Title}>
      <MultiButton
        textMultiButton={props.title}
        multiBackColor={'#9EC446'}
        multiWidth={'100%'}
        multiBorderRad={'200px'}
        multiFont={'1rem'}
        clicked={this.clickHandler} />
    </div>
    <div className={classes.Content}>
      {props.data}
    </div>
    <div className={classes.Footer}>
      <div className={classes.FooterTotal}>
        <span>{'TOTAL ' + props.title}</span>
      </div>
      <div className={classes.FooterMoney}>
        <span>{'S/' + props.footerMoney}</span>
      </div>
    </div>
  </div>
)

export default ResumeBox