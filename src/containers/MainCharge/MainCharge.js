import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import _ from "underscore";

import classes from "./MainCharge.scss";
import ExitButton from "../../components/Buttons/ExitButton/ExitButton";
import ChargeButton from "../../components/Buttons/ChargeButton/ChargeButton";
import MonitorButton from "../../components/Buttons/MonitorButton/MonitorButton";
import SelectorButtons from "./SelectorButtons/SelectorButtons";
import Totalizator from "../../components/Totalizator/Totalizator";
import SingleCheck from "./SingleCheck/SingleCheck";
import MultiCheck from "./MultiCheck/MultiCheck";
import * as passItemToCheckAction from "../../store/actions/index";
import * as passItemToListAction from "../../store/actions/index";
import * as indexActions from "../../store/actions/index";
import * as fillCheckActions from "../../store/actions/index";
import * as topBarStateActions from "../../store/actions/index";
import { validateEmail } from "../../utils/emailValidator";
import { ZOHO_CLIENT, GO_ZOHO } from "../../configs/configs";

class MainCharge extends Component {
  state = {
    checkSwitcher: "showButtons",
    order: [],
    total: "0",
    row: [],
    rowEnabler: false,
    boleta: true,
    factura: false,
    tipoId: "ID",
    data: {},
    items: null,
    goCharge: "no",
    numCuenta: 1,
    dataToPass: [],
    totalOrder: [],
    multiTotal: 0,
    chargeLock: false
  };

  setMultiTotal = value => {
    this.setState({
      multiTotal: value
    });
  };

  componentDidUpdate() {
    if (this.state.row.length < this.props.checkList.length) {
      const a = _.clone(this.props.checkList);
      const b = _.clone(this.state.row);
      const inter = _.difference(a, b);
      let total = _.clone(this.state.total);

      if (this.state.row.length > 0) {
        for (let i = 0; i < b.length; i++) {
          const row = b[i];
          if (parseFloat(row.key) > parseFloat(inter[0].key)) {
            total =
              parseFloat(total) +
              parseFloat(inter[0].props.children[3].props.children);
            b.splice(i, 0, inter.pop());
            break;
          } else {
            if (i === b.length - 1) {
              total =
                parseFloat(total) +
                parseFloat(inter[0].props.children[3].props.children);
              b.push(inter.pop());
              break;
            }
          }
        }
      } else {
        total =
          parseFloat(total) +
          parseFloat(inter[0].props.children[3].props.children);
        b.push(inter.pop());
      }
      this.setState({
        row: b,
        total: total.toFixed(2)
      });
    }
  }

  componentWillUnmount() {
    this.setState = {
      checkSwitcher: "showButtons",
      order: [],
      total: 0,
      row: [],
      rowEnabler: false,
      fromList: [],
      checks: []
    };
  }

  componentDidMount() {
    if (this.props.order.length > 0) {
      let order = _.clone(this.props.order);
      let total = 0;
      order.forEach(orden => {
        total = total + parseFloat(orden.precio);
      });
      let row = this.createRow(order);
      this.props.onPassItemToList(row);
    } else {
      this.props.history.goBack();
    }
  }

  createRow = order => {
    let trow = [];
    let total = 0;
    let totalOrder = [];
    let myBack = "#F3F3F5";
    for (let index = 0; index < order.length; index++) {
      const itemLoop = order[index];
      let key = index + "";

      total = total + parseFloat(itemLoop.precioTotal);

      for (let i = 0; i < itemLoop.cantidad; i++) {
        if (myBack === "#F3F3F5") {
          myBack = "#D8DEE8";
        } else {
          myBack = "#F3F3F5";
        }

        let itemToAdd = _.clone(itemLoop);
        let trueKey = _.clone(key) + i;
        let kIt = "key";
        itemToAdd[kIt] = trueKey;
        itemToAdd.precioTotal =
          parseFloat(itemLoop.precioTotal) / itemLoop.cantidad;
        totalOrder.push(itemToAdd);
        trow.push(
          <tr key={trueKey}>
            <td
              onClick={() => this.itemHandler(trueKey)}
              style={{
                cursor: "pointer",
                width: "37%",
                background: myBack,
                color: "#5D5D5D",
                fontSize: "1.1rem",
                textAlign: "center",
                height: "4.1rem"
              }}
            >
              {itemLoop.nombrePlato}
            </td>
            <td
              style={{
                background: myBack,
                width: "17.6%",
                color: "#5D5D5D",
                fontSize: "1.1rem",
                textAlign: "center",
                height: "4.1rem"
              }}
            >
              {1}{" "}
            </td>
            <td
              style={{
                background: myBack,
                width: "21%",
                color: "#5D5D5D",
                fontSize: "1.1rem",
                textAlign: "center",
                height: "4.1rem"
              }}
            >
              {itemLoop.precio}
            </td>
            <td
              style={{
                background: myBack,
                width: "20%",
                color: "#5D5D5D",
                fontSize: "1.1rem",
                textAlign: "center",
                height: "4.1rem"
              }}
            >
              {(parseFloat(itemLoop.precioTotal) / itemLoop.cantidad).toFixed(
                2
              )}
            </td>
          </tr>
        );
      }
    }
    this.setState({
      total: total.toFixed(2),
      row: trow,
      totalOrder: totalOrder
    });
    return trow;
  };

  createRowFinal = item => {
    let trow = [];
    let key = item.key;
    let nombreArticulo = item.props.children[0].props.children;
    let totalArticulo = item.props.children[3].props.children;
    trow.push(
      <tr key={key}>
        <td
          style={{
            width: "100%",
            cursor: "pointer"
          }}
        >
          {nombreArticulo}
        </td>
        <td
          style={{
            textAlign: "end",
            width: "100%"
          }}
        >
          {totalArticulo}
        </td>
      </tr>
    );
    return trow;
  };

  singleHandler = () => {
    if (this.props.checkList !== null) {
      this.setState({
        checkSwitcher: "singleCheck",
        rowEnabler: false,
        goCharge: "single"
      });

      let rows = [];
      this.props.checkList.forEach(item => {
        let row = this.createRowFinal(item);
        rows.push(row.pop());
      });
      rows.sort((a, b) => parseFloat(a.key) - parseFloat(b.key));

      let orders = _.clone(this.state.totalOrder);
      let data = {};
      data.orders = orders;
      data.tipoDoc = "03";
      data.nombreReceptor = "";
      data.numDocReceptor = "";
      data.email = "";
      data.direccionDestino = "";
      data.numCuenta = this.state.numCuenta;
      data.checkType = "singleCheck";
      this.setState({
        data: data,
        items: rows
      });
    } else {
      alert("No hay Items en la cuenta");
    }
  };

  multiHandler = () => {
    if (this.props.checkList !== null) {
      this.setState({
        checkSwitcher: "multiCheck",
        rowEnabler: true,
        goCharge: "multi"
      });
    } else {
      alert("No hay Items en la cuenta");
    }
  };

  nextCheckHandler = account => {
    let currentData = _.clone(this.state.dataToPass);
    currentData.push(account);
    this.setState({
      dataToPass: currentData
    });
  };

  isOdd = num => num % 2;

  mainCashierHandler = () => {
    this.props.history.push("/maincashier");
  };

  backHandler = () => {
    this.props.history.goBack();
  };

  singleDocument = dataToPass => {
    if (this.state.boleta) {
      this.props.onFillChecks(dataToPass);
      this.props.history.push("/actualcashier");
    } else {
      if (this.state.data.numDocReceptor === "") {
        alert("Debe completar el campo RUC");
      } else if (this.state.data.nombreReceptor === "") {
        alert("Debe completar el campo Nombre");
      } else if (this.state.data.direccionDestino === "") {
        alert("Debe completar el campo Direccion");
      } else if (this.state.data.email === "") {
        alert("Debe completar el campo Email");
      } else if (!validateEmail(_.clone(this.state.data.email))) {
        alert("Coloco email no valido");
      } else {
        this.props.onFillChecks(dataToPass);
        this.props.history.push("/actualcashier");
      }
    }
  };

  chargeHandler = () => {
    if (this.state.checkSwitcher !== "multiCheck") {
      let validMail = true;
      if (this.state.data.email !== "")
        validMail = validateEmail(_.clone(this.state.data.email));
      if (this.state.checkSwitcher === "singleCheck") {
        let dataToPass = _.clone(this.state.dataToPass);
        let data = _.clone(this.state.data);
        dataToPass.push(data);
        let sum = _.clone(this.state.total);
        if (parseFloat(sum) * 1.28 >= 700 && this.state.clientId === "") {
          alert(
            "Debe agregar identificacion a boleta con monto mayor a S/.700"
          );
        } else if (!validMail) {
          alert("Coloco email no valido");
        } else {
          this.singleDocument(dataToPass);
        }
      } else {
        alert("Seleccione opciones para configurar cuenta");
      }
    } else {
      alert("Presione SUB-CUENTA para cobro parcial");
    }
  };

  itemHandler = key => {
    if (this.state.rowEnabler) {
      let total = parseFloat(JSON.parse(JSON.stringify(this.state.total)));
      let deleteRow = this.props.checkList.slice(0);
      let deleteRowState = this.state.row.slice(0);
      let itemTosend = null;
      let del = deleteRow.filter((el, index) => {
        if (el.key === key) {
          itemTosend = el;
          deleteRowState.splice(index, 1);
        }
        return el.key !== key;
      });

      total = total - parseFloat(itemTosend.props.children[3].props.children);
      this.setState({
        total: total.toFixed(2),
        row: deleteRowState
      });

      this.props.onPassItemToCheck(itemTosend);
      this.props.onPassItemToList(del);
    } else {
      alert("Debe seleccionar Multi-Cuenta para manipular la lista");
    }
  };

  isOdd = num => num % 2;

  singleRadioChangeHandler = e => {
    let newStateBoleta = this.state.boleta;
    let data = _.clone(this.state.data);
    data.tipoDoc = "03";
    if (e.currentTarget.name.toLowerCase() === "boleta") {
      this.setState({
        boleta: !newStateBoleta,
        factura: newStateBoleta,
        tipoId: "ID",
        data: data
      });
    } else {
      let newStateBoleta = this.state.boleta;
      let data = _.clone(this.state.data);
      data.tipoDoc = "01";
      this.setState({
        boleta: !newStateBoleta,
        factura: newStateBoleta,
        tipoId: "RUC",
        data: data
      });
    }
  };

  textHandler = e => {
    let data = _.clone(this.state.data);
    switch (e.target.name) {
      case "clientId":
        data.numDocReceptor = e.target.value;
        this.setState({
          data: data
        });
        break;
      case "nombre":
        data.nombreReceptor = e.target.value;
        this.setState({
          data: data
        });
        break;
      case "direccion":
        data.direccionDestino = e.target.value;
        this.setState({
          data: data
        });
        break;
      case "correo":
        data.email = e.target.value;
        this.setState({
          data: data
        });
        break;
      default:
        break;
    }
  };

  buscarRucHandler = () => {
    if (this.state.factura) {
      if (this.state.data.numDocReceptor !== "") {
        if (this.state.data.numDocReceptor.length === 11) {
          axios
            .get(
              `http://206.189.225.228:3000/api/contri/${
                _.clone(this.state.data).numDocReceptor
              }`,
              {
                headers: { "Access-Control-Allow-Origin": "*" },
                responseType: "json"
              }
            )
            .then(async response => {
              let dataRec = response.data.pop();
              let data = _.clone(this.state.data);
              data.direccionDestino = dataRec.nombreVia + " " + dataRec.numero;
              data.nombreReceptor = dataRec.nRazonSocial;
              await this.setState({
                data: data
              });
              if (GO_ZOHO) {
                let clientZoho = await this.getZohoClientHandler(data).catch(
                  err => console.log(err)
                );
                this.props.onSaveClientZoho(clientZoho);
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          alert("RUC INVALIDO");
        }
      } else {
        alert("Debe Colocar el RUC");
      }
    } else {
      alert("Selecione Factura para buscar RUC");
    }
  };

  getZohoClientHandler = data => {
    return new Promise((resolve, reject) => {
      axios
        .post(ZOHO_CLIENT, data, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          resolve(response.data.clientId);
        })
        .catch(err => {
          reject(err.response.data);
        });
    });
  };

  render() {
    let typeView = null;

    switch (this.state.checkSwitcher) {
      case "singleCheck":
    
        typeView = (
          <SingleCheck
            // refRuc={input => {
            //   this.rucRef = input;
            // }}
            singleRadioChangeHandler={this.singleRadioChangeHandler}
            boletaState={this.state.boleta}
            facturaState={this.state.factura}
            clientId={this.state.data.numDocReceptor}
            nombre={this.state.data.nombreReceptor}
            direccion={this.state.data.direccionDestino}
            correo={this.state.data.email}
            textHandler={this.textHandler}
            tipoId={this.state.tipoId}
            buscarRucHandler={this.buscarRucHandler}
            total={this.state.total}
          />
        );

        // this.rucRef.focus();
        break;
      case "multiCheck":
        typeView = (
          <MultiCheck
            // refRuc={input => {
            //   this.rucRef = input;
            // }}
            navigator={this.props.history}
            singleRadioChangeHandler={this.singleRadioChangeHandler}
            tipoId={this.state.tipoId}
            buscarRucHandler={this.buscarRucHandler}
            total={this.state.total}
            nextCheckHandler={this.nextCheckHandler}
            order={this.state.totalOrder}
            setMultiTotal={this.setMultiTotal}
          />
        );
        break;
      default:
        typeView = (
          <SelectorButtons
            singleClicked={this.singleHandler}
            multiClicked={this.multiHandler}
          />
        );
        break;
    }
    return (
      <div className={classes.SupraContainer}>
        <div className={classes.ContainerButtons}>
          <div className={classes.Changer}>{typeView}</div>
          <div className={classes.Buttons}>
            <div className={classes.Charge}>
              <ChargeButton execute={this.chargeHandler} />
            </div>
            <div className={classes.Exit}>
              <ExitButton backHandler={this.backHandler} />
            </div>
            <div className={classes.Monitor}>
              <MonitorButton backHandler={this.mainCashierHandler} />
            </div>
          </div>
        </div>
        <div className={classes.Positionator}>
          <div className={classes.Container}>
            <div className={classes.Headers}>
              <div className={classes.LeftCorner}>Descripcion</div>
              <div className={classes.FirstPiece}>Cant</div>
              <div className={classes.SecondPiece}>PU</div>
              <div className={classes.RightCorner}>Precio Total</div>
            </div>
            <div className={classes.Lists}>
              <div>
                <div
                  style={{
                    overflow: "auto",
                    maxHeight: 420
                  }}
                />
                <table
                  cellSpacing="0"
                  cellPadding="0"
                  style={{
                    width: "100%"
                  }}
                >
                  <tbody>{this.state.row}</tbody>
                </table>
              </div>
            </div>
            <div className={classes.Totals}>
              <div className={classes.MultiCont}>
                <Totalizator
                  backTotal={"#485923"}
                  backColor={"#F3F3F5"}
                  backWidth={"300px"}
                  backFontSize={"1.1rem"}
                  backBorderRad={"15px"}
                  totalFirstText={"TOTAL CUENTA"}
                  totalSecondText={`S/ ${this.state.total}`}
                  bShadow={"0 4px 8px -2px #888"}
                />
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
    order: state.order.order,
    checkList: state.ItemBack.ItemBack,
    indexCheck: state.indexCheck.indexCheck,
    indexSubCheck: state.indexSubCheck.indexSubCheck
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSaveClientZoho: client =>
      dispatch(topBarStateActions.saveClientZoho(client)),
    onPassItemToCheck: item =>
      dispatch(passItemToCheckAction.passItemToCheck(item)),
    onPassItemToList: itemBack =>
      dispatch(passItemToListAction.passItemToList(itemBack)), //UPDATE SELF LIST
    onSetIndexCheck: indexCheck =>
      dispatch(indexActions.setIndexCheck(indexCheck)),
    onSetIndexSubCheck: indexSubCheck =>
      dispatch(indexActions.setIndexSubCheck(indexSubCheck)),
    onFillChecks: checks => dispatch(fillCheckActions.fillChecks(checks))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainCharge); // can pass null to mapState when needed
