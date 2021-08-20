import React from "react";

import classes from "./CatalogShape.scss";

const CatalogShape = props => {
  return (
    <div className={classes.ShapeContainer}>
      <div className={classes.ExoCircle}>
        <img
          className={classes.InnerCircle}
          onClick={() => props.clicked(props.data)}
          src={`./../assets/ownCloud/${props.itemImage}`}
          style={{
            objectFit: "fill"
            // objectFit: "contain",
            // objectFit: "cover",
            // objectFit: "scale-down",
          }}
          alt=""
        />
      </div>
      <div className={classes.CatalogText}>
        <span>
          {props.itemName ? props.itemName : "LorenIpsum a la LoremIpsun"}
        </span>
      </div>
    </div>
  );
};

export default CatalogShape;
