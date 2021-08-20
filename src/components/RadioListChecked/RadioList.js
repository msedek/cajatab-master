import React from "react";

import classes from "./RadioList.scss";

const RadioList = props => {

  let checkState = true;
  let stateName = "";

  Object.keys(props.state).forEach(function(element, key, _array) {
    // element is the name of the key.
    // key is just a numerical value for the array
    // _array is the array of all the keys
    if (element.includes(props.checkName)) {
      checkState = props.state[Object.keys(props.state)[key]];
      stateName = element;
    }
  });

  return (
    <div className={classes.Container}>
      <input
        onChange={e =>
          props.checkBoxLinkedMesa(
            e,
            props.data,
            checkState,
            stateName,
            props.master,
            props.unLinkAble
          )
        }
        style={{
          marginLeft: props.confMarfinLeftBox,
          height: props.confiHeight,
          marginBottom: "0.2rem"
        }}
        type="checkbox"
        name={props.checkName}
        checked={checkState}
      />
    </div>
  );
};

export default RadioList;
