import React, { Component } from "react";

import classes from "./SingleCheck.scss";
import Totalizator from "../../../components/Totalizator/Totalizator";

class SingleCheck extends Component {
  refRuc = React.createRef();

  componentDidMount() {
    this.refRuc.focus();
  }

  render() {
    return (
      <div className={classes.Container}>
        <div className={classes.Totals}>
          <div className={classes.RucContainer}>
            <div className={classes.Ruc}>
              <div className={classes.Label}>{this.props.tipoId}</div>
            </div>
            <input
              ref={input => {
                this.refRuc = input;
              }}
              tabIndex={1}
              className={classes.NumRuc}
              type="number"
              name="clientId"
              onChange={e => this.props.textHandler(e)}
              value={this.props.clientId}
            />
            <button
              className={classes.BuscarRuc}
              onClick={this.props.buscarRucHandler}
            >
              BUSCAR
            </button>
          </div>
          <div className={classes.NameContainer}>
            <div className={classes.Name}>
              <div className={classes.LabelName}>NOMBRE</div>
            </div>
            <input
              tabIndex={2}
              className={classes.ActualName}
              type="text"
              name="nombre"
              onChange={e => this.props.textHandler(e)}
              value={this.props.nombre}
            />
          </div>
          <div className={classes.DirectionContainer}>
            <div className={classes.Dir}>
              <div className={classes.LabelDir}>DIRECCION</div>
            </div>
            <input
              tabIndex={3}
              className={classes.ActualDir}
              type="text"
              name="direccion"
              onChange={e => this.props.textHandler(e)}
              value={this.props.direccion}
            />
          </div>
          <div className={classes.emailContainer}>
            <div className={classes.mail}>
              <div className={classes.LabelMail}>E-MAIL</div>
            </div>
            <input
              tabIndex={4}
              className={classes.email}
              type="email"
              placeholder="alejandra@ejemplo.com"
              name="correo"
              onChange={e => this.props.textHandler(e)}
              value={this.props.correo}
            />
          </div>
          <div className={classes.preCuentaContainer}>
            <Totalizator
              backTotal={"#485923"}
              backColor={"#F3F3F5"}
              backWidth={"300px"}
              backFontSize={"1.1rem"}
              backBorderRad={"15px"}
              totalFirstText={"CUENTA S/IGV"}
              totalSecondText={"S/ " + this.props.total}
              bShadow={"0 4px 8px -2px #888"}
            />
          </div>
        </div>
        <div className={classes.Radios}>
          <label className={classes.Factura} htmlFor="factura">
            FACTURA
          </label>
          <input
            checked={this.props.facturaState}
            onChange={e => this.props.singleRadioChangeHandler(e)}
            className={classes.FactStyle}
            type="radio"
            name="Factura"
            id="factura"
          />
          <label className={classes.Boleta} htmlFor="boleta">
            BOLETA
          </label>
          <input
            checked={this.props.boletaState}
            onChange={e => this.props.singleRadioChangeHandler(e)}
            className={classes.BolStyle}
            type="radio"
            name="Boleta"
            id="boleta"
          />
        </div>
      </div>
    );
  }
}

export default SingleCheck;
