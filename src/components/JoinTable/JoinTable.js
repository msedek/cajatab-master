import React from "react";

import classes from "./JoinTable.scss";
import HeaderTitleProduct from "../HeaderTitle/HeaderTables/HeaderTitleProduct";
import ProductManagerShape from "../ProductManagerShapeCheck/ProductManagerShape";

const JoinTable = props => {
  let master = {};
  let unLinkAble = true;

  props.cantMesas.forEach(el => {
    if (props.nMesa.tableNumber.includes(el.numeroMesa)) {
      master = el;
      unLinkAble = master.orders.length === 0;
    }
  });

  return (
    <div className={classes.Container}>
      <div className={classes.ZoneData}>
        <div className={classes.Buttons}>
          <div className={classes.LinkButton}>
            <i
              className="fas fa-link"
              onClick={() => props.actionHandler("unirMesas")}
            />
            <span className={classes.Text}>Unir Mesas</span>
          </div>
          <div className={classes.UnLinkButton}>
            <i
              className="fas fa-unlink"
              onClick={() => props.actionHandler("desUnirMesas")}
            />
            <span className={classes.Text}>Separar Mesas</span>
          </div>
        </div>
      </div>

      <div className={classes.ZoneList}>
        <div className={classes.ZoneCenteCoste}>
          <div className={classes.ZoneTitle}>
            <HeaderTitleProduct spanText={"Mesas"} />
          </div>
          <div className={classes.List}>
            <ProductManagerShape
              data={props.cantMesas}
              nMesa={props.nMesa}
              onChangeHandler={props.linkTableHandler}
              confHeight={"14vh"}
              confGridColumns={"4.5% 1fr 4%"}
              confMarfinLeftBox={"-5rem"}
              checkBoxLinkedMesa={props.checkBoxLinkedMesa}
              state={props.state}
              unLinkAble={unLinkAble}
              master={master}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinTable;
