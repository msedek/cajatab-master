import React from "react";

import classes from "./ItemList.scss";

const ItemList = props => {
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
    <div
      style={{
        marginBottom: props.confMarginBottom
      }}
    >
      <input
        onChange={e => props.removeOrderHandler(e, props.item, stateName)}
        className={classes.CheckBox}
        type="checkbox"
        checked={checkState}
      />
      <label
        htmlFor="checkbox_id"
        style={{
          marginLeft: props.confMarginLeft,
          fontSize: props.confSize,
          fontWeight: props.confWeight,
          color: props.confColor
        }}
      >
        {props.TextLabel ? props.TextLabel : "Lorem Ipsum Lorem Ipsum"}
      </label>
    </div>
  );
};

export default ItemList;
