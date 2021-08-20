import React, { Component } from "react";
import { connect } from "react-redux";
import socketIOClient from "socket.io-client";
import axios from "axios";
import _ from "underscore";
import lo from "lodash";
import uniqid from "uniqid";
import ReactTooltip from "react-tooltip";
import { Online } from "react-detect-offline";

import classes from "./MainCashier.scss";
import MultiButton from "../../components/Buttons/MultiButton/MultiButton";
import Employees from "./Employees/Employees";
import HighLights from "./HighLights/HighLights";
import ExitButton from "../../components/Buttons/ExitButton/ExitButton";
import * as topBarActions from "../../store/actions/index";
import * as tablesActions from "../../store/actions/index";
import Modal from "../../components/UI/Modal/Modal";
import WaiterSms from "../../components/WaiterSms/WaiterSms";
import CashierButton from "../../components/Buttons/CashierButton/CashierButton";
import Table from "../../components/Table/Table";
import ChangeTable from "../../components/ChangeTable/ChangeTable";
import {
  END_POINT,
  SEND_MESA,
  GET_MESAS,
  UPDATE_MESA,
  ALERTA_INTERNA,
  SUB_END_POINT,
  BAJA_URL,
  APPLICATION_JSON,
  TOKEN_URL_LOCAL,
  TOKEN_URL,
  AUTH,
  URL_SAVE_TOKE,
  CREATE_BAJA,
  UPDATE_FONDO_BAJA,
  URL_VALID_USER,
  URL_VALID_CODE,
  GO_ZOHO,
  GET_DOCUMENT_ID
} from "../../configs/configs";

class MainCashier extends Component {
  state = {
    employees: [],
    multiText: "ENVIAR MENSAJE",
    isToggled: true,
    activeHoverFree: false,
    activeHoverOcupada: false,
    activeHoverReservada: false,
    activeHoverCobrar: false,
    activeHoverPagar: false,
    smsing: false,
    smsWaiter: undefined,
    popupText: undefined,
    smsingDone: false,
    popupOpacity: 0,
    colorFree: "#B0BAC4",
    colorPagar: "#00A0F6",
    colorCobrar: "#617F1F",
    colorReservada: "#E70050",
    colorOcupada: "#FAE100",
    tablesList: [],
    socket: socketIOClient(SUB_END_POINT),
    top: "35%",
    left: "40%",
    documentos: [],
    emmitNotes: false,
    origen: "emNote",
    code: "",
    justy: "",
    merma: false,
    note: {},
    typeDoc: "",
    docId: ""
  };

  componentWillMount() {
    this.state.socket.on("connect", () => {});
  }

  componentWillUnmount() {
    this.state.socket.close();
  }

  getMozos = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${END_POINT}empleados/`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          let mozos = [];
          for (let i = 0; i < response.data.length; i++) {
            const mozo = response.data[i];
            if (
              mozo.cf_cargo === "MOZO" &&
              mozo.logged === true &&
              mozo.fondoId === this.props.fondoId
            ) {
              mozos.push(mozo);
            }
          }
          if (mozos.length > 0) {
            this.setState(
              {
                employees: mozos
              },
              () => resolve("listar mozos")
            );
          } else {
            resolve("No hay Mozos en linea");
          }
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  getDocumentos = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${END_POINT}fondos/${this.props.fondoId}`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          let documentos = [];
          response.data.documentos.forEach(element => {
            let documento = element.documento;
            documento.empleado = element.empleado;
            documento.dataPago = element.dataPago;
            documento.ticketImpreso = element.ticketImpreso;
            documentos.push(documento);
          });

          documentos = _.chain(documentos)
            .sortBy("tipoDocumento")
            .sortBy("documento.correlativo")
            .value();

          this.setState({ documentos: documentos }, () => resolve("done"));
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  printDocument = documento => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${END_POINT}printdocument/`, documento, {
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

  // creditoDocument = async documento => {
  //   await this.setState({
  //     typeDoc: "credito",
  //     emmitNotes: true,
  //     note: documento
  //   });

  //   this.setState({ smsing: true });
  // };

  // debitoDocument = async documento => {
  //   await this.setState({
  //     typeDoc: "debito",
  //     emmitNotes: true,
  //     note: documento
  //   });

  //   this.setState({ smsing: true });
  // };

  bajaDocument = async documento => {
    await this.setState({
      typeDoc: "baja",
      emmitNotes: true,
      note: documento,
      docId: documento._id
    });
    this.setState({ smsing: true });
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

  sendDoc = async type => {
    if (this.state.code === "") {
      alert("Coloque el codigo");
    } else if (this.state.justy === "") {
      alert("Coloque justificacion");
    } else {
      let note = lo.cloneDeep(this.state.note);
      switch (type) {
        case "baja":
          let date = new Date();
          let formatedDate = this.formatDate(date);

          let nBaja = {
            detalle: [
              {
                serie: note.documento.serie,
                motivo: "ERROR DE EMISION",
                correlativo: note.documento.correlativo,
                tipoDocumento: note.tipoDocumento
              }
            ],
            resumen: {
              id: note.documento.correlativo,
              nombreEmisor: note.documento.nombreEmisor,
              numDocEmisor: note.documento.numDocEmisor,
              tipoDocEmisor: note.documento.tipoDocEmisor,
              fechaReferente: note.fechaEmision
            },
            tipoResumen: "RA",
            idTransaccion: `RA-${note.idTransaccion}`,
            fechaGeneracion: formatedDate
          };

          const dataUser = {
            code: this.state.code
          };
          const dataJusty = {
            justy: this.state.justy
          };

          let token = this.props.token;
          let localToken = "";
          if (token === "") {
            localToken = await this.getTokenLocal().catch(err =>
              alert(ALERTA_INTERNA)
            );
            if (localToken !== "") {
              const validUser = await this.validateData(
                URL_VALID_USER,
                dataUser
              ).catch(err => alert(err.response.data.sms));
              if (validUser) {
                const validCode = await this.validateData(
                  URL_VALID_CODE,
                  dataJusty
                ).catch(err => alert(err.response.data.sms));
                if (validCode) {
                  await this.processBaja(nBaja, localToken, note._id);
                  this.clickOnBackDrop();
                }
              }
            } else {
              token = await this.getToken().catch(err => {
                console.log(err);
                alert("No hay conexion a internet intente mas tarde");
              });
              const validUser = await this.validateData(
                URL_VALID_USER,
                dataUser
              ).catch(err => alert(err.response.data.sms));
              if (validUser) {
                const validCode = await this.validateData(
                  URL_VALID_CODE,
                  dataJusty
                ).catch(err => alert(err.response.data.sms));
                if (validCode) {
                  await this.processBaja(nBaja, token, note._id);
                  this.clickOnBackDrop();
                }
              }
            }
          } else {
            const validUser = await this.validateData(
              URL_VALID_USER,
              dataUser
            ).catch(err => alert(err.response.data.sms));
            if (validUser) {
              const validCode = await this.validateData(
                URL_VALID_CODE,
                dataJusty
              ).catch(err => alert(err.response.data.sms));
              if (validCode) {
                await this.processBaja(nBaja, token, note._id);
                this.clickOnBackDrop();
              }
            }
          }
          break;
        case "credito":
          alert("No disponible");
          this.clickOnBackDrop();
          break;
        case "debito":
          alert("No disponible");
          this.clickOnBackDrop();
          break;
        default:
          break;
      }
    }
  };

  validateData = (validateUrl, data) => {
    return new Promise((resolve, reject) => {
      axios
        .post(validateUrl, data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": APPLICATION_JSON
          }
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(err => {
          // console.log(err.response.data.sms);
          reject(err);
        });
    });
  };

  processBaja = (nBaja, token, noteid) => {
    return new Promise(async (resolve, reject) => {
      const factiva = await this.facturActiva(
        nBaja,
        `Bearer ${token}`,
        BAJA_URL
      ).catch(err => {
        reject(err);
        this.clickOnBackDrop();
      });
      if (factiva) {
        await this.updateFondo(noteid).catch(err => alert(ALERTA_INTERNA));
        await this.saveBaja(nBaja).catch(err => console.log(err));
        let documentos = lo.cloneDeep(this.state.documentos);
        const docs = lo.filter(documentos, doc => doc._id !== noteid);
        await this.setState({ documentos: docs });
        if (GO_ZOHO) {
          await this.getDocument(noteid).catch(err => alert(err));
          alert("Documento dada de baja con exito!");
          resolve("done");
        } else {
          //NO ESTY SEGURO DE ESTE ELSE
          resolve("done");
        }
      }
    });
  };

  getDocument = id => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${GET_DOCUMENT_ID}${id}`, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": APPLICATION_JSON
          }
        })
        .then(respose => {
          resolve("done");
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  saveBaja = baja => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${CREATE_BAJA}/${this.state.docId}`,
          { notaBaja: baja },
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
        .catch(err => {
          reject(err);
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
          reject(error.message);
        });
    });
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
        .then(async response => {
          await this.saveToken(response.data.access_token);
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

  facturActiva = (data, auth, url) => {
    return new Promise((resolve, reject) => {
      axios
        .post(url, data, {
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

  updateFondo = docId => {
    let data = {
      docId: docId
    };
    return new Promise((resolve, reject) => {
      axios
        .put(`${UPDATE_FONDO_BAJA}${this.props.fondoId}`, data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            responseType: "json"
          }
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  componentDidMount = async () => {
    if (this.props.firstData === "") {
      this.backHandler();
    } else {
      this.props.onSaveClientZoho("general");
      await this.getDocumentos().catch(err => console.log(err));
      await this.getMozos().catch(err => alert(ALERTA_INTERNA));
      this.props.onSetTopBarVisibility("visible");
      this.state.socket.emit(SEND_MESA);
      this.state.socket.on(GET_MESAS, data => {
        if (this.state.tablesList.length === 0) {
          let tables = _.sortBy([...JSON.parse(data)], function(tab) {
            return tab.numeroMesa;
          });
          this.setState({
            tablesList: tables
          });
        }
      });

      this.state.socket.on(UPDATE_MESA, data => {
        const tList = lo.cloneDeep(this.state.tablesList);
        for (let i = 0; i < tList.length; i++) {
          const element = tList[i];
          if (element.numeroMesa === data.numeroMesa) {
            tList[i] = data;
            break;
          }
        }
        this.setState({
          tablesList: tList
        });
      });

      this.state.socket.on("logInMozo", data => {
        let employees = lo.cloneDeep(this.state.employees);
        let found = false;
        for (let i = 0; i < employees.length; i++) {
          const employee = employees[i];
          if (data.cf_dni_cliente === employee.cf_dni_cliente) {
            found = true;
            break;
          }
        }
        if (!found) employees.push(data);
        this.setState({
          employees: employees
        });
      });

      this.state.socket.on("logOutMozo", data => {
        let employees = lo.cloneDeep(this.state.employees);
        const employee = lo.filter(
          employees,
          emp => emp.cf_dni_cliente !== data.cf_dni_cliente
        );
        this.setState({
          employees: employee
        });
      });
    }
  };

  clickHandler = () => {};

  sendMessageHandler = emp => {
    this.setState({
      smsing: true,
      smsWaiter: emp
    });
  };

  sendSms = sms => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${END_POINT}mensajes/`, sms, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          resolve("Sms Enviado");
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  smsSentHandler = async (sms, mozo) => {
    if (sms !== "") {
      let message = {
        estadomensaje: "pendiente",
        remitente: "CAJA",
        texto: sms,
        empleado: mozo._id
      };
      await this.sendSms(message).catch(err => alert(ALERTA_INTERNA));
    } else {
      alert("Mensaje cancelado");
    }
    await this.setState({
      smsing: false,
      smsWaiter: undefined,
      smsingDone: true
    });
    this.startTimer(100);
  };

  startTimer = duration => {
    setTimeout(() => {
      this.setState({
        smsingDone: false,
        emmitNotes: false,
        code: "",
        merma: false,
        justy: "",
        typeDoc: ""
      });
    }, duration);
  };

  backHandler = () => {
    this.props.history.push("/");
  };

  tableHandler = (table, status, id) => {
    if (status === "Slave") {
      alert("Consultar mesa Master");
    } else {
      this.props.onSetMesaEstado(status);
      this.props.history.push("/statusmesas");
      this.props.onSetTableNumber(table);
      this.props.onGetMesaID(id);
    }
  };

  resumerHandler = () => {
    this.props.history.push("/cashierregister");
  };

  clickOnBackDrop = async () => {
    await this.setState({
      smsing: false,
      smsWaiter: undefined,
      smsingDone: true
    });
    this.startTimer(100);
  };

  typeHandler = async e => {
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

  mermaHandler = async e => {
    let merma = _.clone(this.state.merma);
    await this.setState({ merma: !merma });
  };

  render() {
    let backCircle = null;
    let backSmallCircle = null;
    let backBorder = null;
    let table = "";
    let mesaID = "";
    // let ubicacion = "";
    // let especial = "";
    let tStatus = "";
    let index = 0;
    let slicer = 0;

    let row = [];
    let inners = [];
    let myTabs = [];
    let spacer = [<tr key={uniqid()} />, <tr key={uniqid()} />];

    if (this.state.tablesList.length > 0) {
      this.state.tablesList.forEach((tab, ind) => {
        index = ind;
        tStatus = tab.estado;
        table = tab.numeroMesa;
        mesaID = tab._id;
        // ubicacion = tab.ubicacion;
        // especial = tab.especial;

        switch (tStatus.toLowerCase()) {
          case "ocupada":
            backCircle =
              " linear-gradient(135deg, rgba(255,175,75,1) 0%, rgba(255,183,1,1) 100%)";
            backSmallCircle = this.state.colorOcupada;
            backBorder = "#FCDB00";
            myTabs.push(
              <Table
                tableHandler={this.tableHandler}
                key={index}
                index={index}
                backCircle={backCircle}
                backSmallCircle={backSmallCircle}
                backBorder={backBorder}
                tableNumber={table}
                tableStatus={tStatus}
                mesaID={mesaID}
              />
            );
            break;
          case "reservada":
            backCircle =
              "linear-gradient(45deg, rgba(239,197,202,1) 0%, rgba(210,75,90,1) 1%, rgba(186,39,55,1) 51%, rgba(153,19,44,1) 100%)";
            backSmallCircle = this.state.colorReservada;
            backBorder = "#971E3A";
            myTabs.push(
              <Table
                tableHandler={this.tableHandler}
                key={index}
                index={index}
                backCircle={backCircle}
                backSmallCircle={backSmallCircle}
                backBorder={backBorder}
                tableNumber={table}
                tableStatus={tStatus}
                mesaID={mesaID}
              />
            );
            break;
          case "por cobrar":
            backCircle =
              "linear-gradient(to right, rgba(98,125,77,1) 0%, rgba(73,95,23,1) 100%)";
            backSmallCircle = this.state.colorCobrar;
            backBorder = "#7FA327";
            myTabs.push(
              <Table
                tableHandler={this.tableHandler}
                key={index}
                index={index}
                backCircle={backCircle}
                backSmallCircle={backSmallCircle}
                backBorder={backBorder}
                tableNumber={table}
                tableStatus={tStatus}
                mesaID={mesaID}
              />
            );
            break;
          case "por pagar":
            backCircle =
              "linear-gradient(to right, rgba(73,155,234,1) 0%, rgba(38,94,168,1) 100%)";
            backSmallCircle = this.state.colorPagar;
            backBorder = "#0091C4";
            myTabs.push(
              <Table
                tableHandler={this.tableHandler}
                key={index}
                index={index}
                backCircle={backCircle}
                backSmallCircle={backSmallCircle}
                backBorder={backBorder}
                tableNumber={table}
                tableStatus={tStatus}
                mesaID={mesaID}
              />
            );
            break;
          case "master":
            backCircle =
              "linear-gradient(to right, rgba(255,93,177,1) 0%, rgba(165,20,130,1) 100%)";
            backSmallCircle = this.state.colorPagar;
            backBorder = "#A51482";
            myTabs.push(
              <Table
                tableHandler={this.tableHandler}
                key={index}
                index={index}
                backCircle={backCircle}
                backSmallCircle={backSmallCircle}
                backBorder={backBorder}
                tableNumber={"M " + table}
                tableStatus={tStatus}
                mesaID={mesaID}
              />
            );
            break;
          case "slave":
            backCircle =
              "linear-gradient(to right, rgba(255,93,177,1) 0%, rgba(165,20,130,1) 100%)";
            backSmallCircle = this.state.colorPagar;
            backBorder = "#A51482";
            myTabs.push(
              <Table
                tableHandler={this.tableHandler}
                key={index}
                index={index}
                backCircle={backCircle}
                backSmallCircle={backSmallCircle}
                backBorder={backBorder}
                tableNumber={table}
                tableStatus={tStatus}
                mesaID={mesaID}
              />
            );
            break;
          default:
            backCircle =
              "linear-gradient(45deg, rgba(195,218,233,1) 0%, rgba(134,133,138,1) 100%)";
            backSmallCircle = this.state.colorFree;
            backBorder = "#D8D8DC";

            myTabs.push(
              <Table
                tableHandler={this.tableHandler}
                key={index}
                index={index}
                backCircle={backCircle}
                backSmallCircle={backSmallCircle}
                backBorder={backBorder}
                tableNumber={table}
                tableStatus={tStatus}
                mesaID={mesaID}
              />
            );
            break;
        }
      });

      for (let index = 0; index < myTabs.length; index++) {
        const tab = myTabs[index];
        slicer++;
        inners.push(<td key={slicer}>{tab} </td>);
        if (slicer === 9) {
          row.push(<tr key={index}>{inners}</tr>);
          row.push(spacer);
          slicer = 0;
          inners = [];
        } else if (slicer < 9 && index === myTabs.length - 1) {
          row.push(<tr key={index}>{inners}</tr>);
          row.push(spacer);
          slicer = 0;
          inners = [];
        }
      }
    }

    let modalType = "";

    if (this.state.emmitNotes === false) {
      modalType = (
        <WaiterSms
          Receiver={this.state.smsWaiter}
          smsSent={this.smsSentHandler}
        />
      );
    } else {
      modalType = (
        <ChangeTable
          typeDoc={this.state.typeDoc}
          sendDoc={this.sendDoc}
          origen={this.state.origen}
          code={this.state.code}
          justy={this.state.justy}
          typeHandler={this.typeHandler}
          mermaHandler={this.mermaHandler}
        />
      );
    }

    let documentos = lo.cloneDeep(this.state.documentos);
    let viewer = [];
    if (documentos.length > 0) {
      documentos.forEach(documento => {
        const refName = documento._id;
        viewer.push(
          <tr key={refName}>
            <td key={uniqid()}>
              <ReactTooltip />
              <div
                key={uniqid()}
                style={{
                  display: "flex",
                  height: "40px",
                  alignItems: "center"
                }}
              >
                <div
                  key={uniqid()}
                  style={{
                    display: "flex",
                    background: "#9ec446",
                    width: "130px",
                    height: "30px",
                    borderRadius: "25px",
                    fontWeight: "bold",
                    color: "#F3F3F4",
                    boxShadow: "0 4px 8px -2px #888",
                    fontSize: "0.7rem",
                    textAlign: "center",
                    alignItems: "center"
                  }}
                >{`${documento.documento.serie}-${
                  documento.documento.correlativo
                } ${documento.documento.nombreReceptor
                  .substring(0, 17)
                  .toUpperCase()} S/ ${documento.documento.mntTotal.toFixed(
                  2
                )}`}</div>
                <span
                  key={uniqid()}
                  style={{
                    width: "40px"
                  }}
                />
                <div key={uniqid()} className={classes.Mybutt}>
                  <i
                    data-tip="Imprimir"
                    onClick={() => this.printDocument(documento)}
                    key={uniqid()}
                    className="fas fa-print"
                    style={{
                      color: "#9ec446",
                      fontSize: "1.5rem",
                      boxShadow: "0 4px 8px -2px #888",
                      borderRadius: "25px"
                    }}
                  />
                </div>
                {/* <span
                    key={uniqid()}
                    style={{
                      width: "25px"
                    }}
                  />
                  <Online key={uniqid()} className={classes.Mybutt}>
                    <i
                      data-tip="NDC"
                      onClick={() => this.creditoDocument(documento)}
                      key={uniqid()}
                      className="fas fa-money-check-alt"
                      style={{
                        color: "#9ec446",
                        fontSize: "1.5rem",
                        boxShadow: "0 4px 8px -2px #888",
                        borderRadius: "2px"
                      }}
                    />
                  </Online> */}
                {/* <span
                    key={uniqid()}
                    style={{
                      width: "25px"
                    }}
                  />
                  <Online key={uniqid()} className={classes.Mybutt}>
                    <i
                      data-tip="NDB"
                      onClick={() => this.debitoDocument(documento)}
                      key={uniqid()}
                      className="fas fa-money-check"
                      style={{
                        color: "#9ec446",
                        fontSize: "1.5rem",
                        boxShadow: "0 4px 8px -2px #888",
                        borderRadius: "2px"
                      }}
                    />
                  </Online> */}
                <span
                  key={uniqid()}
                  style={{
                    width: "25px"
                  }}
                />
                <Online key={uniqid()} className={classes.Mybutt}>
                  <i
                    data-tip="Cancelar Documento"
                    onClick={() => this.bajaDocument(documento)}
                    key={uniqid()}
                    className="fas fa-caret-square-down"
                    style={{
                      color: "#9ec446",
                      fontSize: "1.6rem",
                      boxShadow: "0 4px 8px -2px #888",
                      borderRadius: "10px"
                    }}
                  />
                </Online>
              </div>
            </td>
          </tr>
        );
      });
    }

    return (
      <React.Fragment>
        <Modal
          show={this.state.smsing}
          clickOnBackDrop={this.clickOnBackDrop}
          top={this.state.top}
          left={this.state.left}
        >
          {modalType}
        </Modal>
        <div className={classes.CashierContainer}>
          <div className={classes.Carousel}>
            <div className={classes.CarouselChild}>
              <table>
                <tbody>{row}</tbody>
              </table>
            </div>
          </div>
          <div className={classes.Messages}>
            <div className={classes.TitleMessage}>
              <MultiButton
                textMultiButton={this.state.multiText}
                multiBackColor={"#9EC446"}
                multiWidth={"100%"}
                multiBorderRad={"200px"}
                multiFont={"1rem"}
                clicked={this.clickHandler}
              />
            </div>
            <div className={classes.MessagesChild}>
              <Employees
                employees={this.state.employees}
                empClicked={this.sendMessageHandler}
              />
            </div>
            <div className={classes.Documentos}>
              <table>
                <tbody>{viewer}</tbody>
              </table>
            </div>
          </div>
          <div className={classes.HighLights}>
            <div className={classes.HighLightChild}>
              <HighLights highTables={this.state.tables} />
            </div>
          </div>
          <div className={classes.Buttons}>
            <div className={classes.OverView}>
              <CashierButton clicked={this.resumerHandler} />
              {/* <OverViewButton overClicked={this.resumerHandler} /> */}
            </div>
            <div className={classes.Exit}>
              <ExitButton
                // logOutClicked={this.props.onGoLogout}
                backHandler={this.backHandler}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    tablesList: state.tablesList.Mesas,
    firstData: state.topBarState.firstData,
    fondoId: state.topBarState.fondoId,
    token: state.topBarState.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSaveClientZoho: client => dispatch(topBarActions.saveClientZoho(client)),
    onGetTables: () => dispatch(tablesActions.getTables()),
    onSetTableNumber: tableNumber =>
      dispatch(tablesActions.setTableNumber(tableNumber)),
    onGetMesaID: mesaID => dispatch(tablesActions.getMesaID(mesaID)),
    onSetTopBarVisibility: topBarVisibility =>
      dispatch(topBarActions.setTopBarVisibility(topBarVisibility)),
    onSetMesaEstado: estado => dispatch(tablesActions.setMesaEstado(estado)),
    onSaveToken: token => dispatch(topBarActions.saveToken(token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainCashier); // can pass null to mapState when needed
