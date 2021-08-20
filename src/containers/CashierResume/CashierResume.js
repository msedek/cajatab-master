import React, { Component } from "react";
import { connect } from "react-redux";

import classes from "./CashierResume.scss";
import ResumeBox from "../../components/ResumeBox/ResumeBox";
import Totalizator from "../../components/Totalizator/Totalizator";
import ExitButton from "../../components/Buttons/ExitButton/ExitButton";
import CashierButton from "../../components/Buttons/CashierButton/CashierButton";
import CloseCashierButton from "../../components/Buttons/CloseCashierButton/CloseCashierButton";
// import * as swViewActions from '../../store/actions/index';

class CashierResume extends Component {
  closeCashierHandler = () => {
    alert("HICISTE CIERRE PARCIAL DE CAJA");
  };

  backHandler = () => {
    this.props.history.goBack();
  };

  arqHandler = () => {
    this.props.history.push("/cashierregister");
  };

  render() {
    return (
      <div className={classes.ResumeContainer}>
        <div className={classes.Options}>
          <div className={classes.Incomes}>
            <ResumeBox title={"INGRESOS"} footerMoney={"112,00"} />
          </div>
          <div className={classes.Margin1} />
          <div className={classes.Expenses}>
            <ResumeBox title={"EGRESOS"} footerMoney={"112,00"} />
          </div>
          <div className={classes.Margin2} />
          <div className={classes.Cards}>
            <ResumeBox title={"TARJETAS"} footerMoney={"112,00"} />
          </div>
        </div>
        <div className={classes.Sales}>
          <div className={classes.SalesBox}>
            <div className={classes.Title}>
              <span>VENTAS</span>
            </div>
            <div className={classes.Header}>
              <div className={classes.Fecha}>
                <span>FECHA</span>
              </div>
              <div className={classes.Tipo}>
                <span>TIPO</span>
              </div>
              <div className={classes.Documento}>
                <span>DOCUMENTO</span>
              </div>
              <div className={classes.Total}>
                <span>TOTAL</span>
              </div>
              <div className={classes.Mesa}>
                <span>MESA</span>
              </div>
              <div className={classes.Mozo}>
                <span>MOZO</span>
              </div>
              <div className={classes.Cliente}>
                <span>CLIENTE</span>
              </div>
              <div className={classes.Descuento}>
                <span>DCTO</span>
              </div>
            </div>
            <div className={classes.Content} />
          </div>
          <div className={classes.Margin} />
          <div className={classes.Totals}>
            <div className={classes.Totals1}>
              <div className={classes.SalesLeft}>
                <Totalizator
                  backTotal={"#E8EAEE"}
                  backColor={"#485923"}
                  backBorderRad={"25px"}
                  totalFirstText={"TOTAL VENTAS"}
                  totalSecondText={"S/376,00"}
                  bShadow={"0 4px 8px -2px #888"}
                  backFontSize={"0.9rem"}
                  confHeight={"100%"}
                  confMaxHeight={"100%"}
                  backWidth={"100%"}
                />
              </div>
              <div className={classes.Incomes}>
                <Totalizator
                  backTotal={"#E8EAEE"}
                  backColor={"#485923"}
                  backBorderRad={"25px"}
                  totalFirstText={"TOTAL INGRESOS"}
                  totalSecondText={"S/376,00"}
                  bShadow={"0 4px 8px -2px #888"}
                  backFontSize={"0.9rem"}
                  confHeight={"100%"}
                  confMaxHeight={"100%"}
                  backWidth={"100%"}
                />
              </div>
              <div className={classes.Expenses}>
                <Totalizator
                  backTotal={"#E8EAEE"}
                  backColor={"#485923"}
                  backBorderRad={"25px"}
                  totalFirstText={"TOTAL EGRESOS"}
                  totalSecondText={"S/376,00"}
                  bShadow={"0 4px 8px -2px #888"}
                  backFontSize={"0.9rem"}
                  confHeight={"100%"}
                  confMaxHeight={"100%"}
                  backWidth={"100%"}
                />
              </div>
              <div className={classes.Cards}>
                <Totalizator
                  backTotal={"#E8EAEE"}
                  backColor={"#485923"}
                  backBorderRad={"25px"}
                  totalFirstText={"TOTAL TARJETAS"}
                  totalSecondText={"S/376,00"}
                  bShadow={"0 4px 8px -2px #888"}
                  backFontSize={"0.9rem"}
                  confHeight={"100%"}
                  confMaxHeight={"100%"}
                  backWidth={"100%"}
                />
              </div>
            </div>
            <div className={classes.Totals2}>
              <div className={classes.Cashier}>
                <Totalizator
                  backTotal={"#E8EAEE"}
                  backColor={"#485923"}
                  backBorderRad={"25px"}
                  totalFirstText={"TOTAL EN CAJA"}
                  totalSecondText={"S/376,00"}
                  bShadow={"0 4px 8px -2px #888"}
                  backFontSize={"0.9rem"}
                  confHeight={"100%"}
                  confMaxHeight={"100%"}
                  backWidth={"100%"}
                />
              </div>
            </div>
            <div className={classes.Buttons}>
              <div className={classes.ParcialClose}>
                <CloseCashierButton clicked={this.closeCashierHandler} />
              </div>
              <div className={classes.CashRegister}>
                <CashierButton clicked={this.arqHandler} />
              </div>
              <div className={classes.Exit}>
                <ExitButton backHandler={this.backHandler} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    // swView: state.swView.switchView
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // onGoMainCashier: () => dispatch(swViewActions.goMainCashier()),
    // onGoCashierRegister: () => dispatch(swViewActions.goCashierRegister())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CashierResume);
