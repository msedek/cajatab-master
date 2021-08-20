import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import _ from "underscore";

import classes from "./LoginScreen.scss";
import LoginScreenShape from "../../components/LoginScreenShape/LoginScreenShape";
import LoginScreenLabel from "../../components/LoginScreenLabel/LoginScreenLabel";
import MultiButton from "../../components/Buttons/MultiButton/MultiButton";
import IoEmail from "react-icons/lib/io/email";
import FaUser from "react-icons/lib/fa/user";
import FaLock from "react-icons/lib/fa/lock";
import FaMoney from "react-icons/lib/fa/money";
import Modal from "../../components/UI/Modal/Modal";
import OpenFound from "../../components/OpenFound/OpenFound";
import * as topBarActions from "../../store/actions/index";
import * as recargoActions from "../../store/actions/index";
import {
  END_POINT,
  ALERTA_INTERNA,
  APPLICATION_JSON,
  NOMBRE_REST,
  TOKEN_URL,
  AUTH,
  URL_SAVE_TOKE
} from "../../configs/configs";

class LoginScreen extends Component {
  state = {
    user: "",
    password: "",
    store: NOMBRE_REST,
    numCaja: "CAJA 01",
    settingFondo: false,
    userID: "",
    cantMoneda: "",
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
      dosCientosSolesBillete: 0
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
          reject(error.message); //TOMAR ACCIONES SI NO PUEDO TOAMR EL TOKEN
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
          this.props.onSaveToken(response.data.token);
          resolve("done");
        })
        .catch(error => {
          reject(error.message); //TOMAR ACCIONES SI NO PUEDO TOAMR EL TOKEN
        });
    });
  };

  componentDidMount() {
    this.props.onSetNombreCajero("");
    this.props.onSetMesaTitle("");
    this.props.onSetMozoTitle("");
    this.props.onSetCajeroId("");
    this.props.onGetRecargos();
    this.props.onSetTopBarVisibility("hidden");
    // this.settingsHandler(); //COMMENT
    // this.routerHandler("login"); //COMMENT
  }

  logInUser = id => {
    return new Promise((resolve, reject) => {
      axios
        .put(`${END_POINT}logInEmpleado/${id}`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: APPLICATION_JSON
        })
        .then(response => {
          this.props.onSetFondoId(response.data.fondoId);
          this.props.onSetCargo(response.data.cf_cargo);
          this.props.onSetNombreCajero(
            response.data.contact_name.toUpperCase()
          );
          resolve(response.data);
        })
        .catch(error => {
          reject.log(error.message);
        });
    });
  };

  addFondos = () => {
    let data = _.clone(this.state.fondo);
    data.totalFondo = this.state.totalFondo;
    data.empleado = this.state.userID;
    return new Promise((resolve, reject) => {
      axios
        .post(`${END_POINT}fondos`, data, {
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

  checkUser = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${END_POINT}empleados/${this.state.user}`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          if (response.data.length > 0) {
            let user = response.data.pop();
            if (
              this.state.password.toLowerCase() ===
              user.cf_clave_de_usuario.toLowerCase()
            ) {
              this.props.onSetCargo(user.cf_cargo);
              this.props.onSetFondoId(user.fondoId);
              resolve(user);
            } else {
              resolve("pn");
            }
          } else {
            resolve("un");
          }
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  checkUserSettings = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${END_POINT}empleados/${this.state.user}`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: APPLICATION_JSON
        })
        .then(response => {
          if (response.data.length > 0) {
            let user = response.data.pop();
            if (
              user.cf_cargo.includes("GEREN") ||
              user.cf_cargo.includes("ADMIN")
            ) {
              if (
                this.state.password.toLowerCase() ===
                user.cf_clave_de_usuario.toLowerCase()
              ) {
                this.props.onSetNombreCajero(user.contact_name.toUpperCase());
                resolve("goSettings");
              } else {
                resolve("pn");
              }
            } else {
              resolve("No autorizado");
            }
          } else {
            resolve("un");
          }
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  routerHandler = async source => {
    if (this.state.user === "") {
      alert("Coloque el DNI");
    } else if (this.state.password === "") {
      alert("Coloque el password");
    } else {
      const canLog = await this.checkUser().catch(err =>
        alert("Sin respuesta del servidor verifique la conexion")
      );
      if (canLog !== undefined) {
        if (canLog === "un") {
          alert("Usuario no registrado");
        } else if (canLog === "pn") {
          alert("Clave de usuario invalida");
        } else {
          if (source === "login" && !canLog.cf_cargo.includes("GEREN")) {
            this.props.onSetCajeroId(canLog._id);
            if (canLog.logged) {
              this.props.onSetNombreCajero(canLog.contact_name.toUpperCase());
              this.props.history.push("/maincashier");
            } else {
              this.setState({
                settingFondo: true,
                userID: canLog._id
              });
            }
          } else {
            if (canLog !== undefined) {
              if (!canLog.logged) {
                if (canLog.cf_cargo.includes("GEREN")) {
                  let data = await this.getFondo().catch(err =>
                    console.log(err)
                  );

                  for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    if (
                      element.cf_cargo === "CAJERO" &&
                      element.fondoId !== ""
                    ) {
                      this.props.onSetCajeroId(canLog._id);
                      this.props.onSetFondoId(element.fondoId);
                      this.props.onSetNombreCajero(
                        canLog.contact_name.toUpperCase()
                      );
                      this.props.onSetCargo(canLog.cf_cargo.toUpperCase());
                      break;
                    }
                  }
                  this.props.history.push("/maincashier");
                } else {
                  alert("Usuario no esta activo");
                }
              } else {
                const willLog = await this.logOutUser(canLog._id).catch(err =>
                  alert(ALERTA_INTERNA)
                );
                if (willLog !== undefined) {
                  alert("Cerro sesion Correctamente");
                  this.props.onSetNombreCajero("");
                  this.setState({
                    user: "",
                    password: "",
                    settingFondo: false,
                    userID: "",
                    cantMoneda: "",
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
                      dosCientosSolesBillete: 0
                    }
                  });
                }
              }
            }
          }
        }
      }
    }
  };

  getFondo = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${END_POINT}fondoactivo`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: APPLICATION_JSON
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  changeHandler = e => {
    let box = e.target.name;
    switch (box) {
      case "user":
        let dni = e.target.value;
        this.setState({
          user: dni
        });
        break;
      case "password":
        let pass = e.target.value;
        this.setState({
          password: pass
        });
        break;
      default:
        break;
    }
  };

  settingsHandler = async origin => {
    if (this.state.user === "") {
      alert("Coloque el DNI");
    } else if (this.state.password === "") {
      alert("Coloque el password");
    } else {
      const canLog = await this.checkUserSettings().catch(err =>
        alert("Sin respuesta del servidor verifique la conexion")
      );
      if (canLog !== undefined) {
        if (canLog === "goSettings") {
          switch (origin) {
            case "settings":
              this.props.history.push("/settings");
              break;
            case "warehouse":
              this.props.history.push("/warehouse");
              break;
            case "creditnotes":
              this.props.history.push("/creditnotes");
              break;
            default:
              this.props.history.push("/recipes");
              break;
          }
        } else {
          if (canLog === "un") {
            alert("Usuario no registrado");
          } else if (canLog === "pn") {
            alert("Clave de usuario invalida");
          } else if (canLog === "No autorizado") {
            alert(canLog);
          }
        }
      }
    }
  };

  clickOnBackDrop = () => {
    this.setState(
      {
        totalFondo: 0,
        comboSelection: "SELECCIONE MONEDAS",
        settingFondo: false,
        cantMoneda: "",
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
          dosCientosSolesBillete: 0
        }
      },
      () => {
        this.startTimer(100);
      }
    );
  };

  startTimer = duration => {
    setTimeout(() => {
      this.setState({ settingFondo: false });
    }, duration);
  };

  setFondofoHandler = async action => {
    switch (action) {
      case "abrir caja":
        if (this.state.totalFondo === 0) {
          alert("No ha agregado dinero al fondo");
        } else {
          const addFondos = await this.addFondos().catch(err =>
            alert(ALERTA_INTERNA)
          );
          if (addFondos !== undefined) {
            this.setState(
              {
                settingFondo: false
              },
              async () => {
                const willLog = await this.logInUser(this.state.userID).catch(
                  err => alert(ALERTA_INTERNA)
                );
                if (willLog !== undefined) {
                  let token = await this.getToken().catch(err =>
                    alert("No se pudo establecer conexion con SUNAT")
                  );
                  if (token) {
                    await this.saveToken(token).catch(err =>
                      alert(ALERTA_INTERNA)
                    );
                  }
                  this.props.onSetNombreCajero(
                    willLog.contact_name.toUpperCase()
                  );
                  this.props.history.push("/maincashier");
                }
              }
            );
          }
        }
        break;
      case "cancelar":
        this.setState(
          {
            totalFondo: 0,
            comboSelection: "SELECCIONE MONEDAS",
            settingFondo: false,
            cantMoneda: "",
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
              dosCientosSolesBillete: 0
            }
          },
          () => {
            this.startTimer(100);
          }
        );
        break;
      case "calcular":
        let cantMoneda = _.clone(this.state.cantMoneda);
        if (this.state.cantMoneda === "") {
          alert("Coloque la cantidad de apertura");
        } else {
          this.setState({ totalFondo: parseFloat(cantMoneda), cantMoneda: "" });
        }
        break;
      default:
        break;
    }
  };

  comboFondo = e => {
    this.setState({
      comboSelection: e.target.value
    });
  };

  cantMonedaHandler = e => {
    this.setState({
      cantMoneda: e.target.value
    });
  };

  render() {
    return (
      <React.Fragment>
        <Modal
          show={this.state.settingFondo}
          clickOnBackDrop={this.clickOnBackDrop}
          top={this.state.top}
          left={"40%"}
        >
          <OpenFound
            actionHandler={this.setFondofoHandler}
            cantMoneda={this.state.cantMoneda}
            dataFondo={this.state.dataFondo}
            totalFondo={this.state.totalFondo}
            cantMonedaHandler={this.cantMonedaHandler}
          />
        </Modal>
        <div className={classes.Login}>
          <div className={classes.Switch} />
          <div className={classes.SettingsParent}>
            <div className={classes.Settings}>
              <i
                className="fas fa-cogs"
                onClick={() => this.settingsHandler("settings")}
              />
              <span className={classes.Text} style={{ marginBottom: "5px" }}>
                Settings
              </span>
              <i
                className="fab fa-elementor"
                onClick={() => this.settingsHandler("recipes")}
              />
              <span className={classes.Text}>Recipes</span>
            </div>
            <span style={{ width: "50px" }} />
            <div className={classes.Storage}>
              <i
                className="fas fa-warehouse"
                onClick={() => this.settingsHandler("warehouse")}
              />
              <span className={classes.Text} style={{ marginBottom: "5px" }}>
                Almacen
              </span>
              <i
                className="far fa-sticky-note"
                onClick={() => this.settingsHandler("creditnotes")}
              />
              <span className={classes.Text}>NDC</span>
            </div>
          </div>

          <div className={classes.Store}>
            <LoginScreenLabel
              typeIcon={<IoEmail />}
              sizeIcon={"1.8rem"}
              value={this.state.store}
              changeHandler={this.changeHandler}
            />
          </div>
          <div className={classes.User}>
            <LoginScreenShape
              typeIcon={<FaUser />}
              sizeIcon={"1.8rem"}
              boxType="DNI"
              type={"number"}
              name={"user"}
              value={this.state.user}
              changeHandler={this.changeHandler}
            />
          </div>
          <div className={classes.Pass}>
            <LoginScreenShape
              typeIcon={<FaLock />}
              sizeIcon={"1.8rem"}
              boxType="Contrasena"
              type={"password"}
              name={"password"}
              value={this.state.password}
              changeHandler={this.changeHandler}
            />
          </div>
          <div className={classes.Cash}>
            <LoginScreenLabel
              typeIcon={<FaMoney />}
              sizeIcon={"1.8rem"}
              value={this.state.numCaja}
              changeHandler={this.changeHandler}
            />
          </div>
          <div className={classes.Button}>
            <MultiButton
              textMultiButton={"Entrar"}
              multiBackColor={"#9EC446"}
              multiWidth={"35.7954545454546%"}
              multiBorderRad={"200px"}
              clicked={() => this.routerHandler("login")}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetTopBarVisibility: topBarVisibility =>
      dispatch(topBarActions.setTopBarVisibility(topBarVisibility)),
    onSetNombreCajero: nombreCajero =>
      dispatch(topBarActions.setFirstData(nombreCajero)),
    onSetFondoId: id => dispatch(topBarActions.setFondoId(id)),
    onSetCajeroId: id => dispatch(topBarActions.setCajeroId(id)),
    onSetMesaTitle: data => dispatch(topBarActions.setFirstTop(data)),
    onSetMozoTitle: mozo => dispatch(topBarActions.setThirdTitle(mozo)),
    onSetCargo: cargo => dispatch(topBarActions.setCargo(cargo)),
    onSaveToken: token => dispatch(topBarActions.saveToken(token)),
    onGetRecargos: () => dispatch(recargoActions.getRecargos())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(LoginScreen);
