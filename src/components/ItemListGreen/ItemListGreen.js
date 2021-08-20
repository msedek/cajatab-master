import React from "react";

import classes from "./ItemListGreen.scss";

const ItemListGreen = props => {
  let checkState = true;
  let stateName = "";

  Object.keys(props.state).forEach(function(element, key, _array) {
    if (element.includes(props.checkName)) {
      checkState = props.state[Object.keys(props.state)[key]];
      stateName = element;
    }
  });

  return (
    <div
      style={{
        marginBottom: props.confMarginBottom
      }}
    >
      <input
        className={classes.CheckBoxGreen}
        type={props.type}
        id={props.keys}
        value={props.label}
        onChange={e =>
          props.configOptionsHandler(
            e,
            props.data,
            stateName,
            checkState,
            props.LabelFirst
          )
        }
        checked={
          props.type !== "radio" ? checkState : props.checkName === props.label
        }
      />
      <label
        htmlFor={props.checkName}
        style={{
          marginLeft: props.confMarginLeft,
          fontSize: props.confSize,
          fontWeight: props.confWeight,
          color: props.confColor
        }}
      >
        {props.TextLabel}
      </label>
    </div>
  );
};

export default ItemListGreen;
