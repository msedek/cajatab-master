import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "underscore";
import lo from "lodash";
import axios from "axios";
import FileSaver from "file-saver";

import classes from "./CashierRegister.scss";
import Triangle from "../../components/Triangle/Triangle";
import Totalizator from "../../components/Totalizator/Totalizator";
import ExitButton from "../../components//Buttons/ExitButton/ExitButton";
import * as topBarActions from "../../store/actions/index";
import moment from "moment-timezone";
import uniqid from "uniqid";

import {
  END_POINT,
  END_POINT_CIERRE,
  RESUMEN_VENTA
} from "../../configs/configs";

const MONEDA_DE_DIEZ_CENTIMOS = "Moneda S/0.1";
const MONEDA_DE_VEINTE_CENTIMOS = "Moneda S/0.2";
const MONEDA_DE_CINCUENTA_CENTIMOS = "Moneda S/0.5";
const MONEDA_DE_UN_SOL = "Moneda S/1";
const MONEDA_DE_DOS_SOLES = "Moneda S/2";
const MONEDA_DE_CINCO_SOLES = "Moneda S/5";
const BILLETE_DE_DIEZ_SOLES = "Billete S/10";
const BILLETE_DE_VEINTE_SOLES = "Billete S/20";
const BILLETE_DE_CINCUENTA_SOLES = "Billete S/50";
const BILLETE_DE_CIEN_SOLES = "Billete S/100";
const BILLETE_DE_DOSCIENTOS_SOLES = "Billete S/200";

const date = moment.tz("America/Lima").format("lll");

class CashierRegister extends Component {
  state = {
    solesZindex: "5",
    tabColorSol: "#9EC446",
    dollarsZindex: "4",
    tabColorDol: "#5D5D5D",
    checkZindex: "3",
    tabColorChk: "#5D5D5D",
    debitZindex: "2",
    tabColorDbt: "#5D5D5D",
    creditZindex: "1",
    tabColorCdt: "#5D5D5D",

    cantMoneda: "",
    referencia: "",
    totalFondo: 0,

    fondo: {
      diezCentimosMoneda: 0,
      veinteCentimosMoneda: 0,
      cincuentaCentimosMoneda: 0,
      unSolMoneda: 0,
      dosSolesMoneda: 0,
      cincoSolesMoneda: 0,
      diezSolesBillete: 0,
      veinteSolesBillete: 0,
      cincuentaSolesBillete: 0,
      cienSolesBillete: 0,
      dosCientosSolesBillete: 0,
      vales: 0,
      pax: 0,
      detalleAuto: [],
      detalleCierre: {}
    },

    diezCentimosMoneda: "",
    veinteCentimosMoneda: "",
    cincuentaCentimosMoneda: "",
    unSolMoneda: "",
    dosSolesMoneda: "",
    cincoSolesMoneda: "",
    diezSolesBillete: "",
    veinteSolesBillete: "",
    cincuentaSolesBillete: "",
    cienSolesBillete: "",
    dosCientosSolesBillete: "",
    vales: "",

    pagos: [],
    pagoSeleccionado: {},
    firstInputPh: "Monto S/",
    SecondInputPh: "Referencia",
    cierre: [],
    cierreDetail: [],
    solView: true,
    dolarView: false,
    posvView: false,
    posmView: false,
    posotView: false,
    midTitle: "CANTIDAD",
    totalCash: "0.00",
    totalPos: "0.00",
    totalOthers: "0.00",
    detailPosMaster: [],
    detailPosVisa: [],
    detailOthers: [],
    contentRowMaster: [],
    contentRowVisa: [],
    contentRowOthers: [],
    contentRowDolar: [],

    grandTotal: "0.00",
    acumulado: 0,
    cierreId: "",
    reportLock: false,
    fondoId: "",
    pagosTable: [],
    pagosMaster: [],
    pagosVisa: [],
    pagosOtros: [],
    pagosMasterControl: [],
    pagosVisaControl: [],
    pagosOtrosControl: [],
    pagosSoles: [],
    pagosDolares: [],
    solState: "0.00",
    dolState: "0.00",
    visaState: "0.00",
    masterState: "0.00",
    otrosState: "0.00",
    operEfectivoLocal: 0,
    operEfectivoDolar: 0,
    operPosMaster: 0,
    operPosVisa: 0,
    operOtros: 0,
    solStateArq: "0.00",
    dolStateArq: "0.00",
    visaStateArq: "0.00",
    masterStateArq: "0.00",
    // planillaStateArq: "0.00",
    // canjeStateArq: "0.00",
    // internoStateArq: "0.00",
    // invStateArq: "0.00",
    otrosStateArq: "0.00",
    blockState: false,
    detalleAuto: [],
    detalleAutoClone: [],
    inputVisa: "",
    inputMaster: "",
    inputPlanilla: "",
    inputCanje: "",
    inputInterno: "",
    inputInv: "",
    inputVisaTotal: "",
    inputMasterTotal: "",
    inputPlanillaTotal: "",
    inputCanjeTotal: "",
    inputInternoTotal: "",
    inputInvTotal: "",
    tiposPago: []
  };

  transFromCashName = name => {
    switch (name) {
      case "diezCentimosMoneda":
        return MONEDA_DE_DIEZ_CENTIMOS;
      case "veinteCentimosMoneda":
        return MONEDA_DE_VEINTE_CENTIMOS;
      case "cincuentaCentimosMoneda":
        return MONEDA_DE_CINCUENTA_CENTIMOS;
      case "unSolMoneda":
        return MONEDA_DE_UN_SOL;
      case "dosSolesMoneda":
        return MONEDA_DE_DOS_SOLES;
      case "cincoSolesMoneda":
        return MONEDA_DE_CINCO_SOLES;
      case "diezSolesBillete":
        return BILLETE_DE_DIEZ_SOLES;
      case "veinteSolesBillete":
        return BILLETE_DE_VEINTE_SOLES;
      case "cincuentaSolesBillete":
        return BILLETE_DE_CINCUENTA_SOLES;
      case "cienSolesBillete":
        return BILLETE_DE_CIEN_SOLES;
      case "dosCientosSolesBillete":
        return BILLETE_DE_DOSCIENTOS_SOLES;
      // case "vales":
      //   return "Vales y Facturas";
      default:
        return;
    }
  };

  transFromCashNameReverse = name => {
    switch (name) {
      case MONEDA_DE_DIEZ_CENTIMOS:
        return "diezCentimosMoneda";
      case MONEDA_DE_VEINTE_CENTIMOS:
        return "veinteCentimosMoneda";
      case MONEDA_DE_CINCUENTA_CENTIMOS:
        return "cincuentaCentimosMoneda";
      case MONEDA_DE_UN_SOL:
        return "unSolMoneda";
      case MONEDA_DE_DOS_SOLES:
        return "dosSolesMoneda";
      case MONEDA_DE_CINCO_SOLES:
        return "cincoSolesMoneda";
      case BILLETE_DE_DIEZ_SOLES:
        return "diezSolesBillete";
      case BILLETE_DE_VEINTE_SOLES:
        return "veinteSolesBillete";
      case BILLETE_DE_CINCUENTA_SOLES:
        return "cincuentaSolesBillete";
      case BILLETE_DE_CIEN_SOLES:
        return "cienSolesBillete";
      case BILLETE_DE_DOSCIENTOS_SOLES:
        return "dosCientosSolesBillete";
      // default:
      //   return "vales";
      default:
        return;
    }
  };

  getReport = report => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${END_POINT_CIERRE}getCierre/${report}`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "blob"
        })
        .then(response => {
          const fileURL = URL.createObjectURL(response.data);
          FileSaver.saveAs(fileURL, `reporte${date}.pdf`);
          resolve("done");
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  updateFondos = () => {
    return new Promise((resolve, reject) => {
      axios
        .put(`${END_POINT}fondos/${this.props.fondoId}`, this.state.fondo, {
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

  getFondos = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${END_POINT}fondos`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          const fondos = response.data;
          fondos.forEach(fondo => {
            if (this.props.fondoId === fondo._id) {
              this.setState({
                fondo: fondo
              });
            }
          });
          resolve("consulta el fondo");
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  deleteFondos = () => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${END_POINT}fondos/${this.props.fondoId}`, {
          //ES PROPS
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject.log(error.message);
        });
    });
  };

  sendCierre = data => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${END_POINT}cierres`, data, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          resolve(response.data._id);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  getResume = () => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${END_POINT}paloteo/${this.props.fondoId}`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          alert("Resumen impreso con exito");
          resolve();
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  logOutUser = id => {
    return new Promise((resolve, reject) => {
      axios
        .put(`${END_POINT}logOutEmpleado/${id}`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  clickPagoHandler = pago => {
    if (pago.tipoPago.toLowerCase().includes("master")) {
      // this.activateTabHandler("Ardbt");
      // this.createTrans([pago], null, "add");
    } else if (pago.tipoPago.toLowerCase().includes("visa")) {
      // this.activateTabHandler("Archk");
      // this.createTrans([pago], null, "add");
    } else if (pago.tipoPago !== "APERTURA") {
      // this.activateTabHandler("Arcdt");
      this.createTrans([pago], null, "add");
    } else if (pago.tipoPago === "APERTURA") {
      // this.activateTabHandler("ArSol");
      // this.createTrans([pago], null, "add");
    } else {
      //APERTURA DOLARES //TAMBIEN EGRESOS
      // pagosDolares: pagosDolares,
    }
  };

  clickPagoHandlerBack = pago => {
    this.createTrans([pago], null, "sub");
  };

  createRow = pago => {
    return (
      <tr
        className={classes.MyPago}
        style={{
          height: "20px",
          with: "305px"
        }}
        key={pago._id}
        // onClick={() => this.clickPagoHandler(pago)}
      >
        <td key={uniqid()} style={{ width: "120px" }}>
          {pago.tipoPago}
        </td>
        <td key={uniqid()} style={{ width: "80px" }}>
          <div
            key={uniqid()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              left: "-30px"
            }}
          >
            {pago.tipoPago !== "APERTURA"
              ? this.props.cargo.toLowerCase().includes("gere")
                ? pago.reference
                : ""
              : ""}
          </div>
        </td>
        <td key={uniqid()}>
          <div
            key={uniqid()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "25px",
              background: "rgb(72,89,35)",
              color: "#F3F3F4",
              height: "25px",
              with: "80px"
            }}
          >
            {this.props.cargo.toLowerCase().includes("gere")
              ? `S/ ${pago.monto.toFixed(2)}`
              : pago.tipoPago === "APERTURA"
              ? `S/ ${pago.monto.toFixed(2)}`
              : pago.reference}
          </div>
        </td>
      </tr>
    );
  };

  createTrans = (data, fondo, origen) => {
    return new Promise(async (resolve, reject) => {
      let pagosTable = [];
      let acumulado = lo.cloneDeep(this.state.acumulado);
      let grandTotal = parseFloat(lo.cloneDeep(this.state["grandTotal"]));
      let detalleAuto = _.chain(lo.cloneDeep(this.state.detalleAuto))
        .sortBy("date")
        .sortBy("tipoPago")
        .value();

      let enabler = fondo !== null;
      let efectivo = {}; // eslint-disable-line no-unused-vars
      let masterState = parseFloat(lo.cloneDeep(this.state.masterState));
      let visaState = parseFloat(lo.cloneDeep(this.state.visaState));
      let solState = parseFloat(lo.cloneDeep(this.state.solState));
      // let dolState = parseFloat(lo.cloneDeep(this.state.dolState))
      let otrosState = parseFloat(lo.cloneDeep(this.state.otrosState));

      let operEfectivoLocal = parseFloat(
        lo.cloneDeep(this.state.operEfectivoLocal)
      );
      // let operEfectivoDolar = parseFloat(lo.cloneDeep(this.state.operEfectivoDolar));
      let operPosMaster = parseFloat(lo.cloneDeep(this.state.operPosMaster));
      let operPosVisa = parseFloat(lo.cloneDeep(this.state.operPosVisa));
      let operOtros = parseFloat(lo.cloneDeep(this.state.operOtros));

      let masterStateArq = parseFloat(lo.cloneDeep(this.state.masterStateArq));
      let visaStateArq = parseFloat(lo.cloneDeep(this.state.visaStateArq));
      let solStateArq = parseFloat(lo.cloneDeep(this.state.solStateArq));
      // let dolStateArq = parseFloat(lo.cloneDeep(this.state.dolStateArq))
      let otrosStateArq = parseFloat(lo.cloneDeep(this.state.otrosStateArq));

      let pagosMaster = lo.cloneDeep(this.state.pagosMaster);
      let pagosVisa = lo.cloneDeep(this.state.pagosVisa);
      let pagosOtros = lo.cloneDeep(this.state.pagosOtros);

      let pagosMasterControl = lo.cloneDeep(this.state.pagosMasterControl);
      let pagosVisaControl = lo.cloneDeep(this.state.pagosVisaControl);
      let pagosOtrosControl = lo.cloneDeep(this.state.pagosOtrosControl);

      if (enabler)
        efectivo = lo.remove(detalleAuto, pago => {
          acumulado = acumulado + pago.monto;
          if (pago.tipoPago.toLowerCase().includes("master")) {
            pagosMasterControl.push(pago);
            masterState = masterState + pago.monto;
            operPosMaster = operPosMaster + 1;
          } else if (pago.tipoPago.toLowerCase().includes("visa")) {
            pagosVisaControl.push(pago);
            visaState = visaState + pago.monto;
            operPosVisa = operPosVisa + 1;
          } else if (
            pago.tipoPago === "EFECTIVO" ||
            pago.tipoPago === "APERTURA"
          ) {
            solState = solState + pago.monto;
            if (pago.tipoPago === "EFECTIVO")
              operEfectivoLocal = operEfectivoLocal + 1;
          } else {
            pagosOtrosControl.push(pago);
            otrosState = otrosState + pago.monto;
            operOtros = operOtros + 1;
          }
          return pago.tipoPago === "EFECTIVO";
        });

      //PROCESO INVERSO
      let contentRowMaster = lo.cloneDeep(this.state.contentRowMaster);
      let contentRowVisa = lo.cloneDeep(this.state.contentRowVisa);
      let contentRowOthers = lo.cloneDeep(this.state.contentRowOthers);
      if (!enabler) {
        let tp = "OTHERS";
        switch (origen) {
          case "add":
            grandTotal = grandTotal + data[0].monto;
            if (data[0].tipoPago.toLowerCase().includes("master"))
              tp = "POS MASTER";
            if (data[0].tipoPago.toLowerCase().includes("visa"))
              tp = "POS VISA";
            if (data[0].tipoPago === "APERTURA") tp = "APERTURA";

            switch (tp) {
              case "POS MASTER":
                masterStateArq = masterStateArq + data[0].monto;
                contentRowMaster.push(this.createCell(data[0]));
                break;
              case "POS VISA":
                visaStateArq = visaStateArq + data[0].monto;
                contentRowVisa.push(this.createCell(data[0]));
                break;
              case "APERTURA":
                solStateArq = solStateArq + data[0].monto;
                break;
              default:
                otrosStateArq = otrosStateArq + data[0].monto;
                contentRowOthers.push(this.createCell(data[0]));
                break;
            }
            detalleAuto = lo.remove(detalleAuto, pago => {
              if (tp === "POS MASTER")
                if (pago._id === data[0]._id) pagosMaster.push(data[0]);
              if (tp === "POS VISA")
                if (pago._id === data[0]._id) pagosVisa.push(data[0]);
              if (tp === "OTHERS")
                if (pago._id === data[0]._id) pagosOtros.push(data[0]);
              return pago._id !== data[0]._id;
            });
            break;
          default:
            //SUB
            grandTotal = grandTotal - data[0].monto;

            if (data[0].tipoPago.toLowerCase().includes("master"))
              tp = "POS MASTER";
            if (data[0].tipoPago.toLowerCase().includes("visa"))
              tp = "POS VISA";

            switch (tp) {
              case "POS MASTER":
                masterStateArq = masterStateArq - data[0].monto;
                contentRowMaster = lo.remove(contentRowMaster, row => {
                  return row.key !== data[0]._id;
                });
                pagosMaster = lo.remove(pagosMaster, row => {
                  return row._id !== data[0]._id;
                });
                break;
              case "POS VISA":
                visaStateArq = visaStateArq - data[0].monto;
                contentRowVisa = lo.remove(contentRowVisa, row => {
                  return row.key !== data[0]._id;
                });
                pagosVisa = lo.remove(pagosVisa, row => {
                  return row._id !== data[0]._id;
                });
                break;
              default:
                otrosStateArq = otrosStateArq - data[0].monto;
                contentRowOthers = lo.remove(contentRowOthers, row => {
                  return row.key !== data[0]._id;
                });
                pagosOtros = lo.remove(pagosOtros, row => {
                  return row._id !== data[0]._id;
                });
                break;
            }

            detalleAuto.push(data[0]);
            detalleAuto = _.chain(detalleAuto)
              .sortBy("date")
              .sortBy("tipoPago")
              .value();

            break;
        }
      }

      //----------------------------------------------------

      detalleAuto.forEach(pago => {
        pagosTable.push(this.createRow(pago));
      });

      this.setState(
        {
          detalleAuto: detalleAuto,
          pagosMaster: pagosMaster,
          pagosVisa: pagosVisa,
          pagosOtros: pagosOtros,
          pagosMasterControl: pagosMasterControl,
          pagosVisaControl: pagosVisaControl,
          pagosOtrosControl: pagosOtrosControl,
          grandTotal: grandTotal.toFixed(2),
          pagosTable: pagosTable,
          acumulado: acumulado,
          contentRowMaster: contentRowMaster,
          contentRowVisa: contentRowVisa,
          contentRowOthers: contentRowOthers,
          masterState: masterState.toFixed(2),
          visaState: visaState.toFixed(2),
          solState: solState.toFixed(2),
          // dolState : dolState,
          operEfectivoLocal: operEfectivoLocal,
          // operEfectivoDolar: operEfectivoDolar,
          operPosMaster: operPosMaster,
          operPosVisa: operPosVisa,
          operOtros: operOtros,
          otrosState: otrosState.toFixed(2),
          masterStateArq: masterStateArq.toFixed(2),
          visaStateArq: visaStateArq.toFixed(2),
          solStateArq: solStateArq.toFixed(2),
          // dolStateArq : dolStateArq
          otrosStateArq: otrosStateArq.toFixed(2)
        },
        () => resolve("done")
      );
    });
  };

  componentDidMount = async () => {
    if (this.props.cajeroId !== "") {
      const cierreDetail = [];
      const fondos = await this.getFondos().catch(err => console.log(err));
      const fondo = fondos ? _.clone(this.state.fondo) : {};
      let detalleAuto = fondo.detalleAuto;
      detalleAuto.push({
        _id: this.props.fondoId,
        tipoPago: "APERTURA",
        monto: fondo.totalFondo,
        date: date,
        reference: "",
        orderDetails: []
      });

      let pax = fondo.pax;

      const fondoClean = _.omit(
        fondo,
        "_id",
        "totalFondo",
        "__v",
        "pax",
        "turno",
        "detalleAuto",
        "detalleCierre",
        "documentos",
        "vales"
      );

      let myState = {};
      Object.keys(fondoClean).forEach((element, key, _array) => {
        let item = {};
        let name = this.transFromCashName(element);
        item[name] = 0;
        item["total"] = 0;
        cierreDetail.push(item);
        myState[name] = "0.00";
      });

      myState.pax = pax;

      this.setState(
        {
          ...myState,
          detalleAuto: detalleAuto,
          cierreDetail: cierreDetail,
          detalleAutoClone: lo.cloneDeep(detalleAuto)
        },
        async () => {
          await this.createTrans(null, fondo.totalFondo).catch(err =>
            console.log(err)
          );
        }
      );
    } else {
      this.props.history.goBack();
    }
  };

  activateTabHandler = name => {
    let oldState = null;
    switch (name) {
      case "Ardol":
        oldState = this.state.dollarsZindex; //DOLARES
        if (oldState === "4" || oldState === "0") {
          this.setState({
            solesZindex: "0",
            tabColorSol: "#5D5D5D",
            dollarsZindex: "4",
            tabColorDol: "#9EC446",
            checkZindex: "3",
            tabColorChk: "#5D5D5D",
            debitZindex: "2",
            tabColorDbt: "#5D5D5D",
            creditZindex: "1",
            tabColorCdt: "#5D5D5D",
            solView: false,
            dolarView: true,
            posvView: false,
            posmView: false,
            posotView: false,
            midTitle: "CANTIDAD"
          });
        }
        break;
      case "Archk":
        oldState = this.state.checkZindex; //POSVISA
        if (oldState === "3" || oldState === "0") {
          this.setState({
            solesZindex: "5",
            tabColorSol: "#5D5D5D",
            dollarsZindex: "0",
            tabColorDol: "#5D5D5D",
            checkZindex: "3",
            tabColorChk: "#9EC446",
            debitZindex: "2",
            tabColorDbt: "#5D5D5D",
            creditZindex: "1",
            tabColorCdt: "#5D5D5D",
            dolarView: false,
            solView: false,
            posvView: true,
            posmView: false,
            posotView: false,
            midTitle: "MONTO"
          });
        }
        break;
      case "Ardbt":
        oldState = this.state.debitZindex; //POSMASTER
        if (oldState === "2" || oldState === "0") {
          this.setState({
            solesZindex: "5",
            tabColorSol: "#5D5D5D",
            dollarsZindex: "4",
            tabColorDol: "#5D5D5D",
            checkZindex: "0",
            tabColorChk: "#5D5D5D",
            debitZindex: "2",
            tabColorDbt: "#9EC446",
            creditZindex: "1",
            tabColorCdt: "#5D5D5D",
            posvView: false,
            dolarView: false,
            solView: false,
            posmView: true,
            posotView: false,
            midTitle: "MONTO"
          });
        }
        break;
      case "Arcdt":
        oldState = this.state.creditZindex; //OTROS
        if (oldState === "1" || oldState === "0") {
          this.setState({
            solesZindex: "5",
            tabColorSol: "#5D5D5D",
            dollarsZindex: "4",
            tabColorDol: "#5D5D5D",
            checkZindex: "3",
            tabColorChk: "#5D5D5D",
            debitZindex: "0",
            tabColorDbt: "#5D5D5D",
            creditZindex: "1",
            tabColorCdt: "#9EC446",
            posmView: false,
            dolarView: false,
            solView: false,
            posvView: false,
            posotView: true,
            midTitle: "MONTO"
          });
        }
        break;
      default:
        oldState = this.state.solesZindex; //SOLES
        if (oldState === "5" || oldState === "0") {
          this.setState({
            solesZindex: "5",
            tabColorSol: "#9EC446",
            dollarsZindex: "4",
            tabColorDol: "#5D5D5D",
            checkZindex: "3",
            tabColorChk: "#5D5D5D",
            debitZindex: "2",
            tabColorDbt: "#5D5D5D",
            creditZindex: "1",
            tabColorCdt: "#5D5D5D",
            posotView: false,
            dolarView: false,
            solView: true,
            posvView: false,
            posmView: false,
            midTitle: "CANTIDAD"
          });
        }
        break;
    }
  };

  backHandler = () => {
    if (!this.state.reportLock) this.props.history.goBack();
  };

  typeHandler = e => {
    switch (e.target.name) {
      case "Moneda S/0.1":
        this.setState({ diezCentimosMoneda: e.target.value });
        break;
      case "Moneda S/0.2":
        this.setState({ veinteCentimosMoneda: e.target.value });
        break;
      case "Moneda S/0.5":
        this.setState({ cincuentaCentimosMoneda: e.target.value });
        break;
      case "Moneda S/1":
        this.setState({ unSolMoneda: e.target.value });
        break;
      case "Moneda S/2":
        this.setState({ dosSolesMoneda: e.target.value });
        break;
      case "Moneda S/5":
        this.setState({ cincoSolesMoneda: e.target.value });
        break;
      case "Billete S/10":
        this.setState({ diezSolesBillete: e.target.value });
        break;
      case "Billete S/20":
        this.setState({ veinteSolesBillete: e.target.value });
        break;
      case "Billete S/50":
        this.setState({ cincuentaSolesBillete: e.target.value });
        break;
      case "Billete S/100":
        this.setState({ cienSolesBillete: e.target.value });
        break;
      case "Billete S/200":
        this.setState({ dosCientosSolesBillete: e.target.value });
        break;
      // case "Vales y Facturas":
      //   this.setState({ vales: e.target.value });
      //   break;
      case "inputVisa":
        this.setState({ inputVisa: e.target.value });
        break;
      case "inputMaster":
        this.setState({ inputMaster: e.target.value });
        break;
      case "inputPlanilla":
        this.setState({ inputPlanilla: e.target.value });
        break;
      case "inputCanje":
        this.setState({ inputCanje: e.target.value });
        break;
      case "inputInterno":
        this.setState({ inputInterno: e.target.value });
        break;
      case "inputInv":
        this.setState({ inputInv: e.target.value });
        break;
      default:
        break;
    }
  };

  cashMultiplier = name => {
    switch (name) {
      case MONEDA_DE_DIEZ_CENTIMOS:
        return 0.1;
      case MONEDA_DE_VEINTE_CENTIMOS:
        return 0.2;
      case MONEDA_DE_CINCUENTA_CENTIMOS:
        return 0.5;
      case MONEDA_DE_UN_SOL:
        return 1;
      case MONEDA_DE_DOS_SOLES:
        return 2;
      case MONEDA_DE_CINCO_SOLES:
        return 5;
      case BILLETE_DE_DIEZ_SOLES:
        return 10;
      case BILLETE_DE_VEINTE_SOLES:
        return 20;
      case BILLETE_DE_CINCUENTA_SOLES:
        return 50;
      case BILLETE_DE_CIEN_SOLES:
        return 100;
      case BILLETE_DE_DOSCIENTOS_SOLES:
        return 200;
      default:
        return 1;
    }
  };

  createCell = pago => {
    return (
      <tr
        key={pago._id}
        style={{
          width: "670px",
          height: "38px",
          alignContent: "center"
        }}
      >
        <td
          key={uniqid()}
          className={classes.DescriptionContainer}
          style={{
            width: "330px",
            paddingLeft: "8px"
          }}
        >
          <span
            key={uniqid()}
            onClick={() => this.clickPagoHandlerBack(pago)}
            className={classes.MyPago}
          >
            {pago.tipoPago}
          </span>
        </td>
        <td
          key={uniqid()}
          style={{
            width: "220px",
            paddingRight: "8px"
          }}
        >
          <div key={uniqid()} className={classes.TotalContainer}>
            <div
              key={uniqid()}
              className={classes.ActualTotal}
              style={{
                display: "flex",
                marginTop: "4.5px",
                background: "#d8dee8",
                borderRadius: "25px",
                fontSize: "0.8rem",
                color: "rgb(93, 93, 93)",
                fontWeight: "bold",
                justifyContent: "center",
                alignItems: "center",
                height: "25px"
              }}
            >
              {pago.reference.toLowerCase()}
            </div>
          </div>
        </td>
        <td
          key={uniqid()}
          style={{
            width: "100px",
            paddingRight: "8px"
          }}
        >
          <div key={uniqid()} className={classes.TotalContainer}>
            <div key={uniqid()} className={classes.ActualTotal}>
              <Totalizator
                backTotal={"#485923"}
                backColor={"#F3F3F5"}
                backBorderRad={"25px"}
                backFontSize={"0.8rem"}
                totalFirstText={"S/"}
                totalSecondText={parseFloat(pago.monto).toFixed(2)}
                bShadow={null}
                confHeight={"25px"}
                backWidth={"100%"}
              />
            </div>
          </div>
        </td>
      </tr>
    );
  };

  createCierre = async desvio => {
    const logOut = await this.logOutUser(this.props.cajeroId).catch(err =>
      console.log(err)
    );
    if (logOut) {
      const updateFondos = await this.updateFondos().catch(err =>
        console.log(err)
      );
      if (updateFondos) {
        const data = {};
        data.fondo = this.props.fondoId;
        data.empleado = this.props.cajeroId;
        data.desvio = desvio;
        const close = await this.sendCierre(data).catch(err =>
          console.log(err)
        );
        if (close) {
          const report = await this.getReport(close).catch(err =>
            console.log(err)
          );
          if (report) {
            this.props.onSetNombreCajero("");
            alert("Turno Cerrado con exito, Imprima su reporte");
            this.props.history.goBack();
          }
        }
      }
    }
  };

  closeCashier = () => {
    if (!this.state.reportLock) {
      this.setState({ reportLock: true }, () => {
        const caja = parseFloat(lo.cloneDeep(this.state.acumulado));
        let solStateArq = parseFloat(lo.cloneDeep(this.state.solStateArq));
        // let dolStateArq = parseFloat(lo.cloneDeep(this.state.dolStateArq));
        let visaStateArq = parseFloat(lo.cloneDeep(this.state.visaStateArq));
        let masterStateArq = parseFloat(
          lo.cloneDeep(this.state.masterStateArq)
        );
        let otrosStateArq = parseFloat(lo.cloneDeep(this.state.otrosStateArq));

        let desvio = (
          caja -
          (masterStateArq + visaStateArq + otrosStateArq + solStateArq)
        ).toFixed(2);

        let arqMasterTmp = lo.cloneDeep(this.state.pagosMaster);
        let arqVisaTmp = lo.cloneDeep(this.state.pagosVisa);
        let arqOtrosTmp = lo.cloneDeep(this.state.pagosOtros);

        let pagosMasterControl = lo.cloneDeep(this.state.pagosMasterControl);
        let pagosVisaControl = lo.cloneDeep(this.state.pagosVisaControl);
        let pagosOtrosControl = lo.cloneDeep(this.state.pagosOtrosControl);

        pagosMasterControl = pagosMasterControl.filter(cv => {
          return !arqMasterTmp.find(e => {
            return e._id === cv._id;
          });
        });

        pagosVisaControl = pagosVisaControl.filter(cv => {
          return !arqVisaTmp.find(e => {
            return e._id === cv._id;
          });
        });

        pagosOtrosControl = pagosOtrosControl.filter(cv => {
          return !arqOtrosTmp.find(e => {
            return e._id === cv._id;
          });
        });

        const datalleCierre = {
          acumulado: this.state.acumulado,
          totalEfectivoLocalArq: solStateArq,
          totalEfectivoDolarArq: 0,
          totalPosMasterArq: masterStateArq,
          totalPosVisaArq: visaStateArq,
          totalOtrosArq: otrosStateArq,

          totalEfectivoLocal: this.state.solState,
          totalEfectivoDolar: 0,
          totalPosMaster: this.state.masterState,
          totalPosVisa: this.state.visaState,
          totalOtros: this.state.otrosState,

          operEfectivoLocal: lo.cloneDeep(this.state.operEfectivoLocal),
          //operEfectivoDolar:  lo.cloneDeep(this.state.operEfectivoDolar),
          operPosMaster: lo.cloneDeep(this.state.operPosMaster),
          operPosVisa: lo.cloneDeep(this.state.operPosVisa),
          operOtros: lo.cloneDeep(this.state.operOtros),

          arqMaster: arqMasterTmp,
          arqVisa: arqVisaTmp,
          arqOtros: arqOtrosTmp,
          arqMasterDiff: pagosMasterControl,
          arqVisaDiff: pagosVisaControl,
          arqOtrosDiff: pagosOtrosControl
        };

        let fondo = lo.cloneDeep(this.state.fondo);

        fondo.detalleAuto = this.state.detalleAutoClone;
        fondo.detalleCierre = datalleCierre;

        this.setState({ fondo: fondo }, async () => {
          if (
            window.confirm(
              "Esta accion NO SE PUEDE DESHACER desea Cerrar la Caja?"
            )
          ) {
            this.createCierre(desvio);
          } else {
            this.setState({ reportLock: false });
          }
        });
      });
    } else {
      alert("Esperando el documento Cierre este aviso...");
    }
  };

  addCoinHandler = (coin, coinName) => {
    if (this.state[coinName] === "") {
      alert(`Coloque la cantidad de ${coin} que desea agregar`);
    } else {
      let cant = parseInt(lo.cloneDeep(this.state[coinName]), 10);
      // if (coinName === "vales")
      //   cant = parseFloat(lo.cloneDeep(this.state[coinName]));
      let total = (this.cashMultiplier(coin) * cant).toFixed(2);
      let fondo = lo.cloneDeep(this.state.fondo);
      let grandTotal = parseFloat(lo.cloneDeep(this.state.grandTotal));
      let solStateArq = parseFloat(lo.cloneDeep(this.state.solStateArq));

      fondo[coinName] = cant;
      if (cant <= 0) {
        alert(`Debe colocar numeros enteros positivos mayores a 0`);
      } else {
        grandTotal = grandTotal + parseFloat(total);
        solStateArq = solStateArq + parseFloat(total);
        let name = this.transFromCashName(coinName);
        let state = lo.cloneDeep(this.state[name]);
        state = total;

        let tiposPago = lo.cloneDeep(this.state.tiposPago);

        for (let i = 0; i < tiposPago.length; i++) {
          const pago = tiposPago[i];
          if (pago.tipoPago === coinName) {
            grandTotal = grandTotal - parseFloat(pago.monto);
            solStateArq = solStateArq - parseFloat(pago.monto);
            tiposPago.splice(i, 1);
            break;
          }
        }

        tiposPago.push({
          monto: total,
          tipoPago: coinName
        });

        this.setState({
          solStateArq: solStateArq.toFixed(2),
          [name]: state,
          fondo: fondo,
          [coinName]: "",
          grandTotal: grandTotal.toFixed(2),
          tiposPago: tiposPago
        });
      }
    }
  };

  addPagosHandler = async (coinName, display, stateTotal, arq) => {
    if (this.state[coinName] === "") {
      alert(`Coloque la cantidad de ${display} que desea agregar`);
    } else {
      let cant = parseFloat(lo.cloneDeep(this.state[coinName]));
      if (cant <= 0) {
        alert("Debe colocar numero positivo mayor a 0");
      } else {
        let grandTotal = parseFloat(lo.cloneDeep(this.state.grandTotal));
        let myPago = parseFloat(lo.cloneDeep(this.state[coinName]));
        grandTotal = grandTotal + myPago;

        let value = parseFloat(lo.cloneDeep(this.state[arq]));
        value = value + myPago;

        let pagosOtros = lo.cloneDeep(this.state.pagosOtros);
        let tipo = "";

        switch (coinName) {
          case "inputPlanilla":
            tipo = "descuento por planilla";
            break;
          case "inputCanje":
            tipo = "canje";
            break;
          case "inputInterno":
            tipo = "consumo interno";
            break;
          case "inputInv":
            tipo = "invitacion";
            break;

          default:
            break;
        }

        pagosOtros.push({
          date: date,
          monto: myPago,
          orderDetails: [],
          reference: "",
          tipoPago: tipo,
          _id: ""
        });

        let tiposPago = lo.cloneDeep(this.state.tiposPago);

        for (let i = 0; i < tiposPago.length; i++) {
          const pago = tiposPago[i];
          if (pago.tipoPago === coinName) {
            grandTotal = grandTotal - parseFloat(pago.monto);
            value = value - parseFloat(pago.monto);
            tiposPago.splice(i, 1);
            break;
          }
        }

        tiposPago.push({
          monto: myPago,
          tipoPago: coinName
        });

        this.setState({
          [stateTotal]: `S/ ${parseFloat(myPago).toFixed(2)}`,
          [arq]: value.toFixed(2),
          [coinName]: "",
          grandTotal: grandTotal.toFixed(2),
          pagosOtros: pagosOtros,
          tiposPago: tiposPago
        });
      }
    }
  };

  createRowPago = (display, name, classForButton, stateTotal, arq) => {
    return (
      <tr
        key={0}
        style={{
          width: "670px",
          height: "38px",
          alignContent: "center"
        }}
      >
        <td
          className={classes.DescriptionContainer}
          style={{
            width: "330px",
            paddingLeft: "8px"
          }}
        >
          <span>{display}</span>
        </td>
        <td
          style={{
            width: "220px",
            paddingRight: "8px"
          }}
        >
          <div className={classes.TotalContainer}>
            <div
              className={classes.ActualTotal}
              style={{
                display: "flex",
                marginTop: "4.5px",
                background: "#d8dee8",
                borderRadius: "25px",
                fontSize: "0.8rem",
                color: "#5d5d5d",
                fontWeight: "bold",
                justifyContent: "center",
                alignItems: "center",
                height: "25px"
              }}
            >
              <input
                className={classes.ConfBox}
                name={name}
                onKeyPress={target =>
                  this.handleKeyPressPago(
                    target,
                    name,
                    display,
                    stateTotal,
                    arq
                  )
                }
                value={this.state[name]}
                onChange={e => this.typeHandler(e)}
                style={{
                  boxShadow: "0 4px 8px -2px #888",
                  width: "85px"
                }}
                type={"number"}
              />
              <div className={classes.HoverButton}>
                <i
                  className={classForButton}
                  onClick={() =>
                    this.addPagosHandler(name, display, stateTotal, arq)
                  }
                  style={{
                    color: "#9ec446",
                    fontSize: "1rem",
                    borderRadius: "50%",
                    boxShadow: "0 4px 8px -2px #888"
                  }}
                />
              </div>
            </div>
          </div>
        </td>
        <td
          style={{
            width: "100px",
            paddingRight: "8px"
          }}
        >
          <div className={classes.TotalContainer}>
            <input
              type={"text"}
              value={this.state[stateTotal]}
              className={classes.ActualTotal}
              style={{
                background: "#485923",
                height: "25px",
                width: "85px",
                borderRadius: "25px",
                color: "#f3f3f5",
                fontWeight: "bold",
                textAlign: "center",
                outline: "none",
                border: "0",
                boxShadow: "none",
                cursor: "not-allowed"
              }}
              disabled={"disabled"}
            />
          </div>
        </td>
      </tr>
    );
  };

  handleKeyPress = (keyboard, name, coinName) => {
    if (keyboard.charCode === 13) {
      this.addCoinHandler(name, coinName);
    }
  };

  handleKeyPressPago = (keyboard, name, display, stateTotal, arq) => {
    if (keyboard.charCode === 13) {
      this.addPagosHandler(name, display, stateTotal, arq);
    }
  };

  render() {
    let trowDetail = [];
    let trowDetailDolar = [];
    let trowDetailVisa = [];
    let trowDetailMaster = [];
    let trowDetailPlanilla = [];
    let trowDetailCanje = [];
    let trowDetailInterno = [];
    let trowDetailInv = [];
    let trowDetailOthers = [];

    const cierreDetail = _.clone(this.state.cierreDetail);

    let classForButton = "fas fa-check-circle";

    if (cierreDetail.length > 0) {
      cierreDetail.forEach((tipoPago, index) => {
        let properties = _.keys(tipoPago);
        let name = properties[0];

        let coinName = this.transFromCashNameReverse(name);

        let cell = (
          <tr
            key={index}
            style={{
              width: "670px",
              height: "38px",
              alignContent: "center"
            }}
          >
            <td
              className={classes.DescriptionContainer}
              style={{
                width: "330px",
                paddingLeft: "8px"
              }}
            >
              <span>{name}</span>
            </td>
            <td
              style={{
                width: "220px",
                paddingRight: "8px"
              }}
            >
              <div className={classes.TotalContainer}>
                <div
                  className={classes.ActualTotal}
                  style={{
                    display: "flex",
                    marginTop: "4.5px",
                    background: "#d8dee8",
                    borderRadius: "25px",
                    fontSize: "0.8rem",
                    color: "#5d5d5d",
                    fontWeight: "bold",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "25px"
                  }}
                >
                  <input
                    className={classes.ConfBox}
                    name={name}
                    onKeyPress={target =>
                      this.handleKeyPress(target, name, coinName)
                    }
                    value={this.state[coinName]}
                    onChange={e => this.typeHandler(e)}
                    style={{
                      boxShadow: "0 4px 8px -2px #888"
                    }}
                    type={"number"}
                  />
                  <div className={classes.HoverButton}>
                    <i
                      className={classForButton}
                      onClick={() => this.addCoinHandler(name, coinName)}
                      style={{
                        color: "#9ec446",
                        fontSize: "1rem",
                        borderRadius: "50%",
                        boxShadow: "0 4px 8px -2px #888"
                      }}
                    />
                  </div>
                </div>
              </div>
            </td>
            <td
              style={{
                width: "100px",
                paddingRight: "8px"
              }}
            >
              <div className={classes.TotalContainer}>
                <input
                  type={"text"}
                  value={this.state[name]}
                  className={classes.ActualTotal}
                  style={{
                    background: "#485923",
                    height: "25px",
                    width: "85px",
                    borderRadius: "25px",
                    color: "#f3f3f5",
                    fontWeight: "bold",
                    textAlign: "center",
                    outline: "none",
                    border: "0",
                    boxShadow: "none",
                    cursor: "not-allowed"
                  }}
                  disabled={"disabled"}
                />
              </div>
            </td>
          </tr>
        );
        trowDetail.push(cell);
      });
    }

    trowDetailVisa.push(
      this.createRowPago(
        "POS Visa",
        "inputVisa",
        classForButton,
        "inputVisaTotal",
        "visaStateArq"
      )
    );

    trowDetailMaster.push(
      this.createRowPago(
        "POS Master",
        "inputMaster",
        classForButton,
        "inputMasterTotal",
        "masterStateArq"
      )
    );

    trowDetailPlanilla.push(
      this.createRowPago(
        "Descuento por Planilla",
        "inputPlanilla",
        classForButton,
        "inputPlanillaTotal",
        "otrosStateArq"
      )
    );

    trowDetailCanje.push(
      this.createRowPago(
        "Canje",
        "inputCanje",
        classForButton,
        "inputCanjeTotal",
        "otrosStateArq"
      )
    );

    trowDetailInterno.push(
      this.createRowPago(
        "Consumo Interno",
        "inputInterno",
        classForButton,
        "inputInternoTotal",
        "otrosStateArq"
      )
    );

    trowDetailInv.push(
      this.createRowPago(
        "Invitacion",
        "inputInv",
        classForButton,
        "inputInvTotal",
        "otrosStateArq"
      )
    );

    trowDetailOthers.push(
      trowDetailPlanilla,
      trowDetailCanje,
      trowDetailInterno,
      trowDetailInv
    );

    let effect = this.props.cargo.toLowerCase().includes("gere")
      ? {}
      : { position: "relative", top: "-25px", height: "50px" };

    let effect2 = this.props.cargo.toLowerCase().includes("gere")
      ? {}
      : { position: "relative", left: "-90px" };

    return (
      <div className={classes.CashierRegisterContainer}>
        <div className={classes.TopContainer}>
          <div className={classes.TopControls}>
            <div className={classes.Box}>
              <table
                style={{
                  width: "305px",
                  borderSpacing: "0.4rem",
                  borderCollapse: "separate"
                }}
              >
                <tbody>{_.clone(this.state.pagosTable)}</tbody>
              </table>
            </div>
          </div>
          <div
            className={classes.Tabs}
            style={{
              position: "relative",
              left: "30px"
            }}
          >
            <div className={classes.TabsContainer}>
              <ul className={classes.RealTab}>
                <li className={classes.ArSol}>
                  <div
                    className={classes.ActualTab}
                    style={{
                      zIndex: this.state.solesZindex
                    }}
                  >
                    <Triangle
                      name={"Arsol"}
                      backTriangleBig={
                        "linear-gradient(217deg, transparent 2.6rem, " +
                        this.state.tabColorSol +
                        " 1rem)"
                      }
                      textTriangle={"Efect. S/"}
                      tabBed={this.activateTabHandler}
                    />
                  </div>
                </li>
                <li className={classes.ArDol}>
                  <div
                    className={classes.ActualTab2}
                    style={{
                      zIndex: this.state.dollarsZindex
                    }}
                  >
                    <Triangle
                      name={"Ardol"}
                      backTriangleBig={
                        "linear-gradient(217deg, transparent 2.6rem, " +
                        this.state.tabColorDol +
                        " 1rem)"
                      }
                      textTriangle={"Efect. $"}
                      tabBed={this.activateTabHandler}
                    />
                  </div>
                </li>
                <li className={classes.ArChk}>
                  <div
                    className={classes.ActualTab3}
                    style={{
                      zIndex: this.state.checkZindex
                    }}
                  >
                    <Triangle
                      name={"Archk"}
                      backTriangleBig={
                        "linear-gradient(217deg, transparent 2.6rem, " +
                        this.state.tabColorChk +
                        " 1rem)"
                      }
                      textTriangle={"POS Visa"}
                      tabBed={this.activateTabHandler}
                    />
                  </div>
                </li>
                <li className={classes.ArDbt}>
                  <div
                    className={classes.ActualTab4}
                    style={{
                      zIndex: this.state.debitZindex
                    }}
                  >
                    <Triangle
                      name={"Ardbt"}
                      backTriangleBig={
                        "linear-gradient(217deg, transparent 2.6rem, " +
                        this.state.tabColorDbt +
                        " 1rem)"
                      }
                      textTriangle={"POS Master"}
                      tabBed={this.activateTabHandler}
                    />
                  </div>
                </li>
                <li className={classes.ArCdt}>
                  <div
                    className={classes.ActualTab5}
                    style={{
                      zIndex: this.state.creditZindex
                    }}
                  >
                    <Triangle
                      name={"Arcdt"}
                      backTriangleBig={
                        "linear-gradient(217deg, transparent 2.6rem, " +
                        this.state.tabColorCdt +
                        " 1rem)"
                      }
                      textTriangle={"Otros"}
                      tabBed={this.activateTabHandler}
                    />
                  </div>
                </li>
              </ul>
            </div>
            <div className={classes.TitleContainer}>
              <div className={classes.HeaderTabDesc}>
                <span className={classes.Tdesc}>DESCRIPCION</span>
              </div>
              <div className={classes.HeaderTabQuant}>
                <span>{this.state.midTitle}</span>
              </div>
              <div className={classes.HeaderTabTot}>
                <span>TOTAL</span>
              </div>
            </div>
            <div className={classes.ContenContainer}>
              <table
                style={{
                  width: "672px",
                  borderSpacing: "0"
                }}
              >
                <tbody>
                  {this.state.solView
                    ? trowDetail
                    : this.state.dolarView
                    ? trowDetailDolar
                    : this.state.posvView
                    ? trowDetailVisa
                    : this.state.posmView
                    ? trowDetailMaster
                    : this.state.posotView
                    ? trowDetailOthers
                    : ""}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className={classes.MidContainer}>
          {this.props.cargo.includes("GERE") ? (
            <React.Fragment>
              <div
                className={classes.CashSol}
                style={{
                  boxShadow: "0 4px 8px -2px #888"
                }}
              >
                <span>{`EFECTIVO S/ ${this.state.solState}`}</span>
              </div>
              <div
                className={classes.CashDol}
                style={{
                  boxShadow: "0 4px 8px -2px #888"
                }}
              >
                <span>{`EFECTIVO $ ${this.state.dolState}`}</span>
              </div>
              <div
                className={classes.Visa}
                style={{
                  boxShadow: "0 4px 8px -2px #888"
                }}
              >
                <span>{`VISA S/ ${this.state.visaState}`}</span>
              </div>
              <div
                className={classes.Master}
                style={{
                  boxShadow: "0 4px 8px -2px #888"
                }}
              >
                <span>{`MASTER S/ ${this.state.masterState}`}</span>
              </div>
              <div
                className={classes.Others}
                style={{
                  boxShadow: "0 4px 8px -2px #888"
                }}
              >
                <span>{`OTROS S/ ${this.state.otrosState}`}</span>
              </div>
            </React.Fragment>
          ) : (
            ""
          )}
          <div
            className={classes.CashSol2}
            style={{
              ...effect,
              boxShadow: "0 4px 8px -2px #888"
            }}
          >
            <span>{`ARQ. EFECTIVO S/ ${this.state.solStateArq}`}</span>
          </div>
          <div
            className={classes.CashDol2}
            style={{
              ...effect,
              boxShadow: "0 4px 8px -2px #888"
            }}
          >
            <span>{`ARQ. EFECTIVO $ ${this.state.dolStateArq}`}</span>
          </div>
          <div
            className={classes.Visa2}
            style={{
              ...effect,
              boxShadow: "0 4px 8px -2px #888"
            }}
          >
            <span>{`ARQ. VISA S/ ${this.state.visaStateArq}`}</span>
          </div>
          <div
            className={classes.Master2}
            style={{
              ...effect,
              boxShadow: "0 4px 8px -2px #888"
            }}
          >
            <span>{`ARQ. MASTER S/ ${this.state.masterStateArq}`}</span>
          </div>
          <div
            className={classes.Others2}
            style={{
              ...effect,
              boxShadow: "0 4px 8px -2px #888"
            }}
          >
            <span>{`ARQ. OTROS S/ ${this.state.otrosStateArq}`}</span>
          </div>
          <div
            className={classes.ExpensesContainer}
            style={{
              position: "relative",
              top: "15px"
            }}
          >
            <div className={classes.HeaderContainer}>
              <div className={classes.DateExpenses}>
                <span>FECHA</span>
              </div>
              <div className={classes.CodeExpenses}>
                <span>CODIGO</span>
              </div>
              <div className={classes.ConceptExpenses}>
                <span>CONCEPTO DE EGRESO</span>
              </div>
              <div className={classes.AmountExpenses}>
                <span>MONTO</span>
              </div>
              <div className={classes.RefferenceExpenses}>
                <span>REFERENCIA</span>
              </div>
              <div className={classes.AuthorizedExpenses}>
                <span>AUTORIZADO POR</span>
              </div>
            </div>
            <div className={classes.ContentContainer} />
          </div>
        </div>
        <div className={classes.BotContainer}>
          <div className={classes.TotalContainer} style={{ ...effect2 }}>
            <span
              style={{
                marginRight: "40px"
              }}
            />
            <Totalizator
              backTotal={"#485923"}
              backColor={"#F3F3F5"}
              backBorderRad={"25px"}
              confHeight={"40px"}
              backWidth={"330px"}
              totalFirstText={"TOTAL ARQUEO"}
              totalSecondText={`S/ ${this.state.grandTotal}`}
              bShadow={"0 4px 8px -2px #888"}
            />
            <span
              style={{
                marginRight: "20px"
              }}
            />
            {this.props.cargo.toLowerCase().includes("gere") ? (
              <Totalizator
                backTotal={"#485923"}
                backColor={"#F3F3F5"}
                backBorderRad={"25px"}
                confHeight={"40px"}
                backWidth={"330px"}
                totalFirstText={"TOTAL CAJA"}
                totalSecondText={`S/ ${this.state.acumulado.toFixed(2)}`}
                bShadow={"0 4px 8px -2px #888"}
              />
            ) : (
              ""
            )}
          </div>
          <div className={classes.ButtonContainer}>
            <div className={classes.ActualButton}>
              {RESUMEN_VENTA ? (
                <div className={classes.LinkButton2}>
                  <i className="far fa-file" onClick={() => this.getResume()} />
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      color: "#5d5d5d"
                    }}
                  >
                    Imp. Resumen
                  </span>
                </div>
              ) : (
                ""
              )}
              {this.props.cargo.includes("GEREN") ? (
                ""
              ) : (
                <div className={classes.LinkButton2}>
                  <i
                    className="fas fa-sign-out-alt"
                    onClick={() => this.closeCashier()}
                  />
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      color: "#5d5d5d"
                    }}
                  >
                    Cerrar Caja
                  </span>
                </div>
              )}
              <ExitButton backHandler={this.backHandler} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cajeroId: state.topBarState.cajeroId,
    fondoId: state.topBarState.fondoId,
    cargo: state.topBarState.cargo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetNombreCajero: nombreCajero =>
      dispatch(topBarActions.setFirstData(nombreCajero))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CashierRegister);
