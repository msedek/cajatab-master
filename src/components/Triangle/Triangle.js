import React from 'react';

import classes from './Triangle.scss';

const Triangle = (props) => {

  let confAlign = props.textTriangle;
  let shortAlign = '1rem';

  if (confAlign.length <= 6) {
    shortAlign = '2rem'
  }

  return (
    <div
      className={classes.ParentTab}
      onClick={() => props.tabBed(props.name)}>
      <div
        className={classes.LabelTriangle}
        style={{
          background: props.backTriangleBig,
          paddingLeft:shortAlign
        }}>
        <span>
          {props.textTriangle}
        </span>
    </div>
    </div >
  );
}

export default Triangle