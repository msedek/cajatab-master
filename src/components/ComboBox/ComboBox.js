import React from 'react';

import classes from './ComboBox.scss';
import FaCaretDown from 'react-icons/lib/fa/caret-down';

const ComboBox = (props) => {

  let cData = [
    <option key={0} hidden >10/10/2017</option>,
    <option key={1}></option>,
    <option key={2}></option>
  ]

  if (props.comboData) {
    cData = props.comboData;
  }

  return (
    <div className={classes.ComboContainer}>
      <select
        className={classes.ComboCash}
        style={{
          height: props.comboHeight,
          width: props.comboWidth,
          background: props.comboBack,
          backgroundPositionX: props.backPos,
          fontSize: props.confFontSize
        }}>
        {cData}
      </select>
      <div
        className={classes.Arrow}
        style={{
          fontSize: props.confArrowSize,
          marginRight: props.confMarginRight,
          marginBottom: props.confMarginBottom
        }}><FaCaretDown /></div>
    </div>
  );
}

export default ComboBox;
// comboData = { this.state.comboData }
