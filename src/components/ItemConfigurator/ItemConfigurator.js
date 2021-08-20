import React from "react";

import classes from "./ItemConfigurator.scss";
import ItemListGreen from "../ItemListGreen/ItemListGreen";

const ItemConfigurator = props => {
  let items = [];
  let data = [];
  let tipo = "radio";
  let categoria = props.LabelFirst;

  if (props.dataType) {
    data = props.dataType;
  }

  data.forEach((el, index) => {
    let label = data[index];
    let checkName = "";

    if (categoria === "GUARNICIONES") {
      label = data[index].name;
      checkName = `checkStateGuarnicion${index}`;
      tipo = "checkbox";
    } else if (categoria === "INGREDIENTES") {
      checkName = `checkStateIngredientes${index}`;
      tipo = "checkbox";
    } else if (categoria === "LACTEOS") {
      checkName = props.lacteosState;
    } else if (categoria === "ENDULZANTE") {
      checkName = props.endulzanteState;
    } else if (categoria === "TEMPERATURA") {
      checkName = props.temperaturaState;
    } else if (categoria === "TERMINO") {
      checkName = props.terminoState;
    }

    items.push(
      <ItemListGreen
        type={tipo}
        key={index}
        label={label}
        confMarginBottom={"0rem"}
        confMarginLeft={"0.8rem"}
        confSize={"1rem"}
        confWeight={"normal"}
        confColor={"#7F7F7F"}
        confColor2={"#9EC446"}
        TextLabel={label}
        state={props.state}
        categoria={categoria}
        checkName={checkName}
        data={el}
        configOptionsHandler={props.configOptionsHandler}
        LabelFirst={props.LabelFirst}
      />
    );
  });

  return (
    <div className={classes.ItemContainer}>
      <div className={classes.Title}>{props.LabelFirst}</div>
      <div className={classes.Scroller}>{items}</div>
    </div>
  );
};

export default ItemConfigurator;
