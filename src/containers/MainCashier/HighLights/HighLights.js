import React from "react";

import classes from "./HighLights.scss";
import HighLight from "../../../components/HighLight/HighLight";

const HighLights = props => {
  let tableOcupada = [];
  let tableReservada = [];
  let tableCobrar = [];
  let tablePagar = [];

  return (
    <div className={classes.Container}>
      <div
      // onMouseDown={() => {
      //   props.hoveredFree(true);
      // }}
      // onMouseUp={() => {
      //   props.hoveredFree(false);
      // }}
      >
        <HighLight
          className={classes.Libre}
          backCircle={
            "linear-gradient(45deg, rgba(195,218,233,1) 0%, rgba(134,133,138,1) 100%)"
          }
          backSmallCircle={"#B0BAC4"}
          backBorder={"#D8D8DC"}
        />
      </div>
      <div
      // onMouseDown={() => {
      //   props.hoveredOcupada(true);
      // }}
      // onMouseUp={() => {
      //   props.hoveredOcupada(false);
      // }}
      >
        <HighLight
          className={classes.Ocupada}
          backCircle={
            "linear-gradient(135deg, rgba(255,175,75,1) 0%, rgba(255,183,1,1) 100%)"
          }
          backSmallCircle={"#FAE100"}
          backBorder={"#FCDB00"}
          tableLibre={tableOcupada}
        />
      </div>
      <div
      // onMouseDown={() => {
      //   props.hoveredReservada(true);
      // }}
      // onMouseUp={() => {
      //   props.hoveredReservada(false);
      // }}
      >
        <HighLight
          className={classes.Reservada}
          backCircle={
            "linear-gradient(45deg, rgba(239,197,202,1) 0%, rgba(210,75,90,1) 1%, rgba(186,39,55,1) 51%, rgba(153,19,44,1) 100%)"
          }
          backSmallCircle={"#E70050"}
          backBorder={"#971E3A"}
          tableLibre={tableReservada}
        />
      </div>
      <div
      // onMouseDown={() => {
      //   props.hoveredCobrar(true);
      // }}
      // onMouseUp={() => {
      //   props.hoveredCobrar(false);
      // }}
      >
        <HighLight
          className={classes.Cobrar}
          backCircle={
            "linear-gradient(to right, rgba(98,125,77,1) 0%, rgba(73,95,23,1) 100%)"
          }
          backSmallCircle={"#617F1F"}
          backBorder={"#7FA327"}
          tableLibre={tableCobrar}
        />
      </div>
      <div
      // onMouseDown={() => {
      //   props.hoveredPagar(true);
      // }}
      // onMouseUp={() => {
      //   props.hoveredPagar(false);
      // }}
      >
        <HighLight
          className={classes.Pagar}
          backCircle={
            "linear-gradient(to right, rgba(73,155,234,1) 0%, rgba(38,94,168,1) 100%)"
          }
          backSmallCircle={"#00A0F6"}
          backBorder={"#0091C4"}
          tableLibre={tablePagar}
        />
      </div>
      <div
      // onMouseDown={() => {
      //   props.hoveredPagar(true);
      // }}
      // onMouseUp={() => {
      //   props.hoveredPagar(false);
      // }}
      >
        <HighLight
          className={classes.Unir}
          backCircle={
            "linear-gradient(to right, rgba(255,93,177,1) 0%, rgba(165,20,130,1) 100%)"
          }
          backSmallCircle={"#A51482"}
          backBorder={"#A51482"}
          tableLibre={tablePagar}
        />
      </div>
      <div className={classes.TextLibre}>Libre</div>
      <div className={classes.TextOcupada}>Ocupada</div>
      <div className={classes.TextReservada}>Reservada</div>
      <div className={classes.TextCobrar}>Por Cobrar</div>
      <div className={classes.TextPagar}>Por Pagar</div>
      <div className={classes.TextUnidas}>Unidas</div>
    </div>
  );
};

export default HighLights;
