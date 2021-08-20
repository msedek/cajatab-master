import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import _ from "underscore";

import classes from "./MultiCheck.scss";
import MultiButton from "../../../components/Buttons/MultiButton/MultiButton";
import * as passItemToCheckAction from "../../../store/actions/index";
import * as passItemToListAction from "../../../store/actions/index";
import * as fillCheckActions from "../../../store/actions/index";
import { validateEmail } from "../../../utils/emailValidator";

class MultiCheck extends Component {
  state = {
    list: [],
    fromList: [],
    checks: [],
    numCuenta: 0,
    total: "0",
    lastCheck: false,
    data: {
      numDocReceptor: "",
      nombreReceptor: "",
      email: "",
      direccionDestino: ""
    },
    order: [],
    boletaState: true,
    facturaState: false,
    tipoId: "ID"
  };

  singleRadioChangeHandler = e => {
    let newStateBoleta = this.state.boletaState;
    let data = _.clone(this.state.data);
    data.tipoDoc = "03";
    if (e.currentTarget.name.toLowerCase() === "boleta") {
      this.setState({
        boletaState: !newStateBoleta,
        facturaState: newStateBoleta,
        tipoId: "ID",
        data: data
      });
    } else {
      let newStateBoleta = this.state.boletaState;
      let data = _.clone(this.state.data);
      data.tipoDoc = "01";
      this.setState({
        boletaState: !newStateBoleta,
        facturaState: newStateBoleta,
        tipoId: "RUC",
        data: data
      });
    }
  };

  componentWillUnmount() {
    this.setState({
      boleta: true,
      factura: false,
      list: [],
      total: "0",
      fromList: [],
      data: {
        numDocReceptor: "",
        nombreReceptor: "",
        mail: "",
        direccionDestino: ""
      },
      order: []
    });
  }

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

  componentDidUpdate() {
    if (this.props.subCheckList !== null) {
      let row = this.createRow(this.props.subCheckList);
      this.props.onPassItemToCheck(null); //block control
      let prep = this.state.fromList.slice(0);
      let list = prep.concat(row);
      list.sort((a, b) => parseFloat(a.key) - parseFloat(b.key));
      this.setState({
        fromList: list
      });
    }
  }

  componentDidMount() {
    this.setState({
      order: this.props.order
    });
  }

  createRow = item => {
    let trow = [];
    let key = item.key;
    let nombreArticulo = item.props.children[0].props.children;
    let totalArticulo = item.props.children[3].props.children;
    let total = parseFloat(JSON.parse(JSON.stringify(this.state.total)));

    total = total + parseFloat(totalArticulo);

    trow.push(
      <tr key={key}>
        <td
          onClick={e => this.itemHandler(key, item, e)}
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
    this.setState({
      total: total.toFixed(2)
    });
    return trow;
  };

  itemHandler = (key, item) => {
    let deleteRow = _.clone(this.state.fromList);
    let del = deleteRow.filter(el => el.key !== key);
    let total = _.clone(this.state.total);

    total = total - parseFloat(item.props.children[3].props.children);

    this.setState(
      {
        fromList: del,
        total: total.toFixed(2)
      },
      () => {
        let currentList = _.clone(this.props.checkList).concat(item);
        currentList.sort((a, b) => parseFloat(a.key) - parseFloat(b.key));
        this.props.onPassItemToList(currentList);
      }
    );
  };

  setUpBoleta = subOrder => {
    let data = _.clone(this.state.data);
    let dataToPass = _.clone(this.state.checks);

    let email = _.clone(this.state.data.email);

    let validate = true;
    if (email !== "") validate = validateEmail(email);

    if (validate) {
      data.tipoDoc = "03";
      data.nombreReceptor = this.state.data.nombreReceptor;
      data.numDocReceptor = this.state.data.numDocReceptor;
      data.email = this.state.data.email;
      data.direccionDestino = this.state.data.direccionDestino;
      data.numCuenta = _.clone(this.state.numCuenta) + 1;
      data.checkType = "multiCheck";

      data.orders = subOrder;
      dataToPass.push(data);

      let lastCheck = parseFloat(this.props.total) === 0;
      this.props.nextCheckHandler(_.clone(data));
      this.setState(
        {
          checks: dataToPass,
          fromList: [],
          total: "0",
          numCuenta: data.numCuenta,
          lastCheck: lastCheck,
          data: {
            numDocReceptor: "",
            nombreReceptor: "",
            email: "",
            direccionDestino: ""
          },
          boletaState: true,
          facturaState: false
        },
        () => {
          this.props.onFillChecks(dataToPass);
          this.props.navigator.push("/actualcashier");
        }
      );
    } else {
      alert("Coloco email no valido");
    }
  };

  setUpFactura = subOrder => {
    let data = _.clone(this.state.data);

    let dataToPass = _.clone(this.state.checks);

    let email = _.clone(this.state.data.email);

    email = validateEmail(email);

    if (email) {
      data.tipoDoc = "01";
      data.nombreReceptor = this.state.data.nombreReceptor;
      data.numDocReceptor = this.state.data.numDocReceptor;
      data.email = this.state.data.email;
      data.direccionDestino = this.state.data.direccionDestino;
      data.numCuenta = this.state.numCuenta + 1; //ACTUALIZAR NUM CUENTA
      data.checkType = "multiCheck";

      data.orders = subOrder;
      dataToPass.push(data);

      let lastCheck = parseFloat(this.props.total) === 0;
      this.props.nextCheckHandler(_.clone(data));
      this.setState(
        {
          checks: dataToPass,
          fromList: [],
          total: "0",
          numCuenta: data.numCuenta,
          lastCheck: lastCheck,
          data: {
            numDocReceptor: "",
            nombreReceptor: "",
            email: "",
            direccionDestino: ""
          },
          boletaState: true,
          facturaState: false
        },
        () => {
          this.props.onFillChecks(dataToPass);
          this.props.navigator.push("/actualcashier");
        }
      );
    } else {
      alert("Coloco email no valido");
    }
  };

  prepareSubOrder = () => {
    let rows = _.clone(this.state.fromList);
    let subOrder = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      for (let j = 0; j < this.props.order.length; j++) {
        const orden = this.props.order[j];
        if (orden.key === row.key) {
          subOrder.push(orden);
          break;
        }
      }
    }
    return subOrder;
  };

  nextHandler = () => {
    this.props.setMultiTotal(parseFloat(this.props.total));
    if (parseFloat(this.props.total) === 0) {
      if (this.state.fromList.length > 0) {
        let subOrder = this.prepareSubOrder();
        if (this.state.boletaState) {
          this.setUpBoleta(subOrder);
        } else {
          this.invoiceChecker(subOrder);
        }
      }
    } else {
      if (this.state.fromList.length > 0) {
        //SIGUEN QUEDANDO ITEMS
        let subOrder = this.prepareSubOrder();
        if (this.state.boletaState) {
          let sum = parseFloat(this.props.total);
          let percent = sum * 0.28;
          if (sum + percent >= 700 && this.state.data.numDocReceptor === "") {
            alert(
              "Debe agregar identificacion a boleta con monto mayor a S/.700"
            );
          } else {
            this.setUpBoleta(subOrder);
          }
        } else {
          this.invoiceChecker(subOrder);
        }
      } else {
        alert("No ha seleccionado articulo de la cuenta");
      }
    }
  };

  invoiceChecker = subOrder => {
    if (this.state.data.numDocReceptor === "") {
      alert("Debe completar el campo RUC");
    } else if (this.state.data.nombreReceptor === "") {
      alert("Debe completar el campo Nombre");
    } else if (this.state.data.direccionDestino === "") {
      alert("Debe completar el campo Direccion");
    } else if (this.state.data.email === "") {
      alert("Debe completar el campo Email");
    } else {
      this.setUpFactura(subOrder);
    }
  };

  buscarRucHandler = () => {
    if (_.isEmpty(this.state.data)) {
      alert("No se ha agregado items a la cuenta");
    } else {
      if (this.state.facturaState) {
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
              .then(response => {
                let dataRec = response.data.pop();
                let data = _.clone(this.state.data);
                data.direccionDestino =
                  dataRec.nombreVia + " " + dataRec.numero;
                data.nombreReceptor = dataRec.nRazonSocial;
                this.setState({
                  data: data
                });
              })
              .catch(error => {
                alert("NO SE PUEDE CONECTAR A LA RED INGRESE DATOS MANUALES");
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
    }
  };

  render() {
    let cuenta = this.state.numCuenta + 1;
    return (
      <div className={classes.Container}>
        <div className={classes.ListContainer}>
          <div className={classes.Title}>
            <div className={classes.NumCuenta}>{`CUENTA ${cuenta}`}</div>
            <div className={classes.BreakLine} />
          </div>
          <div className={classes.Content}>
            <table
              className={classes.TableContent}
              cellSpacing="0"
              cellPadding="2"
              style={{
                width: "100%"
              }}
            >
              <tbody>{this.state.fromList}</tbody>
            </table>
          </div>
          <div className={classes.Totals}>
            <div className={classes.TotalLabel}>TOTAL</div>
            <div className={classes.TotalPrice}>{`S/ ${this.state.total}`}</div>
          </div>
        </div>
        <div className={classes.TypeDocumentContainer}>
          <div className={classes.Radios}>
            <label className={classes.Factura} htmlFor="factura">
              FACTURA
            </label>
            <input
              className={classes.FactStyle}
              checked={this.state.facturaState}
              onChange={e => this.singleRadioChangeHandler(e)}
              type="radio"
              name="Factura"
              id="factura"
            />
            <label className={classes.Boleta} htmlFor="boleta">
              BOLETA
            </label>
            <input
              checked={this.state.boletaState}
              onChange={e => this.singleRadioChangeHandler(e)}
              className={classes.BolStyle}
              type="radio"
              name="Boleta"
              id="boleta"
            />
          </div>
        </div>
        <div className={classes.RucContainer}>
          <div className={classes.Ruc}>
            <div className={classes.Label}>{this.state.tipoId}</div>
          </div>
          <input
            className={classes.NumRuc}
            type="number"
            name="clientId"
            onChange={e => this.textHandler(e)}
            value={this.state.data.numDocReceptor}
          />
          <button className={classes.BuscarRuc} onClick={this.buscarRucHandler}>
            BUSCAR
          </button>
        </div>
        <div className={classes.NameContainer}>
          <div className={classes.Name}>
            <div className={classes.LabelName}>NOMBRE</div>
          </div>
          <input
            className={classes.ActualName}
            type="text"
            name="nombre"
            onChange={e => this.textHandler(e)}
            value={this.state.data.nombreReceptor}
          />
        </div>
        <div className={classes.DirectionContainer}>
          <div className={classes.Dir}>
            <div className={classes.LabelDir}>DIRECCION</div>
          </div>
          <input
            className={classes.ActualDir}
            type="text"
            name="direccion"
            onChange={e => this.textHandler(e)}
            value={this.state.data.direccionDestino}
          />
        </div>
        <div className={classes.emailContainer}>
          <div className={classes.mail}>
            <div className={classes.LabelMail}>E-MAIL</div>
          </div>
          <input
            className={classes.email}
            type="email"
            placeholder="alejandra@ejemplo.com"
            name="correo"
            onChange={e => this.textHandler(e)}
            value={this.state.data.email}
          />
        </div>
        <div className={classes.ButtonContainer}>
          <div className={classes.ButtWrapper}>
            <MultiButton
              multiBackColor={"#485923"}
              multiWidth={"8rem"}
              multiBorderRad={"10px"}
              textMultiButton={"SUB-CUENTA"}
              clicked={this.nextHandler}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    checkList: state.ItemBack.ItemBack,
    subCheckList: state.Item.Item,
    indexCheck: state.indexCheck.indexCheck,
    indexSubCheck: state.indexSubCheck.indexSubCheck
    //CONFIGURAR EL TOTBAR
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPassItemToCheck: item => {
      dispatch(passItemToCheckAction.passItemToCheck(item));
    },
    onPassItemToList: itemBack => {
      dispatch(passItemToListAction.passItemToList(itemBack));
    },
    onFillChecks: checks => {
      dispatch(fillCheckActions.fillChecks(checks));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MultiCheck);
