import React, { Component } from "react";
import { connect } from "react-redux";
import socketIOClient from "socket.io-client";
import _ from "underscore";
import axios from "axios";

import classes from "./StatusMesas.scss";
import ExitButton from "../../components/Buttons/ExitButton/ExitButton";
import ChargeButton from "../../components/Buttons/ChargeButton/ChargeButton";
import Totalizator from "../../components/Totalizator/Totalizator";
import * as getDocActions from "../../store/actions/index";
import * as getCheckActions from "../../store/actions/index";
import * as topBarActions from "../../store/actions/index";
import Modal from "../../components/UI/Modal/Modal";
import ChangeTable from "../../components/ChangeTable/ChangeTable";
import JoinTable from "../../components/JoinTable/JoinTable";
// import { calculateDecimal } from "../../utils/decimal";
import {
  END_POINT,
  SUB_END_POINT,
  SEND_MESA_DATA,
  ALERTA_INTERNA,
  APPLICATION_JSON
} from "../../configs/configs";

class StatusMesas extends Component {
  state = {
    Employe: null,
    waiter: null,
    table: "",
    nCashier: null,
    orders: [],
    socket: socketIOClient(SUB_END_POINT),
    canChange: false,
    settingMesa: false,
    inputChangeTable: "",
    unirArray: [],
    cantMesas: [],
    multiMesa: false,
    top: "",
    left: "40%",
    toLink: [],
    toUnLink: [],
    preCuenta: "0",
    ticket: [],
    itemToMove: "",
    origen: "changeMesa",
    code: "",
    justy: "",
    merma: false,
    settingTax: 0.1 //CONVERTIR ESTO EN SETTING EN LA BD
  };

  getMesas = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${END_POINT}mesas/`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          if (response.data.length > 0) {
            resolve(response.data);
          } else {
            resolve("No hay mesas registradas");
          }
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  componentWillMount() {
    this.state.socket.on("connect", () => {});
  }

  componentWillUnmount() {
    this.state.socket.close();
  }

  getMesaSocket = () => {
    this.state.socket.on(SEND_MESA_DATA, data => {
      let jData = JSON.parse(data);
      this.props.onSetMesaData("MESA " + jData.numeroMesa);
      if (this.state.orders.length === 0) {
        if (jData.orders.length > 0) {
          if (jData.empleados[0])
            this.props.onSetMozoData(
              jData.empleados[0].contact_name.toUpperCase()
            );
          this.props.onSetMozoData(this.props.cajero);
        }
        this.setState({
          orders: jData.orders
        }); //ACA SETEAR EL TOTAL
      }
    });
  };

  componentDidMount = async () => {
    if (this.props.mesaID !== null) {
      this.props.onSetCheck([]);
      const cantMesas = await this.getMesas().catch(err =>
        alert(ALERTA_INTERNA)
      );
      if (cantMesas !== undefined) {
        this.setState({
          cantMesas: cantMesas
        });
      }
      this.createState();
      this.props.onSetMesaTitle("DETALLES DE");
      this.props.onSetMozoTitle("MOZO");
      this.state.socket.emit(SEND_MESA_DATA, {
        id: this.props.mesaID
      });
      this.getMesaSocket();
    } else {
      this.props.history.goBack();
    }
  };

  isOdd = num => num % 2;

  backHandler = async () => {
    await this.setState({ canChange: true });
    this.props.history.goBack();
  };

  chargeHandler = () => {
    if (this.state.orders.length > 0) {
      this.props.history.push("/maincharge");
    } else {
      alert("No hay pedidos en esta mesa");
    }
  };

  waiterHandler = () => {
    alert("HACER POPUP LLAMAR AL MESERO");
  };

  orderHandler = () => {
    this.props.history.push("/takeorder");
  };

  changeTableHandler = () => {
    let canChange = true;
    let mesaCh = {};
    for (let i = 0; i < this.state.cantMesas.length; i++) {
      const mesa = this.state.cantMesas[i];
      if (mesa._id === this.props.mesaID) {
        mesaCh = mesa;
        if (
          mesa.estado === "Ocupada" ||
          mesa.estado === "Por Cobrar" ||
          mesa.estado === "Por Pagar"
        ) {
          canChange = false;
          this.setState(
            {
              origen: "changeMesa"
            },
            () =>
              this.setState({
                settingMesa: true,
                top: "35%"
              })
          );
          break;
        } else {
          break;
        }
      }
    }
    if (canChange) {
      if (mesaCh.orders.length === 0) {
        alert("No puede mover mesas sin orden activa");
      } else {
        alert("No puede cambiar esta mesa porque esta unida otras");
      }
    }
  };

  joinTableHandler = () => {
    this.setState({
      settingMesa: true,
      multiMesa: true,
      top: "25%"
    });
  };

  changeMesa = (mesa, data) => {
    return new Promise((resolve, reject) => {
      axios
        .put(`${END_POINT}changemesa/${mesa}`, data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": APPLICATION_JSON
          }
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  sendChangedMesa = data => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${END_POINT}cambiarmesa/`, data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": APPLICATION_JSON
          }
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  linkMesas = () => {
    return new Promise((resolve, reject) => {
      let data = {};
      data.data = this.state.toLink;
      axios
        .post(`${END_POINT}linkmesas/${this.state.toLink[0]._id}`, data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": APPLICATION_JSON
          }
        })
        .then(response => {
          resolve("done");
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  unLinkMesas = () => {
    return new Promise((resolve, reject) => {
      let data = {};
      data.data = this.state.toUnLink;
      axios
        .post(`${END_POINT}unlinkmesas`, data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": APPLICATION_JSON
          }
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  tableChangedHandler = async () => {
    if (
      this.state.inputChangeTable !== "" &&
      this.state.inputChangeTable !== "MESA DESTINO"
    ) {
      let mesas = _.clone(this.state.cantMesas);
      let mesaNew = "";
      let mesaDestino = "";
      for (let i = 0; i < mesas.length; i++) {
        const mesa = mesas[i];
        if (this.state.inputChangeTable.includes(mesa.numeroMesa)) {
          mesaNew = mesa._id;
          mesaDestino = mesa.numeroMesa;
          break;
        }
      }
      const changeMesa = await this.changeMesa(
        mesaNew,
        this.props.tablesList
      ).catch(err => alert(ALERTA_INTERNA));
      if (changeMesa !== undefined) {
        let data = {
          mesaOrigen: this.props.tablesList.tableNumber,
          command: "Cambio a",
          mesaDestino: mesaDestino
        };
        await this.sendChangedMesa(data).catch(err => alert(ALERTA_INTERNA));
      }
    } else {
      alert("No se cambio la mesa");
    }
    this.setState(
      {
        settingMesa: false
      },
      () => {
        this.startTimer(100);
      }
    );
  };

  startTimer = duration => {
    setTimeout(() => {
      this.setState({ settingMesa: false }, () => {
        if (this.state.origen === "changeMesa") {
          this.props.history.goBack();
        } else {
          this.setState({
            code: "",
            justy: "",
            merma: false
          });
        }
      });
    }, duration);
  };

  actionHandler = async action => {
    switch (action) {
      case "unirMesas":
        if (this.state.toLink.length > 1) {
          await this.linkMesas().catch(err => alert(ALERTA_INTERNA));
          this.props.history.goBack();
        } else {
          alert("Seleccione Mesas a Unir");
        }
        break;
      case "desUnirMesas":
        if (this.state.toUnLink.length > 0) {
          await this.unLinkMesas().catch(err => alert(ALERTA_INTERNA));

          this.props.history.goBack();
        } else {
          alert("Seleccione Mesas a Desunir");
        }
        break;
      default:
        break;
    }
  };

  checkBoxChangeMesa = (e, data, origen) => {
    this.setState({
      inputChangeTable: e.target.value
    });
  };

  checkBoxLinkedMesa = (e, data, state, stateName, hardMaster, unLinkAble) => {
    let toLink = _.clone(this.state.toLink);
    let toUnLink = _.clone(this.state.toUnLink);
    let differenceUnlink = [];
    let checkState = this.state[stateName];
    if (!unLinkAble && checkState && data.master !== "") {
      alert("Hay comandas activas, no puede separar la mesa");
    } else {
      if (toLink.length === 0) {
        toLink.push(hardMaster);
      }
      if (hardMaster.master !== "") {
        this.state.cantMesas.forEach(mesa => {
          if (
            mesa.master === hardMaster.master &&
            mesa._id !== hardMaster._id &&
            hardMaster.master !== ""
          ) {
            differenceUnlink.push(mesa);
          }
        });
      }
      if (e.target.checked && data.master === "") {
        toLink.push(data);
      } else if (
        e.target.checked &&
        data.master === hardMaster.master &&
        data._id !== hardMaster._id
      ) {
        toUnLink = _.difference(toUnLink, [data]);
      } else if (
        !e.target.checked &&
        data.master === hardMaster.master &&
        data._id !== hardMaster._id
      ) {
        toUnLink.push(data);
      } else if (!e.target.checked && data.master === "") {
        toLink = _.difference(toLink, [data]);
      }
      if (toUnLink.length === differenceUnlink.length) {
        toUnLink.unshift(hardMaster);
      }
      this.setState({
        [stateName]: !state,
        toLink: toLink,
        toUnLink: toUnLink
      });
    }
  };

  clickOnBackDrop = async () => {
    await this.setState({
      settingMesa: false
    });
    this.startTimer(100);
  };

  createState = () => {
    let state = _.clone(this.state);
    let mesas = _.clone(this.state.cantMesas);
    mesas.forEach(mesa => {
      let checkStateMesa = `checkStateMesa${mesa.numeroMesa}`;
      let estado = false;
      if (mesa.master !== "") {
        estado = true;
      }
      state[checkStateMesa] = estado;
    });
    this.setState({
      ...state
    });
  };

  deleteItemHandler = async item => {
    for (let i = 0; i < this.state.cantMesas.length; i++) {
      const mesa = this.state.cantMesas[i];
      if (mesa._id === this.props.mesaID) {
        await this.setState({ origen: "deleteItem" });
        await this.setState({
          settingMesa: true,
          top: "35%",
          itemToMove: item.orderID
        });
        break;
      }
    }
  };

  moveItemHandler = async item => {
    for (let i = 0; i < this.state.cantMesas.length; i++) {
      const mesa = this.state.cantMesas[i];
      if (mesa._id === this.props.mesaID) {
        await this.setState({
          origen: "moveItem"
        });
        await this.setState({
          settingMesa: true,
          top: "35%",
          itemToMove: item.orderID
        });
        break;
      }
    }
  };

  itemChangedHandler = async () => {
    if (
      this.state.inputChangeTable !== "" &&
      this.state.inputChangeTable !== "MESA DESTINO"
    ) {
      let mesas = _.clone(this.state.cantMesas);
      let mesaNew = "";
      for (let i = 0; i < mesas.length; i++) {
        const mesa = mesas[i];
        if (this.state.inputChangeTable.includes(mesa.numeroMesa)) {
          mesaNew = mesa._id;
          break;
        }
      }
      let data = {
        mesaID: this.props.tablesList.mesaID,
        itemID: this.state.itemToMove,
        tableNumber: this.props.tableNumber
      };
      await this.changeItem(mesaNew, data).catch(err => alert(ALERTA_INTERNA));
    } else {
      alert("No se cambio el articulo");
    }
    this.setState(
      {
        settingMesa: false
      },
      () => {
        this.startTimer(100);
      }
    );
  };

  itemDeletedHandler = async () => {
    if (this.state.code !== "" && this.state.justy !== "") {
      let data = {
        merma: this.state.merma,
        code: this.state.code,
        justy: this.state.justy,
        itemID: this.state.itemToMove
      };
      await this.deleteItem(this.props.tablesList.mesaID, data).catch(err =>
        alert(err)
      );
    } else {
      alert("No se elimino el articulo");
    }
    await this.setState({ settingMesa: false });
    this.startTimer(100);
  };

  changeItem = (mesa, data) => {
    return new Promise((resolve, reject) => {
      axios
        .put(`${END_POINT}changeitem/${mesa}`, data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": APPLICATION_JSON
          }
        })
        .then(response => {
          let orders = _.clone(this.state.orders);

          let item = orders.find(order => {
            return order._id === this.state.itemToMove;
          });

          let items = _.without(orders, item);

          this.setState({ orders: items }, () => resolve("done"));
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  deleteItem = (mesa, data) => {
    return new Promise((resolve, reject) => {
      axios
        .put(`${END_POINT}deleteitem/${mesa}`, data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": APPLICATION_JSON
          }
        })
        .then(response => {
          if (_.isUndefined(response.data.sms)) {
            let orders = _.clone(this.state.orders);
            let item = orders.find(order => {
              return order._id === this.state.itemToMove;
            });
            let items = _.without(orders, item);
            this.setState({ orders: items }, () => resolve("done"));
          } else {
            alert(response.data.sms);
            resolve("done");
          }
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  mermaHandler = e => {
    let merma = _.clone(this.state.merma);
    this.setState({ merma: !merma });
  };

  typeHandler = e => {
    switch (e.target.name) {
      case "code":
        this.setState({ code: e.target.value });
        break;
      case "justify":
        this.setState({ justy: e.target.value });
        break;
      default:
        break;
    }
  };

  render() {
    let row = [];
    let checkItems = [];

    let totalCuenta = 0.0;

    if (this.state.orders.length > 0) {
      let orders = _.clone(this.state.orders);
      let ordenes = [];
      for (let i = 0; i < orders.length; i++) {
        if (!orders[i].cobrado) {
          const order = orders[i].order;
          const item = {};
          let selector = order.split("-");
          item.categoria = selector[1];
          let selector2 = selector[0].split(".");
          let selector3 = selector2[0].split("_");
          item.cant = selector3[1].replace(/ /g, "");
          item.order = selector3[0];
          let dataItem = selector[2].split("*");
          item.sku = dataItem[0];
          item.item_id = dataItem[1];
          item.tax_id = dataItem[2];
          item.tax_name = dataItem[3];
          item.tax_percentage = dataItem[4];
          let checkGuarni = dataItem[5].split("#");
          item.precio_receta = checkGuarni[0];
          if (checkGuarni.length === 3) {
            for (let j = 1; j < checkGuarni.length; j++) {
              const guarni = checkGuarni[j];
              let guarniSku = "guarniSku" + j;
              item[guarniSku] = guarni;
            }
          }
          item.estado = "por cobrar";
          item.fechaorden = orders[i].fechaorden;
          item.orderID = orders[i]._id;
          ordenes.push(item);
        }
      }

      const compare = (a, b) => {
        if (a.order < b.order) {
          return -1;
        } else if (a.order > b.order) {
          return 1;
        }
      };

      ordenes.sort(compare);

      let trow = [];
      for (let index = 0; index < ordenes.length; index++) {
        let myBack = "#F3F3F5";
        let check = this.isOdd(index);
        if (check === 0) {
          myBack = "#D8DEE8";
        }
        const orden = ordenes[index];
        let nombrePlato;

        let recargo = this.props.estadoRecargo ? 1.28 : 1.18;

        nombrePlato = orden.order;
        let precio = parseFloat(
          (parseFloat(orden.precio_receta) * recargo).toFixed(2)
        );

        let cantidad = orden.cant;
        let cantOper = parseFloat(cantidad.match(/\(([^)]+)\)/)[1]);
        let preTotal = cantOper * precio;
        totalCuenta = totalCuenta + preTotal;

        let item = {
          nombrePlato: nombrePlato,
          cantidad: cantOper,
          precio: precio,
          precioTotal: preTotal,
          orderID: orden.orderID,
          item_id: orden.item_id,
          categoria: orden.categoria,
          order: orden.order,
          sku: orden.sku,
          tax_id: orden.tax_id,
          tax_name: orden.tax_name,
          tax_percentage: orden.tax_percentage
        };

        Object.keys(orden).forEach(function(element, key, _array) {
          if (element.includes("guarniSku")) {
            item[element] = orden[element];
          }
        });

        let settings = (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "horizontal",
              justifyContent: "center"
            }}
          >
            <i
              className="fas fa-minus-square"
              onClick={() => this.deleteItemHandler(item)}
              style={{
                cursor: "pointer"
              }}
            />
            <span
              style={{
                width: "40px"
              }}
            />
            <i
              className="fas fa-exchange-alt"
              onClick={() => this.moveItemHandler(item)}
              style={{
                cursor: "pointer"
              }}
            />
          </div>
        );

        checkItems.push(item);
        trow.push(
          <tr
            key={index}
            style={{
              background: myBack,
              color: "#5D5D5D",
              fontSize: "1.1rem"
            }}
          >
            <td
              style={{
                width: "11.9%",
                height: "4.1rem",
                textAlign: "left",
                paddingLeft: "1rem"
              }}
            >
              {nombrePlato}
            </td>
            <td
              style={{
                width: "5.8%",
                height: "4.1rem",
                textAlign: "center"
              }}
            >
              {cantidad}
            </td>
            <td
              style={{
                width: "5.5%",
                height: "4.1rem",
                textAlign: "center"
              }}
            >
              {parseFloat(precio).toFixed(2)}
            </td>
            <td
              style={{
                width: "8.5%",
                height: "4.1rem",
                textAlign: "center"
              }}
            >
              {preTotal.toFixed(2)}
            </td>
            <td
              style={{
                width: "10%",
                height: "4.1rem",
                textAlign: "center"
              }}
            >
              {settings}
            </td>
          </tr>
        );
      }
      row.push(trow);
      this.props.onSetCheck(checkItems);
    }

    let modalType = "";

    if (this.state.multiMesa) {
      modalType = (
        <JoinTable
          nMesa={this.props.tablesList}
          cantMesas={this.state.cantMesas}
          actionHandler={this.actionHandler}
          checkBoxLinkedMesa={this.checkBoxLinkedMesa}
          state={this.state}
        />
      );
    } else {
      modalType = (
        <ChangeTable
          nMesa={this.props.tablesList}
          inputChangeTable={this.state.inputChangeTable}
          tableChangedHandler={this.tableChangedHandler}
          itemChangedHandler={this.itemChangedHandler}
          itemDeletedHandler={this.itemDeletedHandler}
          checkBoxChangeMesa={this.checkBoxChangeMesa}
          cantMesas={this.state.cantMesas}
          origen={this.state.origen}
          merma={this.state.merma}
          code={this.state.code}
          justy={this.state.justy}
          typeHandler={this.typeHandler}
          mermaHandler={this.mermaHandler}
        />
      );
    }

    return (
      <React.Fragment>
        <Modal
          show={this.state.settingMesa}
          clickOnBackDrop={this.clickOnBackDrop}
          top={this.state.top}
          left={this.state.left}
        >
          {modalType}
        </Modal>
        <div className={classes.Container}>
          <div className={classes.Headers}>
            <div className={classes.LeftCorner}>
              <span>Descripcion</span>
            </div>
            <div className={classes.FirstPiece}>
              <span>Cant</span>
            </div>
            <div className={classes.SecondPiece}>
              <span>PU</span>
            </div>
            <div className={classes.ThirdPiece}>
              <span>Precio Total</span>
            </div>
            <div className={classes.RightCorner}>
              <span>Accion</span>
            </div>
          </div>
          <div className={classes.Lists}>
            <div>
              <div
                style={{
                  overflow: "auto",
                  maxHeight: 400
                }}
              >
                <table
                  cellSpacing="0"
                  cellPadding="0"
                  style={{
                    width: "100%"
                  }}
                >
                  <tbody>{row}</tbody>
                </table>
              </div>
            </div>
          </div>
          <div className={classes.Totals}>
            <div className={classes.MultiCont}>
              <div className={classes.PreCuenta} />
              <Totalizator
                backTotal={"#485923"}
                backColor={"#F3F3F5"}
                backWidth={"300px"}
                backFontSize={"1rem"}
                backBorderRad={"15px"}
                totalFirstText={"TOTAL CUENTA"}
                totalSecondText={`S/ ${totalCuenta.toFixed(2)}`}
                bShadow={"0 4px 8px -2px #888"}
              />
            </div>
          </div>
          <div className={classes.Buttons}>
            <div className={classes.OrderButtons}>
              <div className={classes.OrderButton}>
                <div
                  className={classes.ActualButton}
                  onClick={this.orderHandler}
                >
                  <i className="fas fa-utensils" />
                </div>
                <div className={classes.OrderText}>
                  <span>Comandar</span>
                </div>
              </div>
              <div
                className={classes.WaiterButton}
                onClick={this.waiterHandler}
              >
                <div className={classes.TopWaiter} />
                <div className={classes.BottomWaiter} />
                <div className={classes.TextWaiter}>
                  <span>Mozo</span>
                </div>
              </div>
            </div>
            <div className={classes.SetArea}>
              <div className={classes.SettingsCambiar}>
                <i
                  className="fas fa-exchange-alt"
                  onClick={this.changeTableHandler}
                />
                <span className={classes.ChangeTable}>Cambiar Mesa</span>
              </div>
              <div className={classes.SettingsUnir}>
                <i className="fas fa-table" onClick={this.joinTableHandler} />
                <span className={classes.UnirTable}>Unir Mesas</span>
              </div>
            </div>
            <div className={classes.Charge}>
              <ChargeButton execute={this.chargeHandler} />
            </div>
            <div className={classes.Exit}>
              <ExitButton backHandler={this.backHandler} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    Comanda: state.getDoc.Comanda,
    tableNumber: state.tablesList.tableNumber,
    mesaID: state.tablesList.mesaID,
    tablesList: state.tablesList,
    cajero: state.topBarState.firstData,
    firstTop: state.topBarState.firstTop, //DETALLES DE
    secondTop: state.topBarState.secondTop, //MESA  + NUM

    fourthTitle: state.topBarState.fourthTitle, //MOZO:
    fourthData: state.topBarState.fourthData, //NOMBRE DEL MOZO
    estadoRecargo:
      state.Recargos.Recargos.length > 0
        ? state.Recargos.Recargos[0].estado
        : null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetDocument: () => dispatch(getDocActions.getOrder()), //here pass table number
    onSetCheck: order => dispatch(getCheckActions.setOrder(order)), //here pass table number
    onSetMesaTitle: data => dispatch(topBarActions.setFirstTop(data)),
    onSetMesaData: mesa => dispatch(topBarActions.setSecondTop(mesa)),
    onSetMozoTitle: mozo => dispatch(topBarActions.setThirdTitle(mozo)),
    onSetMozoData: mesa => dispatch(topBarActions.setThirdData(mesa))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusMesas); // can pass null to mapState when needed
