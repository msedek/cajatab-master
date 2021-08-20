import React from "react";

import ItemList from "../../components/ItemList/ItemList";
import classes from "./OrderFooter.scss";
import ExitButton from "../Buttons/ExitButton/ExitButton";

const OrderFooter = props => {
  let items = [];

  let disp = "visible";

  if (props.isVisible) {
    disp = props.isVisible;
  }

  props.listItems.forEach((item, index) => {
    items.push(
      <ItemList
        key={index}
        checkName={`checkStateOrder${index}`}
        item={item}
        state={props.state}
        confColor={"#5D5D5D"}
        confWeight={"bold"}
        confSize={"0.9rem"}
        confMarginBottom={"0.2rem"}
        confMarginLeft={"2rem"}
        TextLabel={item.orderHuman}
        removeOrderHandler={props.removeOrderHandler}
      />
    );
  });

  let thePax = (
    <input
      className={classes.TextBox2}
      type="number"
      name={"pax"}
      tabIndex={props.tabIndexPax}
      value={props.pax}
      maxLength="3"
      placeholder="PAX"
      onChange={e => props.typeHandler(e)}
    />
  );

  let cond = props.orderSize ? props.orderSize.length : 1;

  return (
    <div className={classes.OrderControl}>
      <div className={classes.ButtonOrderContainer}>
        <div
          className={classes.ActualButton}
          onClick={props.orderHandler}
          onKeyPress={k => props.keyHandler(k, "add")}
        >
          <i tabIndex={props.tabIndex} className="fas fa-utensils" />
        </div>
        <div className={classes.ButtonText}>
          <span>{props.action}</span>
        </div>
      </div>
      <div className={classes.ListOrderContainer}>{items}</div>
      <div className={classes.MultiButtonsContainer}>
        <div
          className={classes.SearchButtonContainer}
          style={{
            visibility: disp
          }}
        >
          {props.estado === "Libre" ? thePax : cond === 0 ? thePax : ""}
          <input
            className={classes.TextBox}
            ref={props.sRef}
            type="text"
            tabIndex={props.sIndex}
            name="search"
            id="search"
            value={props.search}
            onChange={e => props.typeHandler(e)}
            placeholder="&#61442; Buscar"
          />
        </div>
        <div className={classes.ExitButtonContainer}>
          <ExitButton
            keyPressHandler={props.keyHandler}
            tabIndex={props.tabIndex2}
            backHandler={props.backClicked}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderFooter;
