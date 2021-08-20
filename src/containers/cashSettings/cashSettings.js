import React, { Component } from "react";
import { withRouter } from "react-router-dom"; //hack para quitar con redux
import { connect } from "react-redux";
import _ from "underscore";
import lo from "lodash";
import clean from "underscore.string/clean";
import axios from "axios";
import uniqid from "uniqid";

import classes from "./cashSettings.scss";
// import ButtonSave from "../../components/Buttons/ButtonSave/ButtonSave";
import HeaderTitleProduct from "../../components/HeaderTitle/HeaderTitleProduct/HeaderTitleProduct";
import ProductManagerShape from "../../components/ProductManagerShape/ProductManagerShape";
import { END_POINT, GO_ZOHO } from "../../configs/configs";
// import * as recargoActions from "../../store/actions/index";

class CashSettings extends Component {
  state = {
    tipoDescuento: "",
    montoDescuento: "",
    montoPorcentaje: "",
    tipoPago: "",
    mesa: "",
    tiposPago: [],
    tiposDescuento: [],
    cantMesas: [],
    pagoToDelete: null,
    descuentoToDelete: null,
    mesaToDelete: null,
    empleados: [],
    justies: [],
    empDni: "",
    empCargo: "",
    empCode: "",
    empID: "",
    empContact: "",
    justyCode: "",
    justyText: "",
    justyId: "",
    recargos: [],
    recargoState: false,
    recargoId: "",
    exitEnabler: true,
    colorBack: "#9ec446"
  };

  deleteJusty = () => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${END_POINT}justys/${this.state.justyId}`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          resolve("justy Eliminada con Exito");
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  deleteMesa = id => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${END_POINT}mesas/${id}`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          resolve("Mesa Eliminada con Exito");
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  deletePagos = id => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${END_POINT}pagos/${id}`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          resolve("Pago Eliminado con Exito");
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  deleteDescuentos = id => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${END_POINT}descuentos/${id}`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          resolve("Descuento Eliminado con Exito");
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  saveMesas = data => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${END_POINT}mesas/`, data, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          resolve("Mesa Guardada con Exito");
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  savePagos = data => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${END_POINT}pagos/`, data, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          resolve("Pago Guardado con Exito");
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  saveDescuentos = data => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${END_POINT}descuentos/`, data, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          resolve("Descuento Guardado con Exito");
        })
        .catch(error => {
          reject(error.message);
        });
    });
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
            this.setState({
              cantMesas: response.data
            });
            resolve("genera lista de mesas");
          } else {
            resolve("No hay mesas registradas");
          }
        })
        .catch(error => {
          reject(error.message);
        });
    });
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
              tiposPago: response.data
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
              tiposDescuento: response.data
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

  getEmpleados = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${END_POINT}empleados/`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          if (response.data.length > 0) {
            this.setState({
              empleados: response.data
            });
            resolve("empelados");
          } else {
            resolve("No hay empleados");
          }
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  getJusties = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${END_POINT}justies/`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          if (response.data.length > 0) {
            this.setState({
              justies: response.data
            });
            resolve("justies");
          } else {
            resolve("No hay justies");
          }
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  getRecargos = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${END_POINT}recargos/`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(async response => {
          //por ahora solo hay 1, hacer logica para mas
          await this.setState({
            recargos: response.data,
            recargoState: response.data[0].estado,
            recargoId: response.data[0]._id
          });
          resolve("recargos");
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  componentDidMount = async () => {
    // if (this.props.topBarState.firstData !== "") {
    let pagos = "";
    pagos = await this.getPagos().catch(err =>
      alert("Sin conexion con el servidor")
    );
    if (pagos !== undefined) {
      if (pagos === "No hay metodos de pago registrados") {
        alert(pagos);
      }
    }
    let descuentos = "";
    descuentos = await this.getDescuentos().catch(err =>
      alert("Sin conexion con el servidor")
    );
    if (descuentos !== undefined) {
      if (descuentos === "No hay descuentos registrados") {
        // alert(descuentos);
      }
    }
    let mesas = "";
    mesas = await this.getMesas().catch(err =>
      alert("Sin conexion con el servidor")
    );
    if (mesas !== undefined) {
      if (mesas === "No hay descuentos registrados") {
        alert(mesas);
      }
    }

    await this.getEmpleados().catch(err =>
      alert("No hay empleados registrados")
    );

    await this.getJusties().catch(err =>
      alert("No hay justificaciones registradas")
    );

    await this.getRecargos().catch(err => alert("No hay recargos registrados"));
    // } else {
    //   this.backHandler();
    // }
  };

  typeHandler = i => {
    switch (i.target.name) {
      case "descuento":
        this.setState({
          tipoDescuento: i.target.value
        });
        break;
      case "porcentaje":
        this.setState({
          montoPorcentaje: i.target.value
        });
        break;
      case "monto":
        this.setState({
          montoDescuento: i.target.value
        });
        break;
      case "pago":
        this.setState({
          tipoPago: i.target.value
        });
        break;
      case "mesa":
        this.setState({
          mesa: i.target.value
        });
        break;
      case "code":
        this.setState({
          empCode: i.target.value
        });
        break;
      case "justyText":
        this.setState({
          justyText: i.target.value
        });
        break;
      case "justyCode":
        this.setState({
          justyCode: i.target.value
        });
        break;
      default:
        break;
    }
  };

  checkDuplicate = from => {
    return new Promise((resolve, reject) => {
      if (from === "descuento") {
        if (this.state.tipoDescuento !== "") {
          if (this.state.tiposDescuento.length > 0) {
            let desc = _.clone(this.state.tipoDescuento);
            let cleanDesc = clean(desc).toLowerCase();
            this.state.tiposDescuento.forEach((descuento, index) => {
              if (cleanDesc === descuento.descuento.toLowerCase()) {
                resolve("Tipo de descuento ya existe");
              } else {
                if (index === this.state.tiposDescuento.length - 1) {
                  resolve("sigo");
                }
              }
            });
          } else {
            resolve("sigo");
          }
        } else {
          resolve("Debe llenar el tipo de descuento");
        }
      } else if (from === "mesa") {
        if (this.state.mesa !== "") {
          if (this.state.cantMesas.length > 0) {
            let mes = _.clone(this.state.mesa);
            let nume = parseInt(mes, 10);
            if (nume === 0) {
              resolve("Mesa no puede ser 0");
            } else if (nume < 10) {
              mes = "0" + mes;
            }
            this.state.cantMesas.forEach((mesa, index) => {
              if (mes === mesa.numeroMesa) {
                resolve("Mesa ya existe");
              } else {
                if (index === this.state.cantMesas.length - 1) {
                  resolve("sigo");
                }
              }
            });
          } else {
            resolve("sigo");
          }
        } else {
          resolve("Debe colocar el numero de Mesa");
        }
      } else {
        if (this.state.tipoPago !== "") {
          if (this.state.tiposPago.length > 0) {
            let pag = _.clone(this.state.tipoPago);
            let cleanPag = clean(pag).toLowerCase();
            this.state.tiposPago.forEach((pago, index) => {
              if (cleanPag === pago.pago.toLowerCase()) {
                resolve("Tipo de pago ya existe");
              } else {
                if (index === this.state.tiposPago.length - 1) {
                  resolve("sigo");
                }
              }
            });
          } else {
            resolve("sigo");
          }
        } else {
          resolve("Debe llenar el tipo de pago");
        }
      }
    });
  };

  createCode = () => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${END_POINT}createcode/`,
          {
            code: this.state.empCode,
            empleado: this.state.empID,
            contact_id: this.state.empContact
          },
          {
            headers: { "Access-Control-Allow-Origin": "*" },
            responseType: "json"
          }
        )
        .then(async response => {
          await this.setState({
            empDni: "",
            empCargo: "",
            empCode: "",
            empID: "",
            empContact: ""
          });
          resolve(response.data);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  createJusty = () => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${END_POINT}justys/`,
          {
            justy: this.state.justyCode,
            description: this.state.justyText
          },
          {
            headers: { "Access-Control-Allow-Origin": "*" },
            responseType: "json"
          }
        )
        .then(async response => {
          await this.setState({
            justyText: "",
            justyCode: "",
            justies: []
          });
          await this.getJusties().catch(err =>
            alert("No hay justificaciones registradas")
          );
          resolve(response.data);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  saveSettingsHandler = async (from, action) => {
    if (action.includes("saveCode")) {
      if (this.state.empID === "" || this.state.empCargo === "") {
        alert("Seleccione un empleado");
      } else if (this.state.empCode === "") {
        alert("Coloque el codigo");
      } else {
        await this.createCode();
      }
    } else if (action.includes("saveJusty")) {
      if (this.state.justyText === "") {
        alert("Escriba Descripcion");
      } else if (this.state.justyCode === "") {
        alert("Coloque el codigo");
      } else {
        await this.createJusty();
      }
    } else {
      let duplicate = await this.checkDuplicate(action);
      if (duplicate === "sigo") {
        if (action === "descuento") {
          if (this.state.tipoDescuento === "") {
            alert("Debe llenar el tipo de descuento");
          } else if (this.state.montoPorcentaje === "") {
            alert("Debe llenar el monto del porcentaje");
          } else if (this.state.montoDescuento === "") {
            alert("Debe llenar el monto maximo para el descuento");
          } else {
            let desc = _.clone(this.state.tipoDescuento);
            let porc = _.clone(this.state.montoPorcentaje);
            let max = _.clone(this.state.montoDescuento);
            let data = {
              descuento: clean(desc),
              porcentaje: porc.replace(/ /g, ""),
              maximo: max.replace(/ /g, "")
            };
            const saveDescuentos = await this.saveDescuentos(data).catch(err =>
              alert("Problema de conexion con el servidor")
            );
            if (saveDescuentos !== undefined) {
              alert(saveDescuentos);
              this.setState({
                tipoDescuento: "",
                montoDescuento: "",
                montoPorcentaje: ""
              });
              this.getDescuentos();
            }
          }
        } else if (action === "mesa") {
          if (this.state.mesa === "") {
            alert("Debe colocar numero de mesa");
          } else {
            let mesa = _.clone(this.state.mesa);
            let data = {
              numeroMesa: clean(mesa)
            };
            const saveMesa = await this.saveMesas(data).catch(err =>
              alert("Problema de conexion con el servidor")
            );
            if (saveMesa !== undefined) {
              this.getMesas();
              alert(saveMesa);
              this.setState({
                mesa: ""
              });
            }
          }
        } else {
          if (this.state.tipoPago === "") {
            alert("Debe llenar el tipo de pago");
          } else {
            let pago = _.clone(this.state.tipoPago);
            let data = {
              pago: clean(pago)
            };
            const savePagos = await this.savePagos(data).catch(err =>
              alert("Problema de conexion con el servidor")
            );
            if (savePagos !== undefined) {
              this.getPagos();
              alert(savePagos);
              this.setState({
                tipoPago: ""
              });
            }
          }
        }
      } else {
        alert(duplicate);
      }
    }
  };

  onChangeHandler = data => {
    let pago = _.has(data, "pago");
    let mesa = _.has(data, "numeroMesa");
    let empleado = _.has(data, "contact_name");
    let justificacion = _.has(data, "description");

    if (pago) {
      this.setState({
        pagoToDelete: data._id
      });
    } else if (mesa) {
      this.setState({
        mesaToDelete: data._id
      });
    } else if (empleado) {
      this.setState({
        empDni: data.cf_dni_cliente,
        empCargo: data.cf_cargo,
        empID: data._id,
        empContact: data.contact_id
      });
    } else if (justificacion) {
      this.setState({
        justyId: data._id
      });
    } else {
      this.setState({
        descuentoToDelete: data._id
      });
    }
  };

  deleteSettingsHandler = async (e, val) => {
    if (val === "deletePago") {
      if (this.state.pagoToDelete === null) {
        alert("Seleccione metodo de pago a eliminar");
      } else {
        const deletePago = await this.deletePagos(
          this.state.pagoToDelete
        ).catch(err => alert("No hay conexion con el servidor"));
        if (deletePago !== undefined) {
          alert(deletePago);
          this.setState(
            {
              pagoToDelete: null,
              tiposPago: []
            },
            async () => {
              await this.getPagos();
            }
          );
        }
      }
    } else if (val === "deleteMesa") {
      if (this.state.mesaToDelete === null) {
        alert("Seleccione mesa a eliminar");
      } else {
        const deleteMesa = await this.deleteMesas(
          this.state.mesaToDelete
        ).catch(err => alert("No hay conexion con el servidor"));
        if (deleteMesa !== undefined) {
          alert(deleteMesa);
          this.setState(
            {
              mesaToDelete: null,
              cantMesas: []
            },
            async () => {
              await this.getMesas();
            }
          );
        }
      }
    } else if (val === "deleteJusty") {
      if (this.state.justyId === "") {
        alert("Seleccione concepto a eliminar");
      } else {
        await this.deleteJusty().catch(err =>
          alert("No hay conexion con el servidor")
        );
        alert("Justificacion eliminada");
        await this.setState({ justies: [], justyId: "" });
        this.getJusties().catch(err =>
          alert("No hay conexion con el servidor")
        );
      }
    } else {
      if (this.state.descuentoToDelete === null) {
        alert("Seleccione descuento a eliminar");
      } else {
        const deleteDescuento = await this.deleteDescuentos(
          this.state.descuentoToDelete
        ).catch(err => alert("No hay conexion con el servidor"));
        if (deleteDescuento !== undefined) {
          alert(deleteDescuento);
          this.setState(
            {
              descuentoToDelete: null,
              tiposDescuento: []
            },
            async () => {
              await this.getDescuentos();
            }
          );
        }
      }
    }
  };

  backHandler = () => {
    this.props.history.push("/");
  };

  turnOffRecargo = () => {
    return new Promise((resolve, reject) => {
      axios
        .put(`${END_POINT}recargos/${this.state.recargoId}`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(async response => {
          //por ahora solo hay 1 hacer logica para mas
          await this.setState({
            recargoState: response.data.estado
          });
          resolve("recargos");
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  settingsCheckHandler = async e => {
    await this.turnOffRecargo();
  };

  resetZohoYacho = async () => {
    await this.setState({ exitEnabler: false, colorBack: "red" });
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${END_POINT}resetzoho`,
          { action: "reset" },
          {
            headers: { "Access-Control-Allow-Origin": "*" },
            responseType: "json"
          }
        )
        .then(async response => {
          // console.log(response.data);
          await this.setState({ exitEnabler: true, colorBack: "#9ec446" });
          resolve();
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  render() {
    let recargos = [];
    let recData = lo.cloneDeep(this.state.recargos);

    recData.forEach(element => {
      recargos.push(
        <div className={classes.Switch} key={uniqid()}>
          <input
            className={classes.CheckSw}
            onChange={this.settingsCheckHandler}
            type="checkbox"
            name="checkbox"
            id="checkbox_id"
            checked={this.state.recargoState}
          />
          <label className={classes.LabelSw} htmlFor="checkbox_id">
            {element.nombre}
          </label>
        </div>
      );
    });

    return (
      <div className={classes.Container}>
        <div className={classes.ContainerTop}>
          <div className={classes.ZoneData}>
            <div className={classes.Buttons}>
              {/* <ButtonSave
                confGridRows={"43% 5% 1fr"}
                confPaddingTop={"0rem"}
                confMarginLeftIcon={"0"}
                confMarginLeftText={"0"}
                clicked={this.saveSettingsHandler}
                action={"Guardar Desc."}
                from={"descuento"}
              /> */}

              <div className={classes.DeleteDescuento}>
                <div className={classes.DeleteButton}>
                  <i
                    className="fas fa-download"
                    onClick={e => this.saveSettingsHandler(e, "descuento")}
                  />
                  <span className={classes.Text}>Guardar</span>
                </div>
              </div>
              <div className={classes.DeleteDescuento}>
                <div className={classes.DeleteButton}>
                  <i
                    className="fas fa-trash-alt"
                    onClick={e =>
                      this.deleteSettingsHandler(e, "deleteDescuento")
                    }
                  />
                  <span className={classes.Text}>Eliminar</span>
                </div>
              </div>
            </div>
            <div className={classes.Information}>
              <div className={classes.Data}>
                <span className={classes.Text2}>Tipo de Desc.</span>
                <span className={classes.Text3}>Porcentaje</span>
                <span className={classes.Text1}>Monto Maximo S/.</span>
              </div>
              <div className={classes.TextBox}>
                <input
                  className={classes.TextBox2}
                  type="text"
                  name="descuento"
                  id="descuento"
                  value={this.state.tipoDescuento}
                  onChange={this.typeHandler}
                />
                <input
                  className={classes.TextBox3}
                  type="number"
                  name="porcentaje"
                  id="porcentaje"
                  value={this.state.montoPorcentaje}
                  onChange={this.typeHandler}
                />
                <input
                  className={classes.TextBox1}
                  type="number"
                  name="monto"
                  id="monto"
                  value={this.state.montoDescuento}
                  onChange={this.typeHandler}
                />
              </div>
            </div>
          </div>
          <div className={classes.ZoneData2}>
            <div className={classes.Buttons2}>
              {/* <ButtonSave
                confGridRows={"43% 5% 1fr"}
                confPaddingTop={"0rem"}
                confMarginLeftIcon={"0"}
                confMarginLeftText={"0"}
                clicked={this.saveSettingsHandler}
                action={"Guardar Pago"}
                from={"pago"}
              /> */}

              <div className={classes.DeleteDescuento}>
                <div className={classes.DeleteButton}>
                  <i
                    className="fas fa-download"
                    onClick={e => this.saveSettingsHandler(e, "pago")}
                  />
                  <span className={classes.Text}>Guardar</span>
                </div>
              </div>
              <div className={classes.DeleteDescuento}>
                <div className={classes.DeleteButton}>
                  <i
                    className="fas fa-trash-alt"
                    onClick={e => this.deleteSettingsHandler(e, "deletePago")}
                  />
                  <span className={classes.Text}>Eliminar</span>
                </div>
              </div>
            </div>
            <div className={classes.Information2}>
              <div className={classes.Data2}>
                <span className={classes.Text32}>Tipo de Pago</span>
              </div>
              <div className={classes.TextBox2}>
                <input
                  className={classes.TextBox32}
                  type="text"
                  name="pago"
                  id="pago"
                  value={this.state.tipoPago}
                  onChange={this.typeHandler}
                />
              </div>
            </div>
          </div>
          <div className={classes.ZoneData3}>
            <div className={classes.Buttons3}>
              {/* <ButtonSave
                confGridRows={"43% 5% 1fr"}
                confPaddingTop={"0rem"}
                confMarginLeftIcon={"0"}
                confMarginLeftText={"0"}
                clicked={this.saveSettingsHandler}
                action={"Guardar Mesa"}
                from={"mesa"}
              /> */}

              <div className={classes.DeleteDescuento}>
                <div className={classes.DeleteButton}>
                  <i
                    className="fas fa-download"
                    onClick={e => this.saveSettingsHandler(e, "mesa")}
                  />
                  <span className={classes.Text}>Guardar</span>
                </div>
              </div>
              <div className={classes.DeleteDescuento}>
                <div className={classes.DeleteButton}>
                  <i
                    className="fas fa-trash-alt"
                    onClick={e => this.deleteSettingsHandler(e, "deleteMesa")}
                  />
                  <span className={classes.Text}>Eliminar</span>
                </div>
              </div>
            </div>
            <div className={classes.Information3}>
              <div className={classes.Data3}>
                <span className={classes.Text33}>Nro. Mesa</span>
              </div>
              <div className={classes.TextBox23}>
                <input
                  className={classes.TextBox33}
                  type="number"
                  name="mesa"
                  id="mesa"
                  value={this.state.mesa}
                  onChange={this.typeHandler}
                />
              </div>
            </div>
          </div>
          <div className={classes.ZoneList}>
            <div className={classes.ZoneCenterCoste}>
              <div className={classes.ZoneTitle}>
                <HeaderTitleProduct
                  spanText={"Tipos de Descuento"}
                  confFontSize={"1rem"}
                />
              </div>
              <div className={classes.List}>
                <ProductManagerShape
                  data={this.state.tiposDescuento}
                  origen={"descuentos"}
                  onChangeHandler={this.onChangeHandler}
                  confHeight={"145px"}
                  confGridColumns={"4.5% 1fr 4%"}
                  confMarfinLeftBox={"-5rem"}
                />
              </div>
            </div>
          </div>
          <div className={classes.ZoneList2}>
            <div className={classes.ZoneCenterCoste2}>
              <div className={classes.ZoneTitle}>
                <HeaderTitleProduct
                  spanText={"Tipos de Pago"}
                  confFontSize={"1rem"}
                />
              </div>
              <div className={classes.List}>
                <ProductManagerShape
                  data={this.state.tiposPago}
                  origen={"pagos"}
                  onChangeHandler={this.onChangeHandler}
                  confHeight={"145px"}
                  confGridColumns={"4.5% 1fr 4%"}
                  confMarfinLeftBox={"-5rem"}
                />
              </div>
            </div>
          </div>
          <div className={classes.ZoneList3}>
            <div className={classes.ZoneCenterCoste3}>
              <div className={classes.ZoneTitle}>
                <HeaderTitleProduct spanText={"Mesas"} confFontSize={"1rem"} />
              </div>
              <div className={classes.List}>
                <ProductManagerShape
                  data={this.state.cantMesas}
                  origen={"mesas"}
                  onChangeHandler={this.onChangeHandler}
                  confHeight={"145px"}
                  confGridColumns={"4.5% 1fr 4%"}
                  confMarfinLeftBox={"-5rem"}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={classes.ContainerBottom}>
          <div className={classes.ZoneData}>
            <div className={classes.Buttons}>
              {/* <ButtonSave
                confGridRows={"43% 5% 1fr"}
                confPaddingTop={"0rem"}
                confMarginLeftIcon={"0"}
                confMarginLeftText={"0"}
                clicked={this.saveSettingsHandler}
                action={"Guardar Desc."}
                from={"descuento"}
              /> */}

              <div className={classes.DeleteDescuento}>
                <div className={classes.DeleteButton}>
                  <i
                    className="fas fa-download"
                    onClick={e => this.saveSettingsHandler(e, "saveCode")}
                  />
                  <span className={classes.Text}>Guardar</span>
                </div>
              </div>
              {/* <div className={classes.DeleteDescuento}>
                <div className={classes.DeleteButton}>
                  <i
                    className="fas fa-trash-alt"
                    onClick={e => this.deleteSettingsHandler(e, "deleteCode")}
                  />
                  <span className={classes.Text}>Eliminar</span>
                </div>
              </div> */}
            </div>
            <div className={classes.Information}>
              <div className={classes.Data}>
                <span className={classes.Text2}>DNI.</span>
                <span className={classes.Text3}>Cargo.</span>
                <span className={classes.Text1}>Codigo.</span>
              </div>
              <div className={classes.TextBox}>
                <input
                  className={classes.TextBox2}
                  type="text"
                  name="dni"
                  id="dni"
                  value={this.state.empDni}
                  onChange={this.typeHandler}
                />
                <input
                  className={classes.TextBox3}
                  type="text"
                  name="cargo"
                  id="cargo"
                  value={this.state.empCargo}
                  onChange={this.typeHandler}
                />
                <input
                  className={classes.TextBox1}
                  type="number"
                  name="code"
                  id="code"
                  value={this.state.empCode}
                  onChange={this.typeHandler}
                />
              </div>
            </div>
          </div>
          <div className={classes.ZoneData2}>
            <div className={classes.Buttons2}>
              {/* <ButtonSave
                confGridRows={"43% 5% 1fr"}
                confPaddingTop={"0rem"}
                confMarginLeftIcon={"0"}
                confMarginLeftText={"0"}
                clicked={this.saveSettingsHandler}
                action={"Guardar Pago"}
                from={"pago"}
              /> */}

              <div className={classes.DeleteDescuento}>
                <div className={classes.DeleteButton}>
                  <i
                    className="fas fa-download"
                    onClick={e => this.saveSettingsHandler(e, "saveJusty")}
                  />
                  <span className={classes.Text}>Guardar</span>
                </div>
              </div>
              <div className={classes.DeleteDescuento}>
                <div className={classes.DeleteButton}>
                  <i
                    className="fas fa-trash-alt"
                    onClick={e => this.deleteSettingsHandler(e, "deleteJusty")}
                  />
                  <span className={classes.Text}>Eliminar</span>
                </div>
              </div>
            </div>
            <div className={classes.Information2}>
              <div className={classes.Data}>
                <span className={classes.Text2}>Justificacion</span>
                <span className={classes.Text1}>Codigo.</span>
              </div>
              <div className={classes.TextBox}>
                <input
                  className={classes.TextBox2}
                  type="text"
                  name="justyText"
                  id="justyText"
                  value={this.state.justyText}
                  onChange={this.typeHandler}
                />
                <input
                  className={classes.TextBox3}
                  type="number"
                  name="justyCode"
                  id="justyCode"
                  value={this.state.justyCode}
                  onChange={this.typeHandler}
                />
                <div className={classes.TextBox1} />
              </div>
            </div>
          </div>
          <div className={classes.ZoneList}>
            <div className={classes.ZoneCenterCoste}>
              <div className={classes.ZoneTitle}>
                <HeaderTitleProduct
                  spanText={"Empleado"}
                  confFontSize={"1rem"}
                />
              </div>
              <div className={classes.List}>
                <ProductManagerShape
                  data={this.state.empleados}
                  origen={"empleados"}
                  onChangeHandler={this.onChangeHandler}
                  confHeight={"145px"}
                  confGridColumns={"4.5% 1fr 4%"}
                  confMarfinLeftBox={"-5rem"}
                />
              </div>
            </div>
          </div>
          <div className={classes.ZoneList2}>
            <div className={classes.ZoneCenterCoste2}>
              <div className={classes.ZoneTitle}>
                <HeaderTitleProduct
                  spanText={"Justificacion"}
                  confFontSize={"1rem"}
                />
              </div>
              <div className={classes.List}>
                <ProductManagerShape
                  data={this.state.justies}
                  origen={"justificacion"}
                  onChangeHandler={this.onChangeHandler}
                  confHeight={"145px"}
                  confGridColumns={"4.5% 1fr 4%"}
                  confMarfinLeftBox={"-5rem"}
                />
              </div>
            </div>
          </div>
          <div className={classes.ZoneList3B}>
            <h2>Settings</h2>
            <div>{recargos}</div>
            {GO_ZOHO ? (
              <div
                style={{ backgroundColor: this.state.colorBack }}
                className={classes.SettingButton}
                onClick={this.state.exitEnabler ? this.resetZohoYacho : null}
              >
                Reset Server
              </div>
            ) : (
              ""
            )}
            {GO_ZOHO ? (
              this.state.exitEnabler ? (
                <div className={classes.ExitButton}>
                  <i
                    style={{
                      fontSize: "1.5rem",
                      color: "#9ec446"
                    }}
                    className="fas fa-arrow-left"
                    onClick={this.backHandler}
                  />
                  <span className={classes.Text}>Salir Setts.</span>
                </div>
              ) : (
                ""
              )
            ) : (
              <div className={classes.ExitButton}>
                <i
                  style={{
                    fontSize: "1.5rem",
                    color: "#9ec446"
                  }}
                  className="fas fa-arrow-left"
                  onClick={this.backHandler}
                />
                <span className={classes.Text}>Salir Setts.</span>
              </div>
            )}
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
)(withRouter(CashSettings));
