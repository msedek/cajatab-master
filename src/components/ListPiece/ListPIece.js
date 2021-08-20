import React from "react";

import classes from "./ListPiece.scss";

const ListPiece = props => {
  let text = "LIST";
  if (props.listText) {
    text = props.listText;
  }

  return (
    <div
      className={classes.Container}
      style={{
        background: props.listBackground,
        color: props.listTextColor,
        borderTopLeftRadius: props.listTLradius,
        borderTopRightRadius: props.listTRradius,
        width: props.listPieceWidt
      }}
    >
      {text}
    </div>
  );
};

export default ListPiece;
