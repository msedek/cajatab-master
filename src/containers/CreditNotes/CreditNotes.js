import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import lo from "lodash";
import axios from "axios";
import uniqid from "uniqid";
import classes from "./CreditNotes.scss";
import {
  END_POINT,
  EMISSION_URL,
  TOKEN_URL_LOCAL
} from "../../configs/configs";

class CreditNotes extends Component {
  state = {
    documento: {},
    documentosData: [],
    documentos: [],
    searchSup: "",
    documentosBackup: {},
    activeRadio: "",
    pressedRadion: "",
    docuId: "",
    token: ""
  };

  supRef = React.createRef();
  guaRef = React.createRef();

  getDocuments = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${END_POINT}documentos`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(async response => {
          response.data = response.data.filter(doc => !doc.hasNdc);
          await this.setState({ documentosData: response.data });
          resolve(response.data);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  getToken = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(TOKEN_URL_LOCAL, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            responseType: "json"
          }
        })
        .then(async response => {
          await this.setState({ token: response.data[0].token });
          resolve();
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  componentDidMount = async () => {
    if (this.props.topBarState.firstData !== "") {
      const documentos = await this.getDocuments().catch(err => alert(err));
      await this.createDocList(documentos);
      await this.getToken().catch(err => alert(err));
    } else {
      this.backHandler();
    }
  };

  createDocList = documentos => {
    return new Promise(async (resolve, reject) => {
      let row = [];
      let comboIngre = lo.cloneDeep(this.state.comboIngre);

      documentos.forEach((documento, index) => {
        row.push(
          <tr key={uniqid()}>
            <td
              key={uniqid()}
              style={{
                color: "#4C5564",
                fontWeight: "bold",
                fontSize: "0.8rem"
              }}
            >
              {`${documento.documento.serie}-${
                documento.documento.correlativo
              }`}
            </td>
            <td
              key={uniqid()}
              style={{
                color: "#4C5564",
                fontWeight: "bold",
                fontSize: "0.8rem",
                textAlign: "center"
              }}
            >
              {documento.documento.serie.includes("B") ? "BOLETA" : "FACTURA"}
            </td>
            <td
              key={uniqid()}
              style={{
                color: "#4C5564",
                fontWeight: "bold",
                fontSize: "0.8rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "center" }}>
                <input
                  ref={input => {
                    this[`${index}`] = input;
                  }}
                  // value={`${index}`}
                  id={`${index}`}
                  type="radio"
                  name={"radio"}
                  // checked={this.state.activeRadio === `${index}`}
                  // value={this.state[`check${index}`]}
                  onChange={e => this.onCheckChangeDoc(e, documento)}
                />
              </div>
            </td>
          </tr>
        );

        if (documento.isSupply) {
          comboIngre.push(
            <option key={comboIngre.length} value={index}>
              {documento.name}
            </option>
          );
        }
      });

      row = lo.sortBy(row, dat => dat.props.children[0].props.children);
      let cloneRow = lo.cloneDeep(row);
      await this.setState({
        documentos: row,
        documentosBackup: cloneRow,
        comboIngre
      });
      resolve();
    });
  };

  onCheckChangeDoc = async (e, selDoc) => {
    let detalles = [];
    let impuestos = [];

    selDoc.detalle.forEach(detalle => {
      detalles.push(lo.omit(detalle, "_id"));
    });

    selDoc.impuesto.forEach(impuesto => {
      impuestos.push(lo.omit(impuesto, "_id"));
    });

    let documento = {
      descuento: lo.omit(selDoc.descuento, "_id"),
      impuesto: impuestos,
      detalle: detalles,
      fechaEmision: selDoc.fechaEmision,
      documento: lo.omit(selDoc.documento, "_id"),
      annexedItems: [],
      referencia: [
        {
          serieRef: selDoc.documento.serie,
          correlativoRef: selDoc.documento.correlativo,
          fechaEmisionRef: selDoc.fechaEmision,
          tipoDocumentoRef: selDoc.tipoDocumento
        }
      ],
      idTransaccion: `07-${selDoc.idTransaccion}`,
      tipoDocumento: "07" //NDC
    };

    let tipo = selDoc.tipoDocumento === "03" ? "Boleta" : "Factura";

    documento.documento.sustento = `Anulacion de la ${tipo}`;
    documento.documento.tipoMotivoNotaModificatoria = "03"; //ANULACION
    documento.documento.fechaVencimiento = selDoc.fechaEmision;
    documento.documento.tipoFormatoRepresentacionImpresa = "GENERAL";

    await this.setState({
      docuId: selDoc._id,
      documento,
      activeRadio: e.target.id,
      pressedRadion: e.target.id
    });
  };

  resetDocList = () => {
    let reset = lo.cloneDeep(this.state.documentosBackup);
    this.setState({ documentos: reset, searchSup: "" });
  };

  typeHandler = async i => {
    switch (i.target.name) {
      case "searchSup":
        await this.setState({ searchSup: i.target.value });
        let searched = lo.cloneDeep(this.state.searchSup);
        let docList = lo.cloneDeep(this.state.documentos);
        docList = lo.filter(docList, doc =>
          doc.props.children[0].props.children.includes(searched)
        );
        this.setState({ documentos: docList });
        break;
      default:
        break;
    }
  };

  keyPresHandler = e => {
    if (e.keyCode === 8) {
      let reset = lo.cloneDeep(this.state.documentosBackup);
      this.setState({ documentos: reset });
    }
  };

  backHandler = () => {
    this.props.history.push("/");
  };

  createNdc = async () => {
    let data = lo.cloneDeep(this.state.documento);
    if (this.state.activeRadio !== "") {
      let factiva = await this.processCredito(data).catch(err =>
        alert("Error de comunicacion")
      );
      if (factiva === "done") alert("Nota de credito creada con exito");
    }
  };

  saveNdc = data => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${END_POINT}notasdecredito/${this.state.docuId}`, data, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(async response => {
          let documentosData = lo.cloneDeep(this.state.documentosData);
          documentosData = documentosData.filter(
            doc => doc._id !== response.data._id
          );
          await this.createDocList(documentosData);
          await this.clearDocHandler("Formulario Limpio");
          this.setState({ documentosData });
          resolve("done");
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  processCredito = nCredito => {
    return new Promise(async (resolve, reject) => {
      const factiva = await this.facturActiva(
        nCredito,
        `Bearer ${this.state.token}`,
        EMISSION_URL
      ).catch(err => {
        reject(err);
      });
      if (factiva) {
        await this.saveNdc(nCredito).catch(err => console.log(err));
        resolve("done");
      }
    });
  };

  facturActiva = (data, auth, url) => {
    return new Promise((resolve, reject) => {
      axios
        .post(url, data, {
          headers: {
            CONTENT_TYPE: "application/json",
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

  clearDocHandler = async message => {
    let documento = {};

    if (this.state.pressedRadion !== "") {
      this[this.state.pressedRadion].checked = false;
    }

    await this.setState({
      documento,
      activeRadio: "",
      pressedRadion: "",
      docuId: ""
    });

    if (!message.includes("Limpio")) alert(message);
  };

  render() {
    return (
      <div className={classes.Container}>
        <div className={classes.Recipes}>
          <h3
            style={{
              marginBottom: "5px",
              fontWeight: "Bold",
              color: "#4C5564"
            }}
          >
            DATOS DEL DOCUMENTO
          </h3>
          <input
            className={classes.TextBox}
            type="text"
            name="sNameRec"
            id="sNameRec"
            defaultValue={
              this.state.documento.documento
                ? this.state.documento.documento.serie.includes("B")
                  ? "BOLETA"
                  : "FACTURA"
                : ""
            }
            disabled
            placeholder="Tipo de Documento"
          />
          <div className={classes.GroupUnityRec}>
            <input
              style={{ width: "160px" }}
              className={classes.TextBox}
              type="text"
              name="sRepoRec"
              id="sRepoRec"
              disabled
              defaultValue={
                this.state.documento.documento
                  ? this.state.documento.documento.serie
                  : ""
              }
              placeholder="Serie"
            />
            <span style={{ width: "20px" }} />
            <input
              style={{ width: "120px" }}
              className={classes.TextBox}
              type="number"
              name="sRepoRec"
              id="sRepoRec"
              disabled
              defaultValue={
                this.state.documento.documento
                  ? this.state.documento.documento.correlativo
                  : ""
              }
              placeholder="Correlativo"
            />
          </div>
          <input
            className={classes.TextBox}
            type="text"
            name="sNameRec"
            id="sNameRec"
            defaultValue={
              this.state.documento.fechaEmision
                ? this.state.documento.fechaEmision
                : ""
            }
            disabled
            placeholder="Fecha de Emisión"
          />
          <input
            className={classes.TextBox}
            type="text"
            name="sNameRec"
            id="sNameRec"
            defaultValue={
              this.state.documento.documento
                ? this.state.documento.documento.nombreReceptor
                : ""
            }
            disabled
            placeholder="Nombre del receptor"
          />
          <input
            className={classes.TextBox}
            type="text"
            name="sNameRec"
            id="sNameRec"
            defaultValue={
              this.state.documento.documento
                ? this.state.documento.documento.numDocReceptor
                : ""
            }
            disabled
            placeholder="Documento del receptor"
          />
          <input
            className={classes.TextBox}
            type="text"
            name="sNameRec"
            id="sNameRec"
            defaultValue={
              this.state.documento.documento
                ? `${this.state.documento.documento.mntTotal} S/`
                : ""
            }
            disabled
            placeholder="Monto Total"
          />
          <div className={classes.Buttons}>
            {this.state.activeRadio === "" ? (
              <React.Fragment>
                <i
                  style={{ marginRight: "5px", fontSize: "1.5rem" }}
                  className="fas fa-external-link-alt"
                  onClick={() => this.clearDocHandler("Formulario Limpio")}
                />
                <span className={classes.Text}>Limpiar</span>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <i
                  style={{ marginRight: "5px", fontSize: "1.5rem" }}
                  className="far fa-sticky-note"
                  onClick={this.createNdc}
                />
                <span className={classes.Text}>Emitir NDC</span>
              </React.Fragment>
            )}
            <span style={{ width: "30px" }} />
            {this.state.activeRadio === "" ? (
              ""
            ) : (
              <React.Fragment>
                <i
                  style={{ marginRight: "5px", fontSize: "1.5rem" }}
                  className="fas fa-external-link-alt"
                  onClick={() => this.clearDocHandler("Formulario Limpio")}
                />
                <span className={classes.Text}>Limpiar</span>
              </React.Fragment>
            )}
            <span style={{ width: "30px" }} />
          </div>
        </div>
        <div className={classes.RecipesList}>
          <h3
            style={{
              marginBottom: "10px",
              fontWeight: "Bold",
              color: "#4C5564"
            }}
          >
            DOCUMENTOS
          </h3>
          <div className={classes.HeadersContainer}>
            <div className={classes.SuppliesHeader}>
              <input
                className={classes.TextBox}
                style={{
                  marginBottom: "0",
                  width: "200px",
                  height: "25px",
                  fontSize: "0.8rem"
                }}
                type="text"
                name="searchSup"
                id="searchSup"
                default=""
                value={this.state.searchSup}
                onChange={this.typeHandler}
                placeholder="Buscar Documento"
                onKeyUp={this.keyPresHandler}
              />

              <table>
                <tbody>
                  <tr>
                    <th
                      style={{
                        width: "200px",
                        textAlign: "center",
                        background: "#9ec446",
                        borderTopLeftRadius: "4px"
                      }}
                    >
                      Serie - Correlativo
                    </th>
                    <th
                      style={{
                        width: "210px",
                        textAlign: "center",
                        background: "#9ec446",
                        borderTopLeftRadius: "4px"
                      }}
                    >
                      Tipo de Documento
                    </th>
                    <th
                      style={{
                        width: "50px",
                        textAlign: "center",
                        background: "#9ec446",
                        borderTopRightRadius: "4px"
                      }}
                    >
                      Sel
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={classes.RepContainer}>
            <table>
              <tbody>
                <tr>
                  <th
                    style={{
                      width: "200px"
                    }}
                  />
                  <th
                    style={{
                      width: "210px"
                    }}
                  />
                  <th
                    style={{
                      width: "50px"
                    }}
                  />
                </tr>
                {this.state.documentos}
              </tbody>
            </table>
          </div>
          <div className={classes.ButtonPos}>
            <i
              style={{ fontSize: "1.4rem" }}
              className="fas fa-arrow-left"
              onClick={this.backHandler}
            />
            <span style={{ width: "10px" }} />
            <span
              style={{
                color: "#4C5564",
                fontSize: "0.8rem",
                fontWeight: "bold"
              }}
            >
              Salir
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    topBarState: state.topBarState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    //   onGetRecargos: () => {
    //     dispatch(recargoActions.getRecargos());
    //   }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CreditNotes));
