import React from "react";
import _ from "underscore";

import classes from "./ProductManagerShape.scss";
import RadioList from "../RadioListChecked/RadioList";

const ProductManagerShape = props => {
  let row = [];
  let trow = [];
  let name = "";
  let data = [];

  if (props.data.length > 0) {
    data = _.sortBy(props.data, function(tab) {
      return tab.numeroMesa;
    });

    data.forEach((el, index) => {
      let nonMaster = !props.nMesa.tableNumber.includes(el.numeroMesa);
      let isSlave = el.master === props.master.master;
      let isLibre = el.estado.toLowerCase() === "libre";
      let isOcupado = el.estado.toLowerCase() === "ocupada";

      if ((isLibre || isOcupado || isSlave) && nonMaster) {
        name = "Mesa " + el.numeroMesa;

        let parity = index % 2;
        let confBackground = "#DADEE9";
        if (parity === 1) {
          confBackground = "#F3F3F5";
        }
        trow.push(
          <tr key={index} style={{ height: "1.69rem" }}>
            <td style={{ width: "26.95rem", background: confBackground }}>
              <span
                style={{
                  display: "grid",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  color: "#5D5D5D",
                  marginLeft: "2.8rem"
                }}
              >
                {name}
              </span>
            </td>
            <td style={{ background: confBackground }}>
              <RadioList
                data={el}
                confMarfinLeftBox={"-3.5rem"}
                confiHeight={"0.6rem"}
                checkBoxLinkedMesa={props.checkBoxLinkedMesa}
                checkName={el.numeroMesa}
                state={props.state}
                nMesa={props.nMesa}
                master={props.master}
                unLinkAble={props.unLinkAble}
              />
            </td>
          </tr>
        );
      }
    });
  }
  row.push(trow);
  return (
    <div
      className={classes.ContainerList}
      style={{
        gridTemplateColumns: props.confGridColumns
          ? props.confGridColumns
          : "4.5% 1fr 5.4%"
      }}
    >
      <div className={classes.ListaCheck} style={{ height: "270px" }}>
        <table style={{ borderSpacing: "0" }}>
          <tbody>{row}</tbody>
        </table>
      </div>
    </div>
  );
};
export default ProductManagerShape;
