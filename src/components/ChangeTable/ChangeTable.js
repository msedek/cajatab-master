import React from "react";
import _ from "underscore";
import classes from "./ChangeTable.scss";
import MultiButton from "../Buttons/MultiButton/MultiButton";

import ComboBox from "../ComboBoxSquare/ComboBox";

const ChangeTable = props => {
  let tables = _.sortBy(props.cantMesas, function(tab) {
    return tab.numeroMesa;
  });

  let handler;
  let txtButt = "ELIMINAR";

  if (
    props.origen === "moveItem" ||
    props.origen === "deleteItem" ||
    props.origen === "emNote"
  ) {
    if (props.origen === "moveItem") handler = props.itemChangedHandler;
    if (props.origen === "deleteItem") handler = props.itemDeletedHandler;
    if (props.origen === "emNote") {
      handler = () => props.sendDoc(props.typeDoc);
      txtButt = "EMITIR";
    }
  } else {
    handler = props.tableChangedHandler;
  }

  return (
    <form action="sendSms">
      {props.origen !== "deleteItem" && props.origen !== "emNote" ? (
        <React.Fragment>
          <div classes={classes.TitleContainer}>
            {"Mesa Origen: " + props.nMesa.tableNumber}
          </div>
          <div className={classes.TextAreaContainer}>
            <ComboBox
              text={props.cantMesas}
              origen={props.origen}
              cantMesas={tables}
              checkBoxChangeMesa={props.checkBoxChangeMesa}
              nMesa={props.nMesa}
              comboSelection={props.inputChangeTable}
            />
          </div>
          <div className={classes.ButtonContainer}>
            <MultiButton
              multiBackColor={"#9EC446"}
              multiWidth={"5rem"}
              multiBorderRad={"25px"}
              multiFont={"0.9rem"}
              clicked={handler}
              textMultiButton={"CAMBIAR"}
            />
          </div>
        </React.Fragment>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <input
            style={{
              fontWeight: "bold",
              color: "#4C5564",
              fontSize: "0.8rem",
              width: "150px",
              height: "35px",
              background: "#DADEE9",
              outline: "none",
              borderRadius: "4px",
              borderStyle: "none",
              paddingLeft: "5px",
              marginBottom: "5px"
            }}
            type={"password"}
            name={"code"}
            onChange={e => props.typeHandler(e)}
            value={props.code}
            placeholder={"Cod. Supervisor"}
          />
          <div
            style={{
              fontWeight: "bold",
              color: "#4C5564",
              fontSize: "0.8rem",
              display: "flex",
              marginBottom: "5px"
            }}
          >
            <input
              style={{
                marginRight: "10px",
                fontWeight: "bold",
                color: "#4C5564",
                fontSize: "0.8rem",
                font: "inherit"
              }}
              id={"theMerma"}
              type={"checkbox"}
              name={"checkMerma"}
              checked={props.merma}
              onChange={e => props.mermaHandler(e)}
            />
            <label htmlFor={"theMerma"}>Merma</label>
          </div>
          <input
            style={{
              fontWeight: "bold",
              color: "#4C5564",
              fontSize: "0.8rem",
              width: "150px",
              height: "35px",
              background: "#DADEE9",
              outline: "none",
              borderRadius: "4px",
              borderStyle: "none",
              paddingLeft: "5px",
              marginBottom: "5px"
            }}
            type={"number"}
            name={"justify"}
            onChange={e => props.typeHandler(e)}
            value={props.justy}
            placeholder={"Cod. Eliminacion"}
          />
          <MultiButton
            multiBackColor={"#9EC446"}
            multiWidth={"5rem"}
            multiBorderRad={"25px"}
            multiFont={"0.9rem"}
            clicked={handler}
            textMultiButton={txtButt}
          />
        </div>
      )}
    </form>
  );
};

export default ChangeTable;
