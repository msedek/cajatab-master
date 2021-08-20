import React from "react";

import classes from "./OpenFound.scss";
// import Radiolist from "../RadioList/RadioList";
// import Radiolist2 from "../RadioList/RadioList";
// import ComboBox from "../ComboBoxSquare/ComboBox";

const OpenFound = props => {
  return (
    <div className={classes.Container}>
      {/* <div className={classes.ZoneData}>
        <div className={classes.Buttons}>
          <div className={classes.RadioCoin}>
            <Radiolist
              type={props.coin}
              name="coin"
              onChangeHandlerRadios={props.onChangeHandlerRadios}
            />
            <span className={classes.Text}>Monedas</span>
          </div>
          <div className={classes.RadioBill}>
            <Radiolist2
              type={props.bill}
              name="bill"
              onChangeHandlerRadios={props.onChangeHandlerRadios}
            />
            <span className={classes.Text}>Billetes</span>
          </div>
        </div>
      </div> */}
      <div className={classes.ZoneList}>
        {/* <ComboBox
          origen={"configFound"}
          comboFondo={props.comboFondo}
          comboSelection={props.comboSelection}
          tipoMoneda={props.dataFondo}
          hidden={props.coin ? "SELECCIONE MONEDAS" : "SELECCIONE BILLETES"}
        /> */}
        <div className={classes.Data}>
          <input
            style={{ paddingLeft: "5px" }}
            className={classes.TextBox33}
            type="number"
            name="mesa"
            id="mesa"
            placeholder={"Monto apertura"}
            value={props.cantMoneda}
            onChange={e => props.cantMonedaHandler(e)}
          />
          <div className={classes.LinkButton}>
            <i
              className="fas fa-plus-square"
              onClick={() => props.actionHandler("calcular")}
            />
            <span className={classes.Text}>Agregar</span>
          </div>
        </div>
        <div className={classes.FondoTotal}>
          <span className={classes.Text}>{`S/ ${props.totalFondo.toFixed(
            2
          )}`}</span>
        </div>
      </div>

      <div className={classes.ZoneTotals}>
        <div className={classes.LinkButton}>
          <i
            className="far fa-money-bill-alt"
            onClick={() => props.actionHandler("abrir caja")}
          />
          <span className={classes.Text}>Abrir Caja</span>
        </div>
        <div className={classes.UnLinkButton}>
          <i
            className="fas fa-undo-alt"
            onClick={() => props.actionHandler("cancelar")}
          />
          <span className={classes.Text}>Cancelar</span>
        </div>
      </div>
    </div>
  );
};

export default OpenFound;
