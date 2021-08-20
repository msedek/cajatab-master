import React, { Component } from "react";
import { connect } from "react-redux";
import Clock from "react-live-clock";

import classes from "./TopBar.scss";

class TopBar extends Component {
  render() {
    return (
      <div
        className={classes.TopBarContainer}
        style={{
          visibility: this.props.topBarState.topBarVisibility
        }}
      >
        <div className={classes.LeftHeaferContainer}>
          <span className={classes.FirstTitle}>
            {this.props.topBarState.firstTitle}
          </span>
          <span className={classes.FirstData}>
            {this.props.topBarState.firstData}
          </span>
          <span className={classes.SecondTitle}>
            {this.props.topBarState.secondTitle}
          </span>
          <span className={classes.SecondData}>
            {this.props.topBarState.secondData}
          </span>
          <span className={classes.ThirdTitle}>
            {this.props.topBarState.thirdTitle}
          </span>
          <span className={classes.ThirdData}>
            {this.props.topBarState.thirdData}
          </span>
        </div>
        <div className={classes.RightHeaderContainer}>
          <div className={classes.TopContainer}>
            <span className={classes.FirstTop}>
              {this.props.topBarState.firstTop}
            </span>
            <span className={classes.SecondTop}>
              {this.props.topBarState.secondTop}
            </span>
          </div>
          <div className={classes.BottomContainer}>
            <span
              className={classes.FirstBottom}
              style={{
                textAlign: this.props.topBarState.textAlignFirstBottom
              }}
            >
              <Clock format={"L"} timezone={"America/Lima"} />
            </span>
            <span
              className={classes.SecondBottom}
              style={{
                fontSize: this.props.topBarState.fontSizeSecondBottom
                  ? this.props.topBarState.fontSizeSecondBottom
                  : "1.3rem",
                fontWeight: this.props.topBarState.fontWeightSecondBottom
                  ? this.props.topBarState.fontWeightSecondBottom
                  : "bold"
              }}
            >
              <Clock
                format={"HH:mm:ss"}
                ticking={true}
                timezone={"America/Lima"}
              />
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    topBarState: state.topBarState
  };
};

export default connect(mapStateToProps)(TopBar);
