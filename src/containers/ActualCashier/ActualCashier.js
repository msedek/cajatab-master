import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import _ from "underscore";
import ReactTooltip from "react-tooltip";
import cloneDeep from "lodash/cloneDeep";

import classes from "./ActualCashier.scss";
import ExitButton from "../../components/Buttons/ExitButton/ExitButton";
import ChargeButton from "../../components/Buttons/ChargeButton/ChargeButton";
import MonitorButton from "../../components/Buttons/MonitorButton/MonitorButton";

import MultiCheck from "./MultiCheck/MultiCheck";
import ComboBox from "../../components/ComboBoxSquare/ComboBox";
import * as getDocActions from "../../store/actions/index";
import * as topBarActions from "../../store/actions/index";

import {
  NOMBRE_EMISOR,
  NUM_DOC_EMISOR,
  TOKEN_URL,
  URL_SAVE_TOKE,
  EMISSION_URL,
  SERIE_PUNTO_EMISION_FACTURA,
  SERIE_PUNTO_EMISION_BOLETA,
  CORREO_GENERAL,
  AUTH,
  TOKEN_URL_LOCAL,
  MONTO_IGV,
  MONTO_RC,
  UNIDAD_MEDIDA,
  TIPO_DOC_EMISOR,
  TIPO_FORMATO_IMPRESO,
  URL_CORRELATIVOS,
  URL_DOCUMENTOS,
  URL_PRECUENTA,
  codAfectacionIgv,
  ALERTA_INTERNA,
  CLIENTE_GENERAL,
  APPLICATION_JSON,
  END_POINT
} from "../../configs/configs";

class ActualCashier extends Component {
  state = {
    checkSwitcher: "multiCheck",
    Screen: null,
    Operator: null,
    pOperator: false,
    firstOperator: null,
    endOper: false,
    isDot: false,
    didOperation: false,
    moreLessRator: false,
    valtoken: false,
    myData: {},
    dataDocumento: null,
    dataBoleta: null,
    access_token: null,
    dataDoc: [],
    chargeDocument: null,
    idCorrelativo: null,
    numCorrelativo: null,
    serieCorrelativo: null,
    updateSerie: "",
    gravadas: "",
    inafectas: "",
    exoneradas: "",
    recargo: "",
    igv: "",
    total: "",
    tipoDoc: "",
    numDocReceptor: "",
    nombreReceptor: "",
    direccionDestino: "",
    email: "",
    numCuenta: "",
    dataCuenta: [],
    workingOff: false,

    totalDescuentos: 0,
    descuentos: [],
    pagos: [],
    descuentoSeleccionado: null,
    pagoSeleccionado: null,
    pagoMixto: [],
    pagoMixtoState: false,
    montoTotalDeduccion: "50",
    montoTotalDeduccionClone: "",
    tipoMixto: "",
    topeDesc: false,
    porcDesc: 0,
    documentoClone: {},
    totalClone: "",
    igvClone: "",
    recargoClone: "",
    documento: {
      correoReceptor: "",
      descuento: {
        mntTotalDescuentos: 0
      },
      detalle: [],
      documento: {
        serie: "",
        mntExe: 0,
        mntExo: 0,
        mntNeto: 0,
        mntTotal: 0,
        tipoMoneda: "",
        correlativo: "",
        mntTotalIgv: 0,
        mntTotalIsc: 0,
        mntTotalOtros: 0,
        nombreEmisor: NOMBRE_EMISOR,
        numDocEmisor: NUM_DOC_EMISOR,
        tipoDocEmisor: TIPO_DOC_EMISOR,
        nombreReceptor: "",
        numDocReceptor: "",
        tipoDocReceptor: "",
        direccionDestino: "",
        tipoFormatoRepresentacionImpresa: TIPO_FORMATO_IMPRESO
      },
      fechaEmision: "",
      idTransaccion: "",
      impuesto: [],
      tipoDocumento: ""
    },
    referencia: "",
    pagoPosState: false,
    comboPagos: "PAGOS",
    comboSubPagos: "",
    fondoId: "",
    subMonto: "",
    borderAlertDescuento: "0px",
    borderAlertPagos: "0px",
    borderAlertSubPagos: "0px",
    borderRef: "0px",
    borderSubMonto: "0px",
    borderAddCuenta: "0px",
    cuentaAdded: false,
    mesa: "",
    ticketImpreso: [],
    tableCheck: {},
    canClean: true,
    checkValues: [],
    addEnabler: true,
    chargeEnabler: true,
    dataSubPago: [],
    docSent: false,
    canEmmit: false,
    otherOps: true,
    descVisible: true,
    consumoState: false,
    gratuitoState: false,
    inafectoState: false,
    opPassword: "",
    totalRef: 0,
    totalInafecta: 0,
    totalInterno: 0
  };

  numHandler = key => {
    if (this.state.endOper === false) {
      if (this.state.didOperation === false) {
        if (this.state.Screen === null) {
          if (key !== ".") {
            this.setState({ Screen: key });
          }
        } else {
          if (this.state.Screen === "0" && key !== ".") {
            this.setState({ Screen: key });
          } else {
            let cLength = this.state.Screen.toString().length;
            if (cLength <= 8) {
              let oldState = this.state.Screen;
              if (this.state.isDot === false) {
                if (key === ".") {
                  this.setState({
                    isDot: true,
                    Screen: oldState + key
                  });
                } else {
                  this.setState({ Screen: oldState + key });
                }
              } else {
                if (key !== ".") {
                  this.setState({ Screen: oldState + key });
                }
              }
            }
          }
        }
      } else {
        this.setState({
          Screen: key,
          isDot: false,
          didOperation: false,
          pOperator: true
        });
      }
    }
  };

  operatorHandler = key => {
    if (this.state.endOper === false) {
      if (this.state.pOperator === false && this.state.Screen !== null) {
        switch (key) {
          case "/":
            const char = String.fromCharCode;
            this.setState({
              Operator: char(0x00f7),
              firstOperator: this.state.Screen,
              didOperation: true
            });
            break;
          case "*":
            this.setState({
              Operator: "x",
              firstOperator: this.state.Screen,
              didOperation: true
            });
            break;
          default:
            this.setState({
              Operator: key,
              firstOperator: this.state.Screen,
              didOperation: true
            });
            break;
        }
      }
    }
  };

  equalHandler = () => {
    if (this.state.endOper === false && this.state.Operator !== null) {
      let operation = null;
      let oldFirt = null;
      let oldScreen = null;
      const char = String.fromCharCode;
      switch (this.state.Operator) {
        case "x":
          operation =
            parseFloat(this.state.firstOperator) *
            parseFloat(this.state.Screen);
          oldFirt = this.state.firstOperator;
          oldScreen = this.state.Screen;
          this.setState({ Screen: operation }, () => {
            this.setState({
              endOper: true,
              firstOperator: oldFirt + this.state.Operator + oldScreen
            });
          });
          break;
        case "-":
          operation =
            parseFloat(this.state.firstOperator) -
            parseFloat(this.state.Screen);
          oldFirt = this.state.firstOperator;
          oldScreen = this.state.Screen;
          this.setState({ Screen: operation }, () => {
            this.setState({
              endOper: true,
              firstOperator: oldFirt + this.state.Operator + oldScreen
            });
          });
          break;
        case char(0x00f7):
          operation =
            parseFloat(this.state.firstOperator) /
            parseFloat(this.state.Screen);
          if (operation.toString().length > 9) {
            operation = (
              parseFloat(this.state.firstOperator) /
              parseFloat(this.state.Screen)
            ).toFixed(6);
          }
          oldFirt = this.state.firstOperator;
          oldScreen = this.state.Screen;
          this.setState({ Screen: operation }, () => {
            this.setState({
              endOper: true,
              firstOperator: oldFirt + this.state.Operator + oldScreen
            });
          });
          break;
        default:
          operation =
            parseFloat(this.state.firstOperator) +
            parseFloat(this.state.Screen);
          oldFirt = this.state.firstOperator;
          oldScreen = this.state.Screen;
          this.setState({ Screen: operation }, () => {
            this.setState({
              endOper: true,
              firstOperator: oldFirt + this.state.Operator + oldScreen
            });
          });
          break;
      }
    }
  };

  clearHandler = () => {
    this.setState({
      Screen: null,
      Operator: null,
      pOperator: false,
      firstOperator: null,
      endOper: false,
      isDot: false,
      didOperation: false,
      moreLessRator: false
    });
  };

  moreLessHandler = () => {
    if (
      this.state.endOper === false &&
      this.state.Screen !== null &&
      this.state.Screen !== "0"
    ) {
      let oldMore = this.state.moreLessRator;
      let oldScreen = this.state.Screen;
      let sign = "-";
      if (oldMore === true) {
        sign = "";
        oldScreen = parseFloat(this.state.Screen) * -1;
      }
      this.setState({
        moreLessRator: !oldMore,
        Screen: sign + oldScreen
      });
    }
  };

  percentHandler = key => {
    // if()
  };

  goClear = () => {
    return new Promise((resolve, reject) => {
      axios
        .put(`${END_POINT}cleartable/${this.state.mesa}`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          resolve("done");
        })
        .catch(error => {
          reject(error.message); 
        });
    });
  };

  updateState = () => {
    return new Promise((resolve, reject) => {
      axios
        .put(`${END_POINT}updatestate/${this.state.mesa}`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          resolve("done");
        })
        .catch(error => {
          reject(error.message); 
        });
    });
  };

  netxCuentaHandler = async () => {
    if (!this.state.canClean) {
      const updateState = await this.updateState().catch(err => {
        console.log(err);
      });
      if (updateState) this.props.history.push("/maincashier");
    } else {
      const clearTable = await this.goClear().catch(err => console.log(err));
      if (clearTable) this.props.history.push("/maincashier");
    }
  };

  getToken = () => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          TOKEN_URL,
          {
            grant_type: "client_credentials"
          },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": APPLICATION_JSON,
              authorization: AUTH
            }
          }
        )
        .then(response => {
          resolve(response.data.access_token);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  getTokenLocal = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(TOKEN_URL_LOCAL, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            responseType: "json"
          }
        })
        .then(response => {
          this.props.onSaveToken(response.data[0].token);
          resolve(response.data[0].token);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  getCorrelative = config => {
    return new Promise((resolve, reject) => {
      axios
        .get(URL_CORRELATIVOS, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          let mySerie = "";
          let documentID = response.data[0]._id;

          mySerie = response.data[0].serieFactura.filter(el =>
            el.includes(config)
          );

          let precorrelativo = mySerie.pop();
          let correlative = {};

          const opt = precorrelativo.split("-");

          const updateSerie = opt[0];
          const correlativo = 1 + parseInt(opt[1], 10);
          correlative.correlativo = correlativo;
          correlative.documentID = documentID;
          correlative.updateSerie = updateSerie;
          resolve(correlative);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  };

  formatDate = date => {
    let month = date.getMonth() + 1; //months from 1-12
    if (month < 10) {
      month = "0" + month;
    }
    let day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    const year = date.getFullYear();
    return year + "-" + month + "-" + day;
  };

  setDocument = async (
    tipoDoc,
    serieEmision,
    nombreReceptor,
    numDocReceptor,
    correoReceptor,
    direccionDestino,
    chargeDocument
  ) => {
    let date = new Date();
    let formatedDate = this.formatDate(date);
    let fechaClean = formatedDate.replace(/-/g, "");

    let mntNeto = 0;
    let mntTotalOtros = 0;
    let mntTotal = 0;
    let mntTotalIgv = 0;
    let mntRc = 0;

    const TIPO_MONEDA = "PEN"; //TODO SETTING DEL RADIO ATRAS

    let correlativo;
    let updateSerie;
    let documentID;
    let correlaData;

    let ordenes;

    let recargoState;
    let igvState;
    let totalState;
    let tipoDocState = "";

    let nombreReceptorState = nombreReceptor;

    tipoDocState = chargeDocument.tipoDoc;
    correlaData = await this.getCorrelative(serieEmision);

    correlativo = correlaData.correlativo;
    updateSerie = correlaData.updateSerie;
    documentID = correlaData.documentID;

    ordenes = _.clone(this.state.myData.orders);

    let documento = _.clone(this.state.documento);

    let ticketImpreso = _.clone(this.state.ticketImpreso);

    let checks = {};

    let checkValues = [];
    ordenes.forEach((orden, i) => {
      let item = {};
      let itemToPrint = {};

      const check = `check${i}`;

      checks[check] = false;

      checkValues.push(check);

      let recargo = this.props.estadoRecargo ? 1.28 : 1.18;

      item.codItem = orden.item_id;
      itemToPrint.sku = orden.sku;
      item.montoItem = orden.precioTotal / recargo;
      itemToPrint.montoItem = item.montoItem;
      item.precioItemSinIgv = item.montoItem;
      itemToPrint.precioItemSinIgv = item.montoItem;
      item.tasaIgv = MONTO_IGV;
      item.montoIgv = item.montoItem * MONTO_IGV;
      item.nombreItem = orden.order;
      itemToPrint.nombreItem = orden.order;

      let precioIgv = item.montoItem * 1.18;

      mntTotalOtros =
        mntTotalOtros + this.props.estadoRecargo ? item.montoItem * 0.1 : 0;

      item.precioItem = parseFloat(precioIgv);

      item.cantidadItem = 1; //SIEMPRE CAJA DESGLOSA TODO EN CANTIDADES DE 1 EN EL CASO HUAYACHO VER PARA OTROS HARDCODEADO POR AHORA
      itemToPrint.cantidadItem = 1; //SIEMPRE CAJA DESGLOSA TODO EN CANTIDADES DE 1 EN EL CASO HUAYACHO VER PARA OTROS HARDCODEADO POR AHORA

      item.codAfectacionIgv = codAfectacionIgv;

      if (this.state.gratuitoState) {
        item.codAfectacionIgv = "21";
      } else if (this.state.inafectoState) {
        item.codAfectacionIgv = "20";
      } else if (this.state.consumoState) {
        // item.codAfectacionIgv = "20"
      }

      item.unidadMedidaItem = UNIDAD_MEDIDA;

      // if(this.state.gratuitoState) item.precioItemReferencia = item.montoItem;

      item.idOperacion =
        fechaClean +
        "-" +
        SERIE_PUNTO_EMISION_FACTURA +
        "-" +
        correlativo +
        "-" +
        1;
      documento.detalle.push(item);
      ticketImpreso.push(itemToPrint);
      mntNeto = mntNeto + item.montoItem;
    });

    mntTotalIgv = parseFloat((mntNeto * 0.18).toFixed(2));
    mntRc = this.props.estadoRecargo
      ? parseFloat((mntNeto * MONTO_RC).toFixed(2))
      : 0;
    mntTotal = mntNeto + mntNeto * 0.18 + mntRc; //ACA FALTA DESCUENTO GLOBAL

    const roundHalf = num => {
      return Math.round(num * 2) / 2;
    };

    mntTotal = roundHalf(mntTotal);

    if (numDocReceptor === "-") {
      tipoDoc = numDocReceptor;
    } else if (numDocReceptor.length === 8) {
      tipoDoc = "1";
    } else if (numDocReceptor.length === 11) {
      tipoDoc = "6";
    } else {
      tipoDoc = "A";
    }

    documento.documento = {
      serie: serieEmision,
      mntNeto: mntNeto,
      mntTotal: mntTotal,
      tipoMoneda: TIPO_MONEDA,
      correlativo: correlativo,
      mntTotalIgv: mntTotalIgv,
      nombreEmisor: NOMBRE_EMISOR,
      numDocEmisor: NUM_DOC_EMISOR,
      tipoDocEmisor: TIPO_DOC_EMISOR,
      nombreReceptor: nombreReceptor,
      numDocReceptor: numDocReceptor,
      tipoDocReceptor: tipoDoc,
      direccionDestino: direccionDestino,
      mntTotalOtros: parseFloat(mntTotalOtros.toFixed(2)),
      tipoFormatoRepresentacionImpresa: TIPO_FORMATO_IMPRESO
    };

    documento.impuesto.push({
      codImpuesto: "1000",
      tasaImpuesto: "0.18",
      montoImpuesto: mntTotalIgv
    });

    if (this.props.estadoRecargo)
      documento.impuesto.push({
        codImpuesto: "9999",
        tasaImpuesto: "0.10",
        montoImpuesto: mntRc
      });

    documento.fechaEmision = formatedDate;
    documento.tipoDocumento = chargeDocument.tipoDoc;
    documento.correoReceptor = correoReceptor;
    documento.idTransaccion =
      tipoDoc + "-" + NUM_DOC_EMISOR + "-" + fechaClean + "-" + correlativo;

    recargoState = mntRc;
    igvState = mntTotalIgv;
    totalState = mntTotal;

    this.setState({
      ...checks,
      checkValues: checkValues,
      documento: documento,
      documentoClone: cloneDeep(documento),
      idCorrelativo: documentID,
      numCorrelativo: correlativo,
      updateSerie: updateSerie,
      serieCorrelativo: serieEmision,
      gravadas: mntNeto,
      recargo: recargoState,
      recargoClone: cloneDeep(recargoState),
      igv: igvState,
      igvClone: cloneDeep(igvState),
      total: totalState,
      totalClone: cloneDeep(totalState),
      montoTotalDeduccion: totalState,
      montoTotalDeduccionClone: cloneDeep(totalState),
      tipoDoc: tipoDocState,
      numDocReceptor: numDocReceptor,
      nombreReceptor: nombreReceptorState,
      direccionDestino: direccionDestino,
      email: correoReceptor,
      ticketImpreso: ticketImpreso,
      canEmmit: true
    });
  };

  generateDocument = chargeDocument => {
    let nombreReceptor;
    let numDocReceptor;
    let correoReceptor;
    let direccionDestino;

    this.setState({ dataCuenta: chargeDocument.orders }, () => {
      nombreReceptor =
        chargeDocument.nombreReceptor !== ""
          ? chargeDocument.nombreReceptor
          : CLIENTE_GENERAL;
      numDocReceptor =
        chargeDocument.numDocReceptor !== ""
          ? chargeDocument.numDocReceptor
          : "-";
      correoReceptor =
        chargeDocument.email !== "" ? chargeDocument.email : CORREO_GENERAL;
      direccionDestino =
        this.state.myData.direccionDestino !== ""
          ? chargeDocument.direccionDestino
          : "-";

      if (chargeDocument.tipoDoc === "01") {
        //ACA ES FACTURA
        this.setDocument(
          "01",
          SERIE_PUNTO_EMISION_FACTURA,
          nombreReceptor,
          numDocReceptor,
          correoReceptor,
          direccionDestino,
          chargeDocument
        );
      } else {
        //ACA ES BOLETA
        this.setDocument(
          "03",
          SERIE_PUNTO_EMISION_BOLETA,
          nombreReceptor,
          numDocReceptor,
          correoReceptor,
          direccionDestino,
          chargeDocument
        );
      }
    });
  };

  setFirtstCheckHandler = () => {
    let dataDoc = [];
    if (this.props.checks.length > 0) {
      dataDoc = _.clone(this.props.checks);
      let firstCuenta = dataDoc.shift();
      this.setState(
        {
          checkSwitcher: firstCuenta.checkType,
          myData: firstCuenta,
          numCuenta: firstCuenta.numCuenta
        },
        () => {
          this.generateDocument(firstCuenta);
        }
      );
    }
  };

  getPagos = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${END_POINT}pagos/`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          if (response.data.length > 0) {
            this.setState({
              pagos: response.data
            });
            resolve("genera lista de pagos");
          } else {
            resolve("No hay metodos de pago registrados");
          }
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  getDescuentos = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${END_POINT}descuentos/`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          if (response.data.length > 0) {
            this.setState({
              descuentos: response.data
            });
            resolve("genera lista de descuentos");
          } else {
            resolve("No hay descuentos registrados");
          }
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  saveToken = token => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          URL_SAVE_TOKE,
          { token: token },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": APPLICATION_JSON
            }
          }
        )
        .then(response => {
          this.props.onSaveToken(response.data);
          resolve("done");
        })
        .catch(error => {
          reject(error.message); //TOMAR ACCIONES SI NO PUEDO TOAMR EL TOKEN
        });
    });
  };

  componentDidMount = async () => {
    if (this.props.checks.length !== 0) {
      this.setState({ mesa: this.props.mesaID });
      let descuentos = "";
      descuentos = await this.getDescuentos().catch(err => {
        alert(ALERTA_INTERNA);
        this.props.history.goBack();
      });
      if (descuentos) {
        let pagos = "";
        pagos = await this.getPagos().catch(err => {
          alert(ALERTA_INTERNA);
          this.props.history.goBack();
        });
        if (pagos) {
          let token = this.props.token;
          let localToken = "";
          if (token === "") {
            localToken = await this.getTokenLocal().catch(err =>
              alert(ALERTA_INTERNA)
            );
            if (localToken !== "") {
              this.setFirtstCheckHandler();
            } else {
              token = await this.getToken().catch(err => {
                alert(
                  `${err} Se trabajara sin Conexion al Sunat Advertir al cliente`
                );
                console.log(err);
                this.setState(
                  {
                    workingOff: true
                  },
                  () => this.setFirtstCheckHandler()
                );
              });
              if (token !== undefined) {
                await this.saveToken(token);
                this.props.onSaveToken(token);
                this.setFirtstCheckHandler();
              }
            }
          } else {
            this.setFirtstCheckHandler();
          }
        }
      }
    } else {
      this.props.history.goBack();
    }
  };

  facturActiva = (data, auth) => {
    return new Promise((resolve, reject) => {
      axios
        .post(EMISSION_URL, data, {
          headers: {
            CONTENT_TYPE: APPLICATION_JSON,
            Authorization: auth
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

  updateCorrela = (url, dataCorrelativo) => {
    return new Promise((resolve, reject) => {
      axios
        .put(url, dataCorrelativo, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": APPLICATION_JSON
          }
        })
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          console.log(error);
          reject(error.message);
        });
    });
  };

  descuentoHandler = (totalArticulo, itemPosition, value) => {
    let theCheck = _.clone(this.state[value]);

    if (this.state.descuentoSeleccionado === null) {
      alert("Seleccione tipo de descuento");
      this.setState({ [value]: false });
    } else {
      let forUncheck = cloneDeep(totalArticulo);

      let recargo = this.props.estadoRecargo ? 1.28 : 1.18;

      totalArticulo = parseFloat(totalArticulo / recargo).toFixed(6);

      let totalDescuentosUncheck = cloneDeep(this.state.totalDescuentos);
      let totalDescuentos = _.clone(this.state.totalDescuentos);
      let descuento = _.clone(this.state.descuentoSeleccionado);
      let maximo = parseFloat(descuento.maximo);

      let porcDesc = parseFloat(descuento.porcentaje) / 100;

      let descuentoCalculado =
        parseFloat(totalArticulo) * parseFloat(porcDesc.toFixed(6));
      const documento = _.clone(this.state.documento);

      let descuentoMonto = documento.detalle[itemPosition].descuentoMonto;
      let montoItem = documento.detalle[itemPosition].montoItem;
      let montoIgv = documento.detalle[itemPosition].montoIgv;
      let mntNeto = documento.documento.mntNeto;
      let mntTotalIgv = documento.documento.mntTotalIgv;
      let montoImpuesto = documento.impuesto[0].montoImpuesto;

      let montoImpuestoRC;

      montoImpuestoRC =
        documento.impuesto.length > 1
          ? documento.impuesto[1].montoImpuesto
          : 0.0;

      let mntTotal = documento.documento.mntTotal;
      let mntTotalOtros = documento.documento.mntTotalOtros;
      totalDescuentos = parseFloat(
        (totalDescuentos + parseFloat(descuentoCalculado.toFixed(6))).toFixed(6)
      );

      let precioItemSinIgv = documento.detalle[itemPosition].precioItemSinIgv;

      if (!theCheck) {
        if (!this.state.topeDesc) {
          if (totalDescuentos < maximo) {
            descuentoMonto = parseFloat(descuentoCalculado.toFixed(6));
            montoItem = montoItem - parseFloat(descuentoCalculado.toFixed(6));
            montoIgv = parseFloat((montoItem * 0.18).toFixed(6));
            mntNeto = parseFloat(
              (mntNeto - parseFloat(descuentoCalculado.toFixed(6))).toFixed(6)
            );
            mntTotalIgv = parseFloat((mntNeto * MONTO_IGV).toFixed(6));
            montoImpuesto = mntTotalIgv.toFixed(6);
            montoImpuestoRC = (mntNeto * MONTO_RC).toFixed(6);

            documento.descuento = {
              mntTotalDescuentos: totalDescuentos
            };

            mntTotal = parseFloat(
              (mntNeto + mntNeto * 0.18 + parseFloat(montoImpuestoRC)).toFixed(
                2
              )
            );
            mntTotalOtros = parseFloat(parseFloat(montoImpuestoRC).toFixed(6));

            const roundHalf = num => {
              return Math.round(num * 2) / 2;
            };

            mntTotal = roundHalf(mntTotal);

            let theCheck = _.clone(this.state[value]);

            documento.detalle[itemPosition].descuentoMonto = descuentoMonto;
            documento.detalle[itemPosition].montoItem = montoItem;
            documento.detalle[itemPosition].montoIgv = montoIgv;
            documento.documento.mntNeto = mntNeto;
            documento.documento.mntTotalIgv = mntTotalIgv;
            documento.impuesto[0].montoImpuesto = parseFloat(montoImpuesto);
            if (documento.impuesto.length > 1)
              documento.impuesto[1].montoImpuesto = parseFloat(montoImpuestoRC);

            documento.documento.mntTotal = mntTotal;
            documento.documento.mntTotalOtros = mntTotalOtros;

            this.setState({
              [value]: !theCheck,
              totalDescuentos: totalDescuentos,
              montoTotalDeduccion: mntTotal,
              documento: documento,
              porcDesc: porcDesc,
              total: mntTotal,
              igv: mntTotalIgv,
              recargo: montoImpuestoRC
            });
          } else {
            this.setState({
              topeDesc: true,
              [value]: false
            });
            alert("Se alcanzo el monto maximo del descuento");
          }
        } else {
          alert("Se alcanzo el monto maximo del descuento");
          this.setState({
            [value]: false
          });
        }
      } else {
        let desc = parseFloat(
          totalDescuentosUncheck - parseFloat(descuentoCalculado.toFixed(6))
        );
        desc < 1 ? (desc = 0) : (desc = parseFloat(desc.toFixed(6)));

        descuentoMonto = 0;

        montoItem = forUncheck;
        montoIgv = parseFloat((precioItemSinIgv * 0.18).toFixed(6));
        mntNeto = parseFloat(
          (mntNeto + parseFloat(descuentoCalculado.toFixed(6))).toFixed(6)
        );
        mntTotalIgv = parseFloat((mntNeto * MONTO_IGV).toFixed(6));
        montoImpuesto = parseFloat(mntTotalIgv.toFixed(6));
        montoImpuestoRC = parseFloat((mntNeto * MONTO_RC).toFixed(6));

        mntTotal = parseFloat(
          (mntNeto + mntNeto * 0.18 + montoImpuestoRC).toFixed(6)
        );
        mntTotalOtros = parseFloat(montoImpuestoRC.toFixed(6));

        const roundHalf = num => {
          return Math.round(num * 2) / 2;
        };

        mntTotal = roundHalf(mntTotal);

        documento.descuento = {
          mntTotalDescuentos: desc
        };

        documento.detalle[itemPosition].descuentoMonto = descuentoMonto;
        documento.detalle[itemPosition].montoItem = montoItem;
        documento.detalle[itemPosition].montoIgv = montoIgv;
        documento.documento.mntNeto = mntNeto;
        documento.documento.mntTotalIgv = mntTotalIgv;
        documento.impuesto[0].montoImpuesto = montoImpuesto;
        if (documento.impuesto.length > 1)
          documento.impuesto[1].montoImpuesto = montoImpuestoRC;
        documento.documento.mntTotal = mntTotal;
        documento.documento.mntTotalOtros = mntTotalOtros;

        this.setState({
          [value]: !theCheck,
          documento: documento,
          totalDescuentos: desc,
          topeDesc: false,
          montoTotalDeduccion: mntTotal,
          porcDesc: porcDesc,
          total: mntTotal,
          igv: mntTotalIgv,
          recargo: montoImpuestoRC
        });
      }
    }
  };

  markItemCharged = itemID => {
    return new Promise((resolve, reject) => {
      axios
        .put(
          `${END_POINT}chargeitem/${this.props.mesaID}`,
          { itemID: itemID },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": APPLICATION_JSON
            }
          }
        )
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  saveAndPrint = data => {
    const pago = {};
    let dataPago = [];
    if (this.state.comboPagos !== "MIXTO") {
      pago.tipoPago = this.state.comboPagos;
      pago.reference = this.state.referencia;
      pago.monto = this.state.total;
      pago.orderDetails = this.props.checks[0].orders;
      dataPago.push(pago);
    } else {
      dataPago = cloneDeep(this.state.dataSubPago);
    }

    data.dataPago = dataPago;
    data.ticketImpreso = this.state.ticketImpreso;
    data.empleado = this.props.empleadoName;
    data.fondoId = this.props.fondoId;

    data.opGratuita = false;
    if (this.state.gratuitoState) {
      data.opGratuita = true;
    }

    data.opInafecto = false;
    if (this.state.inafectoState) {
      data.opInafecto = true;
    }

    data.opConsumo = false;
    if (this.state.consumoState) {
      data.opConsumo = true;
    }

    data.goZoho = !this.state.workingOff;
    data.clientZoho = this.props.clientZoho;

    return new Promise((resolve, reject) => {
      axios
        .post(URL_DOCUMENTOS, data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": APPLICATION_JSON
          }
        })
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  processCorrela = async data => {
    let url = `${END_POINT}correlativos/${this.state.idCorrelativo}`;

    let dataCorrelativo = {
      serieFactura: [
        this.state.serieCorrelativo + "-" + this.state.numCorrelativo
      ]
    };
    const updateEido = await this.updateCorrela(url, dataCorrelativo).catch(
      err => console.log(err)
    );
    if (updateEido) {
      const process = await this.checkProcess(data).catch(err =>
        console.log(err)
      );
      if (process) {
        this.netxCuentaHandler();
      }
    }
  };

  checkProcess = data => {
    return new Promise(async (resolve, reject) => {
      let tableCheck;
      for (let i = 0; i < this.props.checks[0].orders.length; i++) {
        const order = this.props.checks[0].orders[i].orderID;
        let chargeItem;
        if (!this.props.checks[0].orders[i].cobrado)
          chargeItem = await this.markItemCharged(order).catch(err =>
            console.log(err)
          );
        if (chargeItem) {
          tableCheck = chargeItem;
        }
      }
      this.setState({ tableCheck: tableCheck }, async () => {
        let canClean = _.clone(this.state.canClean);
        this.state.tableCheck.orders.forEach(order => {
          if (order.cobrado === false) canClean = false;
        });
        const saveAndPrint = await this.saveAndPrint(data).catch(err =>
          console.log(err)
        );
        if (saveAndPrint) {
          this.setState({ canClean: canClean }, () => resolve("done"));
        }
      });
    });
  };

  validateFields = () => {
    const montoTotalDeduccion = parseFloat(
      cloneDeep(this.state.montoTotalDeduccion)
    );

    if (this.state.comboPagos === "PAGOS") {
      alert("Seleccione metodo de pago");
      this.setState({ borderAlertPagos: "2px" });
    } else if (
      this.state.comboPagos !== "EFECTIVO" &&
      this.state.comboPagos !== "MIXTO" &&
      this.state.referencia === "" &&
      this.state.pagoPosState
    ) {
      alert("Coloque referencia del pago");
      this.setState({ borderRef: "2px" });
    } else if (this.state.comboPagos === "MIXTO" && montoTotalDeduccion > 0) {
      if (this.state.comboSubPagos === "PAGOS") {
        alert("Seleccione metodo de pago");
        this.setState({ borderAlertSubPagos: "2px" });
      } else if (
        this.state.comboSubPagos !== "PAGOS" &&
        this.state.subMonto === ""
      ) {
        alert("Introduzca el monto a debitar de la cuenta");
        this.setState({ borderSubMonto: "2px" });
      } else if (this.state.comboSubPagos !== "") {
        alert("Debe agregar el pago");
        this.setState({ borderAddCuenta: "2px" });
      }
    } else if (this.state.docSent) {
      alert("Documento en proceso por favor espere");
    } else {
      this.setState({ docSent: true, canEmmit: false }, async () => {
        let data;
        let auth;

        data = cloneDeep(this.state.documento);

        let response = {};
        if (!this.state.workingOff) {
          auth = `Bearer ${this.props.token}`;
          response = await this.facturActiva(data, auth).catch(err => {
            console.log(err);
            // alert(`En este momento no se puede conectar a SUNAT ${err}`);
            this.setState({ workingOff: true }, () =>
              this.processCorrela(data)
            );
          });
          if (response !== undefined) {
            //FILTRAR LOS STATUS
            //FUE RECIBIDO POR FACTURACTIVA
            this.processCorrela(data);
          } else {
            //TOMAR DECISION DE LOS STATUS
          }
        } else {
          this.processCorrela(data);
        }
      });
    }
  };

  chargeHandler = async () => {
    if (this.state.canEmmit) {
      if (!this.state.descVisible && this.state.opPassword === "") {
        alert("Coloque el password");
      } else {
        let checkPass;
        if (!this.state.descVisible && this.state.opPassword !== "") {
          checkPass = await this.checkPass().catch(err => alert(err));

          if (checkPass) {
            if (checkPass === "codigo valido") {
              this.validateFields();
            } else {
              alert("Clave invalida");
            }
          }
        } else {
          this.validateFields();
        }
      }
    }
  };

  mainCashierHandler = () => {
    if (this.state.canEmmit) {
      this.props.onSetMesaData("");
      this.props.onSetMesaTitle("");
      this.props.onSetMozoData("");
      this.props.onSetMozoTitle("");
      this.props.history.push("/maincashier");
    }
  };

  backHandler = () => {
    if (this.state.canEmmit) {
      this.props.history.goBack();
    }
  };

  onClickComboHandler = (e, data, combo) => {
    if (this.state.canEmmit) {
      let desc = null;
      let pag = {};

      switch (combo) {
        case "descuentos":
          let documento = cloneDeep(this.state.documentoClone);
          let total = cloneDeep(this.state.totalClone);
          let igv = cloneDeep(this.state.igvClone);
          let recargo = cloneDeep(this.state.recargoClone);
          let montoTotalDeduccion = cloneDeep(
            this.state.montoTotalDeduccionClone
          );

          for (let i = 0; i < data.length; i++) {
            let descuento = data[i].descuento.toUpperCase();
            if (e.target.value.includes(descuento)) {
              desc = data[i];
              break;
            }
          }

          let minState = {};
          if (this.state.checkValues.length > 0) {
            Object.keys(this.state).forEach(key => {
              this.state.checkValues.forEach(value => {
                if (value === key) {
                  minState[key] = false;
                }
              });
            });
          }
          this.setState({
            ...minState,
            descuentoSeleccionado: desc,
            totalDescuentos: 0,
            documento: documento,
            total: total,
            igv: igv,
            recargo: recargo,
            montoTotalDeduccion: montoTotalDeduccion,
            porcDesc: 0,
            topeDesc: false,
            otherOps: false
          });
          break;
        default:
          for (let i = 0; i < data.length; i++) {
            let pago = data[i].pago.toUpperCase();
            if (pago === e.target.value) {
              pag = data[i];
              break;
            }
          }
          this.setState(
            {
              pagoSeleccionado: pag,
              comboPagos: e.target.value
            },
            () => {
              if (this.state.pagoSeleccionado.pago === "Mixto") {
                this.setState({
                  pagoMixtoState: true,
                  comboSubPagos: "PAGOS",
                  borderAddCuenta: "0px",
                  borderAlertPagos: "0px",
                  borderAlertSubPagos: "0px",
                  borderRef: "0px",
                  borderSubMonto: "0px",
                  pagoPosState: false,
                  dataPago: [],
                  dataSubPago: []
                });
              } else if (this.state.pagoSeleccionado.pago !== "Efectivo") {
                this.setState({
                  pagoPosState: true,
                  pagoMixto: [],
                  pagoMixtoState: false,
                  montoDeducir: "",
                  montoTotalDeduccion: this.state.total,
                  tipoMixto: "",
                  subMonto: "",
                  comboSubPagos: "",
                  addEnabler: true,
                  borderAddCuenta: "0px",
                  borderAlertPagos: "0px",
                  borderAlertSubPagos: "0px",
                  borderRef: "0px",
                  borderSubMonto: "0px",
                  dataPago: [],
                  dataSubPago: []
                });
              } else {
                this.setState({
                  pagoMixto: [],
                  pagoMixtoState: false,
                  pagoPosState: false,
                  montoDeducir: "",
                  montoTotalDeduccion: this.state.total,
                  tipoMixto: "",
                  subMonto: "",
                  comboSubPagos: "",
                  addEnabler: true,
                  borderAddCuenta: "0px",
                  borderAlertPagos: "0px",
                  borderAlertSubPagos: "0px",
                  borderRef: "0px",
                  borderSubMonto: "0px",
                  dataPago: [],
                  dataSubPago: []
                });
              }
            }
          );
          break;
      }
    }
  };

  onClickComboHandler2 = e => {
    if (e.target.value !== "EFECTIVO") {
      this.setState({
        pagoPosState: true,
        borderAlertSubPagos: "0px"
      });
    } else {
      this.setState({
        pagoPosState: false,
        borderAlertSubPagos: "0px"
      });
    }
    this.setState({
      comboSubPagos: e.target.value,
      borderAlertSubPagos: "0px"
    });
  };

  typeHandler = i => {
    switch (i.target.name) {
      case "monto":
        this.setState({
          subMonto: i.target.value,
          borderSubMonto: "0px"
        });
        break;
      case "referencia":
        this.setState({
          referencia: i.target.value,
          borderRef: "0px"
        });
        break;
      case "password":
        this.setState({
          opPassword: i.target.value,
          borderRef: "0px"
        });
        break;
      default:
        break;
    }
  };

  addPagoHandler = () => {
    let subMonto = parseFloat(cloneDeep(this.state.subMonto));
    let referencia = cloneDeep(this.state.referencia);
    let comboSubPagos = cloneDeep(this.state.comboSubPagos);
    let montoTotalDeduccion = parseFloat(
      cloneDeep(this.state.montoTotalDeduccion)
    );

    if (this.state.addEnabler) {
      if (subMonto > 0) {
        let subTotal = montoTotalDeduccion - subMonto;

        if (comboSubPagos !== "PAGOS") {
          if (subTotal < 0) {
            alert("Monto a deducir es superio al total de la cuenta");
          } else if (subTotal === 0) {
            alert("No queda saldo por deducir presione Cobrar");

            let dataSubPago = cloneDeep(this.state.dataSubPago);
            const dataPago = {};
            dataPago.tipoPago = this.state.comboSubPagos; //PASAR UN COVERTIDOR ACA DE REQUERIRLO ZOHO
            dataPago.reference = this.state.referencia;
            dataPago.monto = subMonto;
            dataSubPago.push(dataPago);

            this.setState({
              addEnabler: false,
              montoTotalDeduccion: subTotal.toFixed(2),
              referencia: "",
              subMonto: "",
              comboSubPagos: "PAGOS",
              borderAddCuenta: "0px",
              pagoPosState: false,
              dataSubPago: dataSubPago
            });
          } else if (
            comboSubPagos !== "EFECTIVO" &&
            referencia === "" &&
            this.state.pagoPosState
          ) {
            alert("Coloque referencia del pago");
            this.setState({ borderRef: "2px" });
          } else {
            let dataSubPago = cloneDeep(this.state.dataSubPago);

            const dataPago = {};
            dataPago.tipoPago = this.state.comboSubPagos;
            dataPago.reference = this.state.referencia;
            dataPago.monto = subMonto;
            dataSubPago.push(dataPago);

            this.setState({
              montoTotalDeduccion: subTotal.toFixed(2),
              referencia: "",
              subMonto: "",
              comboSubPagos: "PAGOS",
              borderAddCuenta: "0px",
              pagoPosState: false,
              dataSubPago: dataSubPago
            });
          }
        } else {
          alert("Seleccione metodo de pago");
          this.setState({ borderAlertSubPagos: "2px" });
        }
      } else {
        alert("Debe ingresar un monto mayor a 0");
      }
    }
  };

  precuentaHandler = async () => {
    if (!this.state.docSent) {
      const preCuenta = await this.printPrecuenta().catch(err =>
        alert(ALERTA_INTERNA)
      );
      if (preCuenta) this.props.history.push("/maincashier");
    }
  };

  printPrecuenta = () => {
    let data = {};
    data = cloneDeep(this.state.documento);
    data.ticketImpreso = cloneDeep(this.state.ticketImpreso);
    data.mesa = this.props.tableNumber;
    data.mesaID = this.props.mesaID;

    return new Promise((resolve, reject) => {
      axios
        .post(URL_PRECUENTA, data, {
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

  keyPressHandler = (keyboard, origen) => {
    switch (origen) {
      case "pre":
        if (keyboard.charCode === 13) {
          this.precuentaHandler();
        }
        break;
      case "charge":
        if (keyboard.charCode === 13) {
          this.chargeHandler();
        }
        break;
      default:
        break;
    }
  };

  typosConsumoHandler = async e => {
    let documento = cloneDeep(this.state.documentoClone);
    switch (e) {
      case "interno":
        this.setState({
          consumoState: true,
          gratuitoState: false,
          inafectoState: false,
          descVisible: false
        });
        break;
      case "gratuito":
        let mntTotalGrat = 0;

        documento.detalle.forEach(element => {
          element.codAfectacionIgv = "21";
          element.precioItemReferencia = cloneDeep(element.precioItemSinIgv);
          element.montoIgv = 0;
          element.montoItem = 0;
          element.precioItem = 0;
          element.precioItemSinIgv = 0;
          mntTotalGrat = mntTotalGrat + element.precioItemReferencia;
        });

        documento.impuesto.forEach(element => {
          element.montoImpuesto = 0;
        });

        documento.documento.mntTotal = 0;
        documento.documento.mntTotalGrat = mntTotalGrat;
        documento.documento.mntTotalIgv = 0;

        await this.setState({
          consumoState: false,
          gratuitoState: true,
          inafectoState: false,
          descVisible: false,
          documento: documento,
          totalRef: mntTotalGrat,
          totalInafecta: 0,
          totalInterno: 0
        });

        break;
      case "inafecto":
        let totalInafecta = 0;

        documento.detalle.forEach(element => {
          element.codAfectacionIgv = "20";
          element.montoIgv = 0;
          element.precioItem = element.precioItemSinIgv;
          totalInafecta = totalInafecta + element.precioItemSinIgv;
        });

        documento.impuesto.forEach(element => {
          element.montoImpuesto = 0;
        });

        documento.documento.mntTotal = documento.documento.mntNeto;
        documento.documento.mntExo = documento.documento.mntNeto;
        documento.documento.mntTotalIgv = 0;

        this.setState({
          consumoState: false,
          gratuitoState: false,
          inafectoState: true,
          descVisible: false,
          documento: documento,
          totalInafecta: totalInafecta,
          totalRef: 0,
          totalInterno: 0
        });
        break;
      default:
        break;
    }
  };

  checkPass = () => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${END_POINT}checkpass`,
          { pass: this.state.opPassword },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": APPLICATION_JSON
            }
          }
        )
        .then(response => {
          resolve(response.data.sms);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  render() {
    const char = String.fromCharCode;
    let mixtoView = "";
    if (this.state.pagoMixtoState) {
      mixtoView = (
        <div className={classes.MixtoContainer}>
          <div className={classes.Mixtos}>
            <ComboBox
              text={this.state.pagos}
              origen={"mixto"}
              comboSelection={this.state.comboSubPagos}
              hidden={this.state.comboSubPagos}
              onClickComboHandler2={this.onClickComboHandler2}
              confBorder={this.state.borderAlertSubPagos}
            />
          </div>
          <div className={classes.TextBox}>
            <span className={classes.Tmonto}>Monto</span>
            <input
              style={{
                border: `${this.state.borderSubMonto} solid red`
              }}
              tabIndex={3}
              className={classes.MontoBox}
              type="number"
              name="monto"
              id="monto"
              value={this.state.subMonto}
              onChange={this.typeHandler}
            />
            <div
              className={classes.AddButton}
              style={{
                border: `${this.state.borderAddCuenta} solid red`
              }}
            >
              <i className="fas fa-plus-square" onClick={this.addPagoHandler} />
            </div>
          </div>
          <span className={classes.SubTotal}>
            {"Restante S/. " + this.state.montoTotalDeduccion}
          </span>
        </div>
      );
    }

    let posView = "";
    if (this.state.pagoPosState) {
      posView = (
        <div className={classes.ReferenciaContainer}>
          <input
            style={{
              border: `${this.state.borderRef} solid red`
            }}
            tabIndex={4}
            className={classes.MontoBox}
            placeholder={"Nro. Referencia"}
            type="text"
            name="referencia"
            id="referencia"
            value={this.state.referencia}
            onChange={this.typeHandler}
          />
        </div>
      );
    }

    let minState = {};
    if (this.state.checkValues.length > 0) {
      Object.keys(this.state).forEach((key, i) => {
        this.state.checkValues.forEach((value, j) => {
          if (value === key) {
            minState[key] = this.state[key];
          }
        });
      });
    }

    return (
      <div className={classes.SupraContainer}>
        <ReactTooltip />
        <div className={classes.ContainerButtons}>
          <div className={classes.Changer}>
            <MultiCheck
              values={minState}
              dataCuenta={this.state.dataCuenta}
              buttonVisible={this.state.checkSwitcher}
              gravadas={this.state.gravadas}
              inafectas={this.state.totalInafecta}
              exoneradas={this.state.totalInterno}
              totalReferencial={this.state.totalRef}
              recargo={this.state.recargo}
              igv={this.state.igv}
              total={this.state.total}
              tipoDoc={this.state.tipoDoc}
              gratuito={this.state.gratuitoState}
              numDocReceptor={this.state.numDocReceptor}
              nombreReceptor={this.state.nombreReceptor}
              direccionDestino={this.state.direccionDestino}
              email={this.state.email}
              numCuenta={this.state.numCuenta}
              descuentoHandler={this.descuentoHandler}
              totalDescuentos={this.state.totalDescuentos}
              montoTotalDeduccion={this.state.montoTotalDeduccion}
            />
          </div>
          <div className={classes.Buttons}>
            <div className={classes.Precuenta}>
              <i
                tabIndex={5}
                className="far fa-money-bill-alt"
                onClick={this.precuentaHandler}
                onKeyPress={k => this.keyPressHandler(k, "pre")}
                style={{
                  color: "#9ec446",
                  fontSize: "2.2rem"
                }}
              />
              <span className={classes.PreText}>Precuenta</span>
            </div>
            <div
              className={classes.Charge}
              data-tip={this.state.canEmmit ? "" : "Por favor Espere"}
            >
              <ChargeButton
                kPress={k => this.keyPressHandler(k, "charge")}
                tIndex={6}
                execute={this.chargeHandler}
              />
            </div>
            <div
              className={classes.Exit}
              data-tip={this.state.canEmmit ? "" : "Por favor Espere"}
            >
              <ExitButton backHandler={this.backHandler} />
            </div>
            <div
              className={classes.Monitor}
              data-tip={this.state.canEmmit ? "" : "Por favor Espere"}
            >
              <MonitorButton backHandler={this.mainCashierHandler} />
            </div>
          </div>
        </div>
        <div className={classes.ContainerCashier}>
          <div className={classes.PaymentTypeContainer}>
            <div className={classes.PaymentsContainer}>
              <div className={classes.Title}>Opciones de Pago</div>
              <div
                className={classes.Descuentos}
                data-tip={this.state.canEmmit ? "" : "Por favor Espere"}
              >
                {this.state.descVisible ? (
                  <ComboBox
                    disabled={!this.state.canEmmit}
                    text={this.state.descuentos}
                    origen={"descuentos"}
                    onClickComboHandler={this.onClickComboHandler}
                    confBorder={this.state.borderAlertDescuento}
                  />
                ) : (
                  ""
                )}
              </div>
              <div
                className={classes.Pagos}
                data-tip={this.state.canEmmit ? "" : "Por favor Espere"}
              >
                <ComboBox
                  disabled={!this.state.canEmmit}
                  text={this.state.pagos}
                  origen={"pagos"}
                  hidden={this.state.comboPagos}
                  onClickComboHandler={this.onClickComboHandler}
                  confBorder={this.state.borderAlertPagos}
                />
              </div>
              {mixtoView}
              {posView}
            </div>
          </div>
          <div className={classes.CalcContainer}>
            <div className={classes.CalcuFrame}>
              <div className={classes.Calc}>
                <div className={classes.ScreenPiece}>
                  <div className={classes.Operator}>{this.state.Operator}</div>
                  <div className={classes.Number}>{this.state.Screen}</div>
                  <div className={classes.FirstOper}>
                    {this.state.firstOperator}
                  </div>
                </div>
                <div
                  className={classes.ClearScreen}
                  onClick={this.clearHandler}
                >
                  C
                </div>
                <div
                  className={classes.MoreLess}
                  onClick={this.moreLessHandler}
                >
                  +/-
                </div>
                <div
                  className={classes.Percentage}
                  onClick={() => this.percentHandler("%")}
                >
                  %
                </div>
                <div
                  className={classes.Divition}
                  onClick={() => this.operatorHandler("/")}
                >
                  {char(0x00f7)}
                </div>
                <div
                  className={classes.Seven}
                  onClick={() => this.numHandler("7")}
                >
                  7
                </div>
                <div
                  className={classes.Eight}
                  onClick={() => this.numHandler("8")}
                >
                  8
                </div>
                <div
                  className={classes.Nine}
                  onClick={() => this.numHandler("9")}
                >
                  9
                </div>
                <div
                  className={classes.Multiplication}
                  onClick={() => this.operatorHandler("*")}
                >
                  X
                </div>
                <div
                  className={classes.Four}
                  onClick={() => this.numHandler("4")}
                >
                  4
                </div>
                <div
                  className={classes.Five}
                  onClick={() => this.numHandler("5")}
                >
                  5
                </div>
                <div
                  className={classes.Six}
                  onClick={() => this.numHandler("6")}
                >
                  6
                </div>
                <div
                  className={classes.Substraction}
                  onClick={() => this.operatorHandler("-")}
                >
                  _
                </div>
                <div
                  className={classes.One}
                  onClick={() => this.numHandler("1")}
                >
                  1
                </div>
                <div
                  className={classes.Two}
                  onClick={() => this.numHandler("2")}
                >
                  2
                </div>
                <div
                  className={classes.Three}
                  onClick={() => this.numHandler("3")}
                >
                  3
                </div>
                <div
                  className={classes.Sum}
                  onClick={() => this.operatorHandler("+")}
                >
                  +
                </div>
                <div
                  className={classes.Cero}
                  onClick={() => this.numHandler("0")}
                >
                  0
                </div>
                <div
                  className={classes.Dot}
                  onClick={() => this.numHandler(".")}
                >
                  .
                </div>
                <div className={classes.Equal} onClick={this.equalHandler}>
                  =
                </div>
              </div>
            </div>

            {this.state.otherOps ? (
              <div className={classes.MoreControls}>
                {/* <div className={classes.ConsumoInterno}>
                  <input
                    style={{ marginRight: "5px" }}
                    type="checkbox"
                    name="interno"
                    id="interno"
                    onChange={() => this.typosConsumoHandler("interno")}
                    checked={this.state.consumoState}
                  />
                  <label htmlFor={"interno"}>Consumo Interno</label>
                </div> */}
                <div>
                  <input
                    style={{ marginRight: "5px" }}
                    id="gratuito"
                    type="checkbox"
                    name="gratuito"
                    onChange={() => this.typosConsumoHandler("gratuito")}
                    checked={this.state.gratuitoState}
                  />
                  <label htmlFor={"gratuito"}>Invitacion</label>
                </div>
                <div>
                  <input
                    style={{ marginRight: "5px" }}
                    id="inafecto"
                    type="checkbox"
                    name="inafecto"
                    onChange={() => this.typosConsumoHandler("inafecto")}
                    checked={this.state.inafectoState}
                  />
                  <label htmlFor={"inafecto"}>Inafecto</label>
                </div>

                <input
                  className={classes.Password}
                  type={"password"}
                  name="password"
                  placeholder="Password"
                  value={this.state.passWord}
                  onChange={this.typeHandler}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    checks: state.finalChecks.checks,
    empleadoName: state.topBarState.firstData,
    clientZoho: state.topBarState.clientZoho,
    fondoId: state.topBarState.fondoId,
    token: state.topBarState.token,
    mesaID: state.tablesList.mesaID,
    tableNumber: state.tablesList.tableNumber,
    estadoRecargo:
      state.Recargos.Recargos.length > 0
        ? state.Recargos.Recargos[0].estado
        : null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetDocument: () => dispatch(getDocActions.getOrder()),
    onSetMesaTitle: data => dispatch(topBarActions.setFirstTop(data)),
    onSetMesaData: mesa => dispatch(topBarActions.setSecondTop(mesa)),
    onSetMozoTitle: mesa => dispatch(topBarActions.setThirdTitle(mesa)),
    onSetMozoData: mozo => dispatch(topBarActions.setThirdData(mozo)),
    onSaveToken: token => dispatch(topBarActions.saveToken(token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActualCashier);
