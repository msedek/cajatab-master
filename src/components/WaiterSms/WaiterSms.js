import React, { Component } from "react";

import classes from "./WaiterSms.scss";
import MultiButton from "../Buttons/MultiButton/MultiButton";

class WaiterSms extends Component {
  state = {
    textCounter: 0,
    sms: ""
  };

  enterHandler = e => {
    if (e.charCode === 13) {
      if (this.state.sms === "") {
        alert("Coloque el mensaje!");
      } else {
        this.props.smsSent(this.state.sms, this.props.Receiver);
        this.setState({
          sms: ""
        });
      }
    } else {
      this.counterHandler(e);
    }
  };

  counterHandler = e => {
    let textCount = e.currentTarget.value.length;
    if (textCount <= 30) {
      this.setState({ textCounter: textCount, sms: e.currentTarget.value });
    } else {
      alert("Supero los 30 Caracteres");
    }
  };

  render() {
    return (
      <div action="sendSms" className={classes.SmsContainer}>
        <div classes={classes.TitleContainer}>
          {"Mensage a: " +
            (this.props.Receiver ? this.props.Receiver.vendor_name : "Mesero")}
        </div>
        <div className={classes.TextAreaContainer}>
          <input
            name="Text1"
            cols="20"
            rows="2"
            value={this.state.sms}
            onKeyPress={e => this.enterHandler(e)}
            placeholder="Escriba Mensaje"
            onChange={this.counterHandler}
          />
        </div>
        <div className={classes.ButtonContainer}>
          <MultiButton
            multiBackColor={"#9EC446"}
            multiWidth={"5rem"}
            multiBorderRad={"25px"}
            multiFont={"1.1rem"}
            clicked={() => {
              this.props.smsSent(this.state.sms, this.props.Receiver);
              this.setState({
                sms: ""
              });
            }}
            textMultiButton={"ENVIAR"}
          />
        </div>
        <div>
          <span>
            {"Caracteres restantes: " + (30 - this.state.textCounter)}
          </span>
        </div>
      </div>
    );
  }
}

export default WaiterSms;
