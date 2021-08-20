import React from "react";

import classes from "./ProductManagerShape.scss";
import RadioList from "../RadioList/RadioList";

const ProductManagerShape = props => {
  let row = [];
  let trow = [];
  let name = "";
  let data = [];

  if (props.data.length > 0) {
    data = props.data;
    data.forEach((el, index) => {
      if (props.origen === "descuentos") {
        name = el.descuento;
      } else if (props.origen === "pagos") {
        name = el.pago;
      } else if (props.origen === "empleados") {
        name = el.contact_name
      }  else if (props.origen === "justificacion") {
        name = el.description
      } 
      
      else {
        name = "Mesa " + el.numeroMesa;
      }

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
                marginLeft: "1rem"
              }}
            >
              {name}
            </span>
          </td>
          <td style={{ background: confBackground }}>
            <RadioList
              data={el}
              origen={props.origen}
              confColor={"#5D5D5D"}
              confMarfinLeftBox={"-4.5rem"}
              confiHeight={"0.6rem"}
              onChangeHandlerRadios={props.onChangeHandler}
              // onClickSuppliesHandler={props.onClickSuppliesHandler}
            />
          </td>
        </tr>
      );
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
      <div className={classes.ListaCheck} style={{ height: props.confHeight }}>
        <table style={{ borderSpacing: "0" }}>
          <tbody>{row}</tbody>
        </table>
      </div>
    </div>
  );
};
export default ProductManagerShape;
