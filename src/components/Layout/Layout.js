import React from "react";

import classes from "./Layout.scss";
import TopBar from "../../containers/TopBar/TopBar";

const layout = props => (
  <div className={classes.MainContainer}>
    <div className={classes.div__back}>
      <div className={classes.TopBar}>
        <TopBar />
      </div>
      <div className={classes.Card}>
        <main>{props.children}</main>
      </div>
    </div>
  </div>
);

export default layout;