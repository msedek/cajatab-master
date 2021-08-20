import React, { Component } from "react";
import { withRouter } from "react-router-dom"; //hack para quitar con redux
import { connect } from "react-redux";
import lo from "lodash";
import axios from "axios";
// import FaCaretDown from "react-icons/lib/fa/caret-down";
import uniqid from "uniqid";
import ReactTooltip from "react-tooltip";

import classes from "./WareHouse.scss";
import { END_POINT } from "../../configs/configs";

class WareHouse extends Component {
  state = {
    //INSUMOS
    supply: {
      _id: "",
      nombre: "",
      unidad: "",
      msku: "", //AUTOINC IN DB
      reorder_level: "",
      cf_familia: "",
      image_name: "", //FROM BD
      cf_subfamilia: "",
      cf_temperatura: "",
      inventory_account: "",
      purchase_description: "",
      purchase_account: "",
      purchase_price: "",
      selling_price: "",
      sales_account: "",
      brand: "",
      tax_name: "igv",
      tax_percentage: 0.18,
      centro_de_costo: "",
      existence: "",
      past_purchase_date: "",
      purchase_quantity: ""
    },
    comboIngre: [],
    center: "",
    suppliesData: [],
    suppliesDataBackup: [],
    recipesData: [],
    supplies: [],
    recipes: [],
    searchSup: "",
    suppliesBackup: {},
    recipesBackup: {},
    activeRadio: "",
    activeRadioRep: "",
    pressedRadion: "",
    pressedRadionRep: "",
    insumoSchema: {
      recetaYacho: "",
      cantidad: "",
      unidad: "",
      id: ""
    },
    selIngre: "",
    selIngreId: ""
  };

  getSupplies = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${END_POINT}insumos`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(async response => {
          response.data.forEach(element => {
            if (element.cf_temperatura.length > 0) {
              element.cf_temperatura = "Si";
            } else {
              element.cf_temperatura = "No";
            }
          });
          let suppliesDataBackup = lo.cloneDeep(response.data);
          await this.setState({
            suppliesData: response.data,
            suppliesDataBackup
          });
          await this.createAlm(response.data);
          resolve(response.data);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  updateSupply = data => {
    return new Promise((resolve, reject) => {
      axios
        .put(`${END_POINT}compra/${data._id}`, data, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "application/json"
        })
        .then(async response => {
          let suppliesData = lo.cloneDeep(this.state.suppliesData);
          suppliesData = suppliesData.filter(
            sup => sup._id !== response.data._id
          );
          suppliesData.push(response.data);
          await this.createSupList(suppliesData);
          await this.createAlm(suppliesData);
          await this.setState({ suppliesData });
          this.clearSupplyHandler("Compra registrada con exito");
          resolve();
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  componentDidMount = async () => {
    if (this.props.topBarState.firstData !== "") {
      const supplies = await this.getSupplies().catch(err => alert(err));
      await this.createSupList(supplies);
    } else {
      this.backHandler();
    }
  };

  createAlm = suppliesAlm => {
    return new Promise(async (resolve, reject) => {
      let row = [];

      suppliesAlm.forEach((supply, index) => {
        let color = "";
        let base = parseFloat(supply.reorder_level);
        let normal = base * 1.45;
        let mid = base * 1.15;

        if (supply.existence >= normal) color = "#9ec446";
        if (supply.existence < normal && supply.existence >= mid)
          color = "#ffb701";
        if (supply.existence < mid) color = "#e70050";

        row.push(
          <tr key={supply._id}>
            <td
              key={uniqid()}
              style={{
                color: "#4C5564",
                fontWeight: "bold",
                fontSize: "0.8rem"
              }}
            >
              {supply.nombre}
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
              {`${supply.existence.toFixed(2)} - ${supply.unidad}`}
            </td>
            <td
              key={uniqid()}
              style={{
                background: color,
                boxShadow: "0 4px 8px -2px #888"
              }}
            />
          </tr>
        );
      });

      row = lo.sortBy(row, dat => dat.props.children[0].props.children);
      let cloneRow = lo.cloneDeep(row);
      await this.setState({
        suppliesAlm: row,
        suppliesAlmBackup: cloneRow
      });
      resolve();
    });
  };

  createSupList = supplies => {
    return new Promise(async (resolve, reject) => {
      let row = [];
      let state = lo.cloneDeep(this.state);
      supplies.forEach(index => {
        let ch = false;
        let checkName = `${index}`;
        this[checkName] = React.createRef;
        state[checkName] = ch;
      });

      await this.setState({ ...state });

      supplies.forEach((supply, index) => {
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
              {supply.nombre}
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
                  onChange={e => this.onCheckChange(e, supply)}
                />
              </div>
            </td>
          </tr>
        );
      });

      row = lo.sortBy(row, dat => dat.props.children[0].props.children);

      let cloneRow = lo.cloneDeep(row);
      await this.setState({
        supplies: row,
        suppliesBackup: cloneRow
      });
      resolve();
    });
  };

  onCheckChange = async (e, supply) => {
    await this.setState({
      activeRadio: e.target.id,
      supply,
      pressedRadion: e.target.id
    });
  };

  typeHandler = async i => {
    let supply = lo.cloneDeep(this.state.supply);
    switch (i.target.name) {
      case "sPurchase":
        if (supply.nombre !== "") {
          supply.purchase_quantity = parseFloat(i.target.value);
          await this.setState({ supply });
        } else {
          alert("Seleccione un insumo");
          i.target.value = "";
          supply.purchase_quantity = "";
          await this.setState({ supply });
        }
        break;
      case "searchSup":
        await this.setState({ searchSup: i.target.value });
        let searched = lo.cloneDeep(this.state.searchSup);
        let supplies = lo.cloneDeep(this.state.supplies);
        let suppliesData = lo.cloneDeep(this.state.suppliesData);
        let alm = [];
        supplies = lo.filter(supplies, (sup, index) => {
          if (suppliesData[index].nombre.includes(searched)) {
            alm.push(suppliesData[index]);
          }
          return sup.props.children[0].props.children.includes(searched);
        });
        await this.createAlm(alm);
        this.setState({ supplies, suppliesData: alm });
        break;
      default:
        break;
    }
  };

  resetSupplyList = () => {
    let reset = lo.cloneDeep(this.state.suppliesBackup);
    this.setState({ supplies: reset, searchSup: "" });
  };

  keyPresHandler = async e => {
    if (e.keyCode === 8) {
      let reset = lo.cloneDeep(this.state.suppliesBackup);
      let reset2 = lo.cloneDeep(this.state.suppliesDataBackup);
      await this.createAlm(reset2);
      this.setState({ supplies: reset, suppliesData: reset2 });
    }
  };

  backHandler = () => {
    this.props.history.push("/");
  };

  editSupplyHandlrer = async () => {
    let data = lo.cloneDeep(this.state.supply);
    if (data.purchase_quantity === 0 || data.purchase_quantity === "") {
      alert("Debe ingresar cantidad comprada");
    } else {
      await this.updateSupply(data).catch(err =>
        alert("Error de comunicacion")
      );
    }
  };

  clearSupplyHandler = async message => {
    let supply = {
      _id: "",
      nombre: "",
      unidad: "",
      msku: "",
      reorder_level: "",
      cf_familia: "",
      image_name: "",
      cf_subfamilia: "",
      cf_temperatura: "",
      inventory_account: "",
      purchase_description: "",
      purchase_account: "",
      purchase_price: "",
      selling_price: "",
      sales_account: "",
      brand: "",
      tax_name: "igv",
      tax_percentage: 0.18,
      centro_de_costo: "",
      existence: "",
      past_purchase_date: "",
      purchase_quantity: ""
    };

    if (this.state.pressedRadion !== "") {
      this[this.state.pressedRadion].checked = false;
    }

    await this.setState({
      supply,
      activeRadio: "",
      pressedRadion: ""
    });

    alert(message);
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
    return `${day}/${month}/${year}`;
  };

  estimateTotal = async () => {
    if (this.state.supply.nombre !== "") {
      let supply = lo.cloneDeep(this.state.supply);
      let date = new Date();
      let formatedDate = this.formatDate(date);
      supply.existence =
        supply.existence + parseFloat(supply.purchase_quantity);
      supply.past_purchase_date = formatedDate;
      await this.setState({ supply });
    }
  };

  printList = () => {
    alert("Imprimio lista de compras");
  };

  render() {
    return (
      <div className={classes.Container}>
        <ReactTooltip />
        <div className={classes.Supplies}>
          <h3
            style={{
              marginBottom: "10px",
              fontWeight: "Bold",
              color: "#4C5564"
            }}
          >
            INGRESAR COMPRA DE INSUMO
          </h3>

          <input
            className={classes.TextBox}
            type="text"
            name="sName"
            onBlur={() => this.handleValidation("nombre")}
            id="sName"
            defaultValue={this.state.supply.nombre}
            disabled
            placeholder="Nombre del insumo"
            data-tip="Nombre del insumo"
          />

          <div className={classes.GroupUnitySup}>
            <input
              style={{ width: "160px" }}
              className={classes.TextBox}
              type="text"
              name="sRepo"
              id="sRepo"
              defaultValue={this.state.supply.reorder_level}
              disabled
              // onChange={this.typeHandler}
              placeholder="Nivel de Reposicion"
              data-tip="Nivel de Reposicion"
            />

            <span style={{ width: "20px" }} />

            <input
              style={{ width: "120px" }}
              className={classes.TextBox}
              type="text"
              name="sUnid"
              id="sUnid"
              defaultValue={this.state.supply.unidad}
              disabled
              // onChange={this.typeHandler}
              placeholder="Unidad"
              data-tip="Unidad"
            />
          </div>

          <input
            className={classes.TextBox}
            type="String"
            name="sPriceCom"
            id="sPriceCom"
            defaultValue={this.state.supply.purchase_price}
            disabled
            // onChange={this.typeHandler}
            placeholder="Precio de Compra S/"
            data-tip="Precio de Compra S/"
          />

          <input
            className={classes.TextBox}
            type="text"
            name="sPriceVen"
            id="sPriceVen"
            defaultValue={this.state.supply.past_purchase_date}
            disabled
            // onChange={this.typeHandler}
            placeholder="Ultima fecha de compra"
            data-tip="Ultima fecha de compra"
          />

          <input //ESTO ES UN COMBO CENTRO DE COSTO
            className={classes.TextBox}
            type="text"
            name="sExistence"
            id="sExistence"
            placeholder="Existencia"
            // onChange={this.typeHandler}
            disabled
            defaultValue={this.state.supply.existence}
            data-tip="Existencia"
          />

          {/* <input
            className={classes.TextBox}
            type="number"
            name="sPurchase"
            id="sPurchase"
            placeholder={`Cantidad comprada en ${this.state.supply.unidad}`}
            onChange={this.typeHandler}
            default=""
            value={this.state.supply.purchase_quantity}
            data-tip="Cantidad comprada"
            onBlur={this.estimateTotal}
          /> */}

          <input
            className={classes.TextBox}
            type="number"
            name="sPurchase"
            id="sPurchase"
            value={this.state.supply.purchase_quantity || ""}
            default=""
            onChange={this.typeHandler}
            placeholder={`Cantidad comprada en ${this.state.supply.unidad}`}
            data-tip="Cantidad Comprada"
            onBlur={this.estimateTotal}
          />

          <div className={classes.SuppliesHeader}>
            <input
              className={classes.TextBox}
              style={{
                marginBottom: "0",
                width: "200px",
                height: "25px",
                fontSize: "0.8rem"
              }}
              // ref={props.sRef}
              type="text"
              name="searchSup"
              id="searchSup"
              default=""
              value={this.state.searchSup}
              onChange={this.typeHandler}
              placeholder="Buscar Insumo"
              // onBlur={this.resetSupplyList}
              onKeyUp={this.keyPresHandler}
            />

            <table>
              <tbody>
                <tr>
                  <th
                    style={{
                      width: "250px",
                      textAlign: "center",
                      background: "#9ec446",
                      borderTopLeftRadius: "4px"
                    }}
                  >
                    Insumos
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

          <div className={classes.SuppliesContainer}>
            <table>
              <tbody>
                <tr>
                  <th
                    style={{
                      width: "250px"
                    }}
                  />
                  <th
                    style={{
                      width: "50px"
                    }}
                  />
                </tr>
                {this.state.supplies}
              </tbody>
            </table>
          </div>

          <div className={classes.Buttons}>
            {this.state.activeRadio === "" ? (
              ""
            ) : (
              <React.Fragment>
                <i
                  style={{ marginRight: "5px", fontSize: "1.5rem" }}
                  className="fas fa-external-link-alt"
                  onClick={() => this.clearSupplyHandler("Formulario Limpio")}
                />
                <span className={classes.Text}>Limpiar</span>
              </React.Fragment>
            )}
            <span style={{ width: "30px" }} />
            {this.state.activeRadio === "" ? (
              <React.Fragment>
                <i
                  style={{ marginRight: "5px", fontSize: "1.5rem" }}
                  className="fas fa-external-link-alt"
                  onClick={() => this.clearSupplyHandler("Formulario Limpio")}
                />
                <span className={classes.Text}>Limpiar</span>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <i
                  style={{ marginRight: "5px", fontSize: "1.5rem" }}
                  className="far fa-save"
                  onClick={this.editSupplyHandlrer}
                />
                <span className={classes.Text}>Guardar</span>
              </React.Fragment>
            )}
          </div>
        </div>
        {
          //////////////////////////////////////////////////////// INSUMOS
        }
        <div className={classes.RecipesList}>
          <h3
            style={{
              marginBottom: "10px",
              fontWeight: "Bold",
              color: "#4C5564"
            }}
          >
            ALMACEN
          </h3>

          <div className={classes.HeadersContainer}>
            <div className={classes.SuppliesHeader}>
              <table>
                <tbody>
                  <tr>
                    <th
                      style={{
                        width: "250px",
                        textAlign: "center",
                        background: "#9ec446",
                        borderTopLeftRadius: "4px"
                      }}
                    >
                      Insumos
                    </th>
                    <th
                      style={{
                        width: "160px",
                        textAlign: "center",
                        background: "#9ec446",
                        borderTopLeftRadius: "4px"
                      }}
                    >
                      Cant/Und
                    </th>
                    <th
                      style={{
                        width: "50px",
                        textAlign: "center",
                        background: "#9ec446",
                        borderTopRightRadius: "4px"
                      }}
                    >
                      Est.
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
                      width: "250px"
                    }}
                  />
                  <th
                    style={{
                      width: "160px"
                    }}
                  />
                  <th
                    style={{
                      width: "50px"
                    }}
                  />
                </tr>
                {this.state.suppliesAlm}
              </tbody>
            </table>
          </div>
          <div className={classes.ButtonPos}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <i
                style={{ fontSize: "1.4rem", textAlign: "center" }}
                className="fas fa-print"
                onClick={this.printList}
              />
              <span style={{ width: "10px" }} />
              <span
                style={{
                  color: "#4C5564",
                  fontSize: "0.8rem",
                  fontWeight: "bold"
                }}
              >
                Imp. Lista compras
              </span>
            </div>

            <span style={{ width: "100px" }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
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
)(withRouter(WareHouse));
