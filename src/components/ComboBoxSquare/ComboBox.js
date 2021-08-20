import React from "react";

import classes from "./ComboBox.scss";
import FaCaretDown from "react-icons/lib/fa/caret-down";

const ComboBox = props => {
  let options = [];
  let row = [];
  let handler;
  let filter = [];
  let hidden = "";
  let disable = props.disabled ? props.disabled : null;

  if (props.origen === "mixto") {
    handler = props.onClickComboHandler2;
    for (let i = 0; i < props.text.length; i++) {
      const element = props.text[i].pago;
      if (element !== "Mixto") {
        filter.push(props.text[i]);
      }
    }
  } else if (props.origen === "changeMesa" || props.origen === "moveItem") {
    handler = props.checkBoxChangeMesa;
    if (props.origen === "moveItem") {
      filter = props.cantMesas.filter(mesa => mesa.estado !== "Slave");
    } else {
      filter = props.cantMesas.filter(mesa => {
        if (mesa.estado === "Master" || mesa.estado === "Slave") {
          return false;
        }
        return true;
      });
    }
  } else if (props.origen === "configFound") {
    handler = props.comboFondo;
    filter = props.tipoMoneda;
  } else {
    handler = props.onClickComboHandler;
    filter = props.text;
  }

  if (props.origen === "descuentos") {
    hidden = "DESCUENTOS";
  } else if (props.origen === "changeMesa" || props.origen === "moveItem") {
    hidden = "MESA DESTINO";
  } else if (props.origen === "configFound") {
    hidden = props.hidden;
  } else {
    hidden = props.hidden;
  }

  filter.forEach((element, index) => {
    if (props.origen === "descuentos") {
      if (index === 0) {
        row.push(<option key={index + filter.length}>{hidden}</option>);
      }
      row.push(
        <option key={index}>
          {element.descuento.toUpperCase() +
            " " +
            element.porcentaje +
            "% " +
            element.maximo +
            " S./ Max."}
        </option>
      );
    } else if (props.origen === "changeMesa" || props.origen === "moveItem") {
      if (props.nMesa.tableNumber !== element.numeroMesa) {
        row.push(
          <option key={index}>{"Cambiar a mesa " + element.numeroMesa}</option>
        );
      }
    } else if (props.origen === "configFound") {
      row.push(<option key={index}>{element}</option>);
    } else {
      row.push(<option key={index}>{element.pago.toUpperCase()}</option>);
    }
  });
  options.push(row);
  return (
    <div
      className={classes.ComboContainer}
      style={{
        border: `${props.confBorder} solid red`
      }}
    >
      <select
        disabled={disable}
        value={props.comboSelection}
        className={classes.ComboCash}
        onChange={ev => handler(ev, filter, props.origen)}
      >
        <option hidden>{hidden}</option>
        {options}
      </select>
      <div className={classes.Arrow}>
        <FaCaretDown />
      </div>
    </div>
  );
};

export default ComboBox;
