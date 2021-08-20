import React, { Component } from "react";
import { withRouter } from "react-router-dom"; //hack para quitar con redux
import { connect } from "react-redux";
import lo from "lodash";
import axios from "axios";
import FaCaretDown from "react-icons/lib/fa/caret-down";
import uniqid from "uniqid";
import ReactTooltip from "react-tooltip";

import classes from "./Recipe.scss";
import { END_POINT, NEED_SUPPLY } from "../../configs/configs";

const unities = [
  <option key={uniqid()} hidden>
    Unidad
  </option>,
  <option key={uniqid()}>Gramos</option>,
  <option key={uniqid()}>Kilogramo</option>,
  <option key={uniqid()}>Litros</option>,
  <option key={uniqid()}>Mililitros</option>,
  <option key={uniqid()}>Unidades</option>
];

const unities2 = [
  <option key={uniqid()} hidden>
    Unidad
  </option>,
  <option key={uniqid()}>Gramos</option>,
  <option key={uniqid()}>Mililitros</option>,
  <option key={uniqid()}>Unidades</option>
];

const temps = [
  <option key={uniqid()} hidden>
    Temperatura
  </option>,
  <option key={uniqid()}>No</option>,
  <option key={uniqid()}>Si</option>
];

class Recipe extends Component {
  state = {
    //RECETA
    recipe: {
      _id: "",
      isSupply: false,
      isGuarni: false,
      item_id: "",
      reorder_level: "",
      unidad: "",
      tax_id: "nodata",
      tax_name: "igv",
      tax_percentage: 0.18,
      cf_cant_guarnicion: "",
      msku: "", //AUTO INC IN BD
      name: "",
      cf_familia: "",
      description: "El mejor",
      precio_receta: "",
      image_name: "", //EN BD
      cf_subfamilia: "",
      cf_ingredientes: [],
      cf_ingredientesLocal: [],
      cf_temperatura: "",
      cf_cocci_n: "",
      endulzante: "",
      cf_lacteos: ""
    },
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
      marca: "",
      proveedor: "",
      centro_de_costo: ""
    },
    comboUnities: unities,
    comboUnitiesRecipe: unities,
    comboUnitiesIngre: unities2,
    comboTemp: temps,
    comboTempRep: temps,
    comboCoc: [
      <option key={uniqid()} hidden>
        Cocción
      </option>,
      <option key={uniqid()}>No</option>,
      <option key={uniqid()}>Si</option>
    ],
    comboEnd: [
      <option key={uniqid()} hidden>
        Endulzante
      </option>,
      <option key={uniqid()}>No</option>,
      <option key={uniqid()}>Si</option>
    ],
    comboLact: [
      <option key={uniqid()} hidden>
        Lacteos
      </option>,
      <option key={uniqid()}>No</option>,
      <option key={uniqid()}>Si</option>
    ],
    comboIngre: [],
    comboAddedIngre: [
      <option key={"0"} hidden>
        Ingredientes agregados
      </option>
    ],
    comboFam: [
      <option key={"0"} hidden>
        FAMILIA
      </option>,
      <option key={uniqid()}>ADICIONALES</option>,
      <option key={uniqid()}>BEBIDAS</option>,
      <option key={uniqid()}>ENTRADAS</option>,
      <option key={uniqid()}>ENSALADAS</option>,
      <option key={uniqid()}>TAPAS</option>,
      <option key={uniqid()}>SOPAS</option>,
      <option key={uniqid()}>FONDOS</option>,
      <option key={uniqid()}>PLANCHAS Y PARRILLAS</option>,
      <option key={uniqid()}>PASTAS</option>,
      <option key={uniqid()}>PIQUEOS</option>,
      <option key={uniqid()}>POSTRES CARTA</option>,
      <option key={uniqid()}>POSTRES BARRA</option>
    ],
    center: "",
    suppliesData: [],
    recipesData: [],
    supplies: [],
    recipes: [],
    searchSup: "",
    searchRep: "",
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

  supRef = React.createRef();
  guaRef = React.createRef();

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
          await this.setState({ suppliesData: response.data });
          resolve(response.data);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  getRecipes = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${END_POINT}recetasYacho`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(async response => {
          let sugeFams = [];
          response.data.forEach(element => {
            sugeFams.push(element.cf_familia);
            if (element.cf_cocci_n.length > 1) {
              element.cf_cocci_n = "Si";
            } else {
              element.cf_cocci_n = "No";
            }
            if (element.endulzante.length > 1) {
              element.endulzante = "Si";
            } else {
              element.endulzante = "No";
            }
            if (element.cf_lacteos.length > 1) {
              element.cf_lacteos = "Si";
            } else {
              element.cf_lacteos = "No";
            }
            if (element.cf_temperatura.length > 1) {
              element.cf_temperatura = "Si";
            } else {
              element.cf_temperatura = "No";
            }
          });
          await this.setState({ recipesData: response.data, sugeFams });
          resolve(response.data);
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  createSupply = data => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${END_POINT}insumos`, data, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(async response => {
          let suppliesData = lo.cloneDeep(this.state.suppliesData);
          suppliesData.push(response.data);
          await this.createSupList(suppliesData);
          await this.setState({ suppliesData });
          this.clearSupplyHandler("Insumo Creado con exito");
          resolve();
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  createRecipe = data => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${END_POINT}recipes`, data, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(async response => {
          let recipesData = lo.cloneDeep(this.state.recipesData);
          if (response.data.cf_cocci_n.length > 1) {
            response.data.cf_cocci_n = "Si";
          } else {
            response.data.cf_cocci_n = "No";
          }
          if (response.data.endulzante.length > 1) {
            response.data.endulzante = "Si";
          } else {
            response.data.endulzante = "No";
          }
          if (response.data.cf_lacteos.length > 1) {
            response.data.cf_lacteos = "Si";
          } else {
            response.data.cf_lacteos = "No";
          }
          if (response.data.cf_temperatura.length > 1) {
            response.data.cf_temperatura = "Si";
          } else {
            response.data.cf_temperatura = "No";
          }

          recipesData.push(response.data);
          await this.createRepList(recipesData);
          await this.setState({ recipesData });
          this.clearRecipeHandler("Receta Creado con exito");
          resolve();
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  updateSupply = data => {
    return new Promise((resolve, reject) => {
      axios
        .put(`${END_POINT}insumos/${data._id}`, data, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "application/json"
        })
        .then(async response => {
          if (Array.isArray(response.data.cf_temperatura)) {
            response.data.cf_temperatura = "Si";
          }
          let suppliesData = lo.cloneDeep(this.state.suppliesData);
          suppliesData = suppliesData.filter(
            sup => sup._id !== response.data._id
          );
          suppliesData.push(response.data);
          await this.createSupList(suppliesData);
          await this.setState({ suppliesData });
          this.clearSupplyHandler("Insumo Editado con exito");
          resolve();
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  updateRecipe = data => {
    return new Promise((resolve, reject) => {
      axios
        .put(`${END_POINT}recetasYacho/${data._id}`, data, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "application/json"
        })
        .then(async response => {
          if (Array.isArray(response.data.cf_cocci_n)) {
            response.data.cf_cocci_n = "Si";
          }
          if (Array.isArray(response.data.endulzante)) {
            response.data.endulzante = "Si";
          }
          if (Array.isArray(response.data.cf_lacteos)) {
            response.data.cf_lacteos = "Si";
          }
          if (Array.isArray(response.data.cf_temperatura)) {
            response.data.cf_temperatura = "Si";
          }
          let recipesData = lo.cloneDeep(this.state.recipesData);
          recipesData = recipesData.filter(
            sup => sup._id !== response.data._id
          );
          recipesData.push(response.data);
          await this.createRepList(recipesData);
          await this.setState({ recipesData });
          this.clearRecipeHandler("Receta Editado con exito");
          resolve();
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  deleteSupply = data => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${END_POINT}insumos/${data._id}`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(async response => {
          let suppliesData = lo.cloneDeep(this.state.suppliesData);
          suppliesData = suppliesData.filter(
            sup => sup._id !== response.data.deleted
          );
          this.clearSupplyHandler("Insumo Eliminado con exito");
          await this.createSupList(suppliesData);
          await this.setState({ suppliesData });
          resolve();
        })
        .catch(error => {
          reject(error.message);
        });
    });
  };

  deleteRecipe = data => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${END_POINT}recetasYacho/${data._id}`, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(async response => {
          let recipesData = lo.cloneDeep(this.state.recipesData);
          recipesData = recipesData.filter(
            sup => sup._id !== response.data.deleted
          );
          this.clearRecipeHandler("Receta Eliminada con exito");
          await this.createRepList(recipesData);
          await this.setState({ recipesData });
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
      const recipes = await this.getRecipes().catch(err => alert(err));
      await this.createRepList(recipes);
    } else {
      this.backHandler();
    }
  };

  createRepList = recipes => {
    return new Promise(async (resolve, reject) => {
      let row = [];
      let comboIngre = lo.cloneDeep(this.state.comboIngre);

      // let state = lo.cloneDeep(this.state);
      recipes.forEach((recipe, index) => {
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
              {recipe.name}
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
              {recipe.image_name}
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
                  onChange={e => this.onCheckChangeListRep(e, recipe)}
                />
              </div>
            </td>
          </tr>
        );

        if (recipe.isSupply) {
          comboIngre.push(
            <option key={comboIngre.length} value={index}>
              {recipe.name}
            </option>
          );
        }
      });

      row = lo.sortBy(row, dat => dat.props.children[0].props.children);
      let cloneRow = lo.cloneDeep(row);
      await this.setState({
        recipes: row,
        recipesBackup: cloneRow,
        comboIngre
      });
      resolve();
    });
  };

  createSupList = supplies => {
    return new Promise(async (resolve, reject) => {
      let row = [];
      let comboIngre = [];

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
        comboIngre.push(
          <option key={index} value={index}>
            {supply.nombre}
          </option>
        );
      });

      row = lo.sortBy(row, dat => dat.props.children[0].props.children);
      comboIngre = lo.sortBy(comboIngre, dat => dat.props.children);
      comboIngre.push(
        <option key={uniqid()} value={""} hidden>
          {"Ingr./Recetas"}
        </option>
      );

      let cloneRow = lo.cloneDeep(row);
      await this.setState({
        supplies: row,
        suppliesBackup: cloneRow,
        comboIngre
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

  onCheckChangeListRep = async (e, recipe) => {
    let supplies = lo.cloneDeep(this.state.suppliesData);
    let comboAddedIngre = [
      <option key={"0"} hidden>
        Ingredientes agregados
      </option>
    ];
    recipe.cf_ingredientesLocal.forEach((element, index) => {
      for (let i = 0; i < supplies.length; i++) {
        const supply = supplies[i];
        if (element.id === supply._id) {
          let ing = `${supply.nombre} ${element.cantidad} ${element.unidad}`;
          comboAddedIngre.push(<option key={element.id}>{ing}</option>);
        }
      }
    });
    recipe.cf_familia = recipe.cf_familia.toUpperCase();
    await this.setState({
      activeRadioRep: e.target.id,
      recipe,
      comboAddedIngre,
      pressedRadionRep: e.target.id
    });
  };

  onCheckChangeRep = async e => {
    let recipe = lo.cloneDeep(this.state.recipe);
    if (e.target.id === "supply") {
      recipe.isSupply = true;
      recipe.isGuarni = false;
    } else {
      recipe.isGuarni = true;
      recipe.isSupply = false;
    }
    await this.setState({
      recipe
    });
  };

  typeHandler = async i => {
    let supply = lo.cloneDeep(this.state.supply);
    let recipe = lo.cloneDeep(this.state.recipe);
    let insumoSchema = lo.cloneDeep(this.state.insumoSchema);
    let value = i.target.value;
    switch (i.target.name) {
      case "sName":
        value = value.replace(/[^A-Za-z0-9 ]/gi, "");
        supply.nombre = value;
        await this.setState({ supply: supply });
        break;
      case "sNameRec":
        value = value.replace(/[^A-Za-z0-9 ]/gi, "");
        recipe.name = value;
        await this.setState({ recipe: recipe });
        break;
      case "sRepo":
        supply.reorder_level = i.target.value;
        await this.setState({ supply: supply });
        break;
      case "sRepoRec":
        recipe.reorder_level = i.target.value;
        await this.setState({ recipe: recipe });
        break;
      case "sFamilia":
        value = value.replace(/[^A-Za-z0-9 ]/gi, "");
        supply.cf_familia = value;
        await this.setState({ supply: supply });
        break;
      case "sSubFamilia":
        value = value.replace(/[^A-Za-z0-9 ]/gi, "");
        supply.cf_subfamilia = value;
        await this.setState({ supply: supply });
        break;
      // case "sFamiliaRec":
      //   // recipe.cf_familia = i.target.value;
      //   // await this.setState({ recipe: recipe });
      //   value = value.replace(/[^A-Za-z0-9 ]/gi, "");
      //   recipe.cf_familia = value;
      //   await this.setState({ recipe: recipe });
      //   // console.log(this.state.recipe);
      //   break;
      case "sSubFamiliaRec":
        // recipe.cf_subfamilia = i.target.value;
        // await this.setState({ recipe: recipe });
        value = value.replace(/[^A-Za-z0-9 ]/gi, "");
        recipe.cf_subfamilia = value;
        await this.setState({ recipe: recipe });
        // console.log(this.state.recipe);
        break;
      case "sDescrip":
        supply.purchase_description = i.target.value;
        await this.setState({ supply: supply });
        break;
      case "sDescripRec":
        recipe.description = i.target.value;
        await this.setState({ recipe: recipe });
        break;
      case "sPriceCom":
        supply.purchase_price = i.target.value;
        await this.setState({ supply: supply });
        break;
      case "sPriceVen":
        supply.selling_price = i.target.value;
        await this.setState({ supply: supply });
        break;
      case "sMarca":
        value = value.replace(/[^A-Za-z0-9 ]/gi, "");
        supply.marca = value;
        await this.setState({ supply: supply });
        break;
      case "sProveedor":
        value = value.replace(/[^A-Za-z0-9 ]/gi, "");
        supply.proveedor = value;
        await this.setState({ supply: supply });
        break;
      case "sPriceVenRec":
        recipe.precio_receta = i.target.value;
        await this.setState({ recipe: recipe });
        break;
      case "scantGuarninRec":
        recipe.cf_cant_guarnicion = i.target.value;
        await this.setState({ recipe: recipe });
        break;
      case "rIngreCant":
        insumoSchema.cantidad = i.target.value;
        await this.setState({ insumoSchema });
        break;
      case "searchSup":
        await this.setState({ searchSup: i.target.value });
        let searched = lo.cloneDeep(this.state.searchSup);
        let supList = lo.cloneDeep(this.state.supplies);
        supList = lo.filter(supList, sup =>
          sup.props.children[0].props.children.includes(searched)
        );
        this.setState({ supplies: supList });
        break;
      case "searchRep":
        await this.setState({ searchRep: i.target.value });
        let searchedRe = lo.cloneDeep(this.state.searchRep);
        let repList = lo.cloneDeep(this.state.recipes);
        repList = lo.filter(repList, rep =>
          rep.props.children[0].props.children.includes(searchedRe)
        );
        this.setState({ recipes: repList });
        break;
      default:
        break;
    }
  };

  onComboChange = async c => {
    let supply = lo.cloneDeep(this.state.supply);
    let recipe = lo.cloneDeep(this.state.recipe);
    let insumoSchema = lo.cloneDeep(this.state.insumoSchema);
    switch (c.target.name) {
      case "sUnityCombo":
        supply.unidad = c.target.value;
        await this.setState({ supply: supply });
        break;
      case "sUnityComboRec":
        recipe.unidad = c.target.value;
        await this.setState({ recipe: recipe });
        break;
      case "sTempCombo":
        supply.cf_temperatura = c.target.value;
        await this.setState({ supply: supply });
        break;
      case "sTempComboRec":
        recipe.cf_temperatura = c.target.value;
        await this.setState({ recipe: recipe });
        break;
      case "sCocComboRec":
        recipe.cf_cocci_n = c.target.value;
        await this.setState({ recipe: recipe });
        // console.log(this.state.recipe);
        break;
      case "endComboRec":
        recipe.endulzante = c.target.value;
        await this.setState({ recipe: recipe });
        // console.log(this.state.recipe);
        break;
      case "lacComboRec":
        recipe.cf_lacteos = c.target.value;
        await this.setState({ recipe: recipe });
        // console.log(this.state.recipe);
        break;
      case "listFamily":
        recipe.cf_familia = c.target.value;
        await this.setState({ recipe: recipe });
        // console.log(this.state.recipe);
        break;
      case "sIngreComboRec":
        let suppliesData = lo.cloneDeep(this.state.suppliesData);
        insumoSchema.recetaYacho = c.target.value;
        insumoSchema.id = suppliesData[parseFloat(c.target.value)]._id;
        await this.setState({ insumoSchema });
        break;
      case "sUnityComboIngre":
        insumoSchema.unidad = c.target.value;
        await this.setState({ insumoSchema });
        break;
      case "listIngre":
        let ing = this.state.comboAddedIngre;
        let id = "";
        for (let i = 0; i < ing.length; i++) {
          const element = ing[i];
          if (element.props.children === c.target.value) id = element.key;
        }
        await this.setState({
          selIngre: c.target.value,
          selIngreId: id
        });
        break;

      //CENTRO DE COSTO

      default:
        break;
    }
  };

  resetSupplyList = () => {
    let reset = lo.cloneDeep(this.state.suppliesBackup);
    this.setState({ supplies: reset, searchSup: "" });
  };

  resetRecipeList = () => {
    let reset = lo.cloneDeep(this.state.recipesBackup);
    this.setState({ recipes: reset, searchRep: "" });
  };

  keyPresHandler = e => {
    //COLOCAR SWITCH PARA LAS DEMAS DE HACER FALTA
    if (e.keyCode === 8) {
      // if (this.state.searchSup === "") {
      let reset = lo.cloneDeep(this.state.suppliesBackup);
      this.setState({ supplies: reset });
      // }
    }
  };

  keyPresHandlerRep = e => {
    //COLOCAR SWITCH PARA LAS DEMAS DE HACER FALTA
    if (e.keyCode === 8) {
      // if (this.state.searchSup === "") {
      let reset = lo.cloneDeep(this.state.recipesBackup);
      this.setState({ recipes: reset });
      // }
    }
  };

  backHandler = () => {
    this.props.history.push("/");
  };

  deleteSupplyHandlrer = async () => {
    if (window.confirm("Desea eliminar el insumo?")) {
      await this.deleteSupply(this.state.supply);
    }
  };

  deleteRecipeHandlrer = async () => {
    if (window.confirm("Desea eliminar el recipe?")) {
      await this.deleteRecipe(this.state.recipe);
    }
  };

  saveSupplyHandlrer = async () => {
    // if (NEED_SUPPLY) {
    let data = lo.cloneDeep(this.state.supply);
    if (this.state.activeRadio === "") {
      if (this.state.supply.nombre === "") {
        alert("Debe colcar el nombre del insumo");
      } else if (this.state.supply.reorder_level === "") {
        alert("Debe colcar nivel de reposicion");
      } else if (this.state.supply.unidad === "") {
        alert("Debe seleccionar la unidad");
      } else if (this.state.supply.cf_temperatura === "") {
        alert("Indique si requiere temperatura");
      } else if (this.state.supply.purchase_price === "") {
        alert("Indique el precio de compra");
      } else {
        if (this.state.supply.cf_temperatura === "Si") {
          data.cf_temperatura = ["AL TIEMPO", "HELADA"];
        }
        if (this.state.supply.cf_familia === "") {
          data.cf_familia = "nada";
        }
        if (this.state.supply.cf_subfamilia === "") {
          data.cf_subfamilia = "nada";
        }
        if (this.state.supply.selling_price === "") {
          data.selling_price = 0;
        }
        await this.createSupply(data).catch(err =>
          alert("Error de comunicacion")
        );
      }
    }
    // } else {
    //   alert("NO CUENTA CON OPCION DE INVENTARIO");
    // }
  };

  editSupplyHandlrer = async () => {
    let data = lo.cloneDeep(this.state.supply);
    if (this.state.supply.nombre === "") {
      alert("Debe colcar el nombre del insumo");
    } else if (this.state.supply.reorder_level === "") {
      alert("Debe colcar nivel de reposicion");
    } else if (this.state.supply.unidad === "") {
      alert("Debe seleccionar la unidad");
    } else if (this.state.supply.cf_temperatura === "") {
      alert("Indique si requiere temperatura");
    } else if (this.state.supply.purchase_price === "") {
      alert("Indique el precio de compra");
    } else {
      if (this.state.supply.cf_temperatura === "Si") {
        data.cf_temperatura = ["AL TIEMPO", "HELADA"];
      }
      if (this.state.supply.cf_familia === "") {
        data.cf_familia = "nada";
      }
      if (this.state.supply.cf_subfamilia === "") {
        data.cf_subfamilia = "nada";
      }
      if (this.state.supply.selling_price === "") {
        data.selling_price = 0;
      }
      await this.updateSupply(data).catch(err =>
        alert("Error de comunicacion")
      );
    }
  };

  editRecipeHandlrer = async () => {
    let data = lo.cloneDeep(this.state.recipe);
    if (this.state.recipe.name === "") {
      alert("Debe colcar el nombre de la receta");
    } else if (
      this.state.recipe.reorder_level === "" &&
      this.state.recipe.isSupply
    ) {
      alert("Debe colcar nivel de reposicion");
    } else if (this.state.recipe.unidad === "" && this.state.recipe.isSupply) {
      alert("Debe seleccionar la unidad");
    } else if (this.state.recipe.cf_temperatura === "") {
      alert("Indique si requiere temperatura");
    } else if (this.state.recipe.cf_cocci_n === "") {
      alert("Indique si requiere termino de coccion");
    } else if (this.state.recipe.endulzante === "") {
      alert("Indique si requiere endulzante");
    } else if (this.state.recipe.cf_lacteos === "") {
      alert("Indique si requiere tipo de lacteo");
    } else if (this.state.recipe.cf_familia === "") {
      alert("Indique la familia de la receta");
    } else if (this.state.recipe.description === "") {
      alert("Indique descripcion de la receta");
    } else if (
      this.state.recipe.precio_receta === "" &&
      !this.state.recipe.isGuarni &&
      !this.state.recipe.isSupply
    ) {
      alert("Indique precio de la receta");
    } else if (this.state.recipe.cf_ingredientes.length === 0 && NEED_SUPPLY) {
      alert("Debe agregar Ingredientes");
    } else {
      if (this.state.recipe.cf_familia === "") {
        data.cf_familia = "nada";
      }
      if (this.state.recipe.cf_subfamilia === "") {
        data.cf_subfamilia = "nada";
      }
      if (this.state.recipe.cf_temperatura === "Si") {
        data.cf_temperatura = ["AL TIEMPO", "HELADA"];
      }
      if (this.state.recipe.cf_cocci_n === "Si") {
        data.cf_cocci_n = ["INGLESA", "MEDIO", "TRES CUARTOS", "BIEN COCIDO"];
      }
      if (this.state.recipe.endulzante === "Si") {
        data.endulzante = ["AZUCAR", "EDULCORANTE", "SIN AZUCAR"];
      }
      if (this.state.recipe.cf_lacteos === "Si") {
        data.cf_lacteos = ["ENTERA", "SIN LACTOSA", "DESCREMADA"];
      }
      if (this.state.recipe.reorder_level === "") {
        data.reorder_level = 0;
      }
      if (this.state.recipe.selling_price === "") {
        data.selling_price = 0;
      }
      await this.updateRecipe(data).catch(err =>
        alert("Error de comunicacion")
      );
    }
  };

  clearSupplyHandler = async message => {
    let supply = {
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
      marca: "",
      proveedor: "",
      centro_de_costo: ""
    };

    if (this.state.pressedRadion !== "") {
      this[this.state.pressedRadion].checked = false;
    }

    await this.setState({
      supply,
      activeRadio: "",
      pressedRadion: ""
    });

    if (message !== "Formulario limpio") alert(message);
  };

  clearRecipeHandler = async message => {
    let recipe = {
      id: "",
      isSupply: false,
      isGuarni: false,
      item_id: "",
      reorder_level: "",
      unidad: "",
      tax_id: "nodata",
      tax_name: "igv",
      tax_percentage: 0.18,
      cf_cant_guarnicion: "",
      msku: "", //AUTO INC IN BD
      name: "",
      cf_familia: "",
      description: "El mejor",
      precio_receta: "",
      image_name: "", //EN BD
      cf_subfamilia: "",
      cf_ingredientes: [],
      cf_ingredientesLocal: [],
      cf_temperatura: "",
      cf_cocci_n: "",
      endulzante: "",
      cf_lacteos: ""
    };

    if (this.state.pressedRadionRep !== "") {
      this[this.state.pressedRadionRep].checked = false;
    }

    await this.setState({
      recipe,
      activeRadioRep: "",
      pressedRadionRep: "",
      insumoSchema: {
        recetaYacho: "",
        cantidad: "",
        unidad: "",
        id: ""
      },
      comboAddedIngre: [
        <option key={"0"} hidden>
          Ingredientes agregados
        </option>
      ]
    });
    if (message !== "Formulario limpio") alert(message);
  };

  capitalizeFirstLetter = string => {
    return `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}
    `.trim();
  };

  handleValidation = input => {
    let supply = lo.cloneDeep(this.state.supply);
    supply[input] = this.capitalizeFirstLetter(supply[input]);
    this.setState({ supply: supply });
  };

  handleValidationRecipe = input => {
    let recipe = lo.cloneDeep(this.state.recipe);
    recipe[input] = this.capitalizeFirstLetter(recipe[input]);
    this.setState({ recipe: recipe });
  };

  addSupRecipeHandler = async () => {
    // if (NEED_SUPPLY) {
    let recipe = lo.cloneDeep(this.state.recipe);
    let insumoSchema = lo.cloneDeep(this.state.insumoSchema);
    if (this.state.insumoSchema.recetaYacho === "") {
      alert("Seleccione un ingrediente");
    } else if (this.state.insumoSchema.cantidad === "") {
      alert("Coloque la cantidad");
    } else if (this.state.insumoSchema.unidad === "") {
      alert("Seleccione una unidad");
    } else {
      recipe.cf_ingredientesLocal.push(insumoSchema);

      await this.setState({
        recipe,
        insumoSchema: {
          recetaYacho: "",
          cantidad: "",
          unidad: "",
          id: ""
        }
      });
      this.createIngList(insumoSchema);
    }
    // } else {
    //   alert("NO CUENTA CON OPCION DE INVENTARIO");
    // }
  };

  createIngList = async insumo => {
    let recipe = lo.cloneDeep(this.state.recipe);
    let comboAddedIngre = lo.cloneDeep(this.state.comboAddedIngre);
    let ing = `${
      this.state.suppliesData[parseFloat(insumo.recetaYacho)].nombre
    } ${insumo.cantidad} ${insumo.unidad}`;

    recipe.cf_ingredientes.push(
      this.state.suppliesData[parseFloat(insumo.recetaYacho)].nombre
    );

    let canAdd = true;
    for (let i = 0; i < comboAddedIngre.length; i++) {
      const element = comboAddedIngre[i];
      if (element.key === insumo.id) {
        alert("Ingrediente ya existe");
        canAdd = false;
        break;
      }
    }
    if (canAdd) comboAddedIngre.push(<option key={insumo.id}>{ing}</option>);
    await this.setState({
      comboAddedIngre,
      recipe
    });
  };

  delSupRecipeHandler = async () => {
    if (this.state.selIngreId !== "") {
      let recipe = lo.cloneDeep(this.state.recipe);
      let comboAddedIngre = lo.cloneDeep(this.state.comboAddedIngre);
      let nameId = "";

      recipe.cf_ingredientesLocal = recipe.cf_ingredientesLocal.filter(ins => {
        if (ins.id === this.state.selIngreId) nameId = ins.id;
        return ins.id !== this.state.selIngreId;
      });

      recipe.cf_ingredientes = recipe.cf_ingredientes.filter(ins => {
        let search = "";
        this.state.suppliesData.forEach(element => {
          if (nameId === element._id) search = element.nombre;
        });
        return ins !== search;
      });

      comboAddedIngre = comboAddedIngre.filter(
        ins => ins.key !== this.state.selIngreId
      );

      await this.setState({
        recipe,
        comboAddedIngre,
        selIngreId: "",
        selIngre: ""
      });
    } else {
      alert("Seleccione un ingrediente a eliminar");
    }
  };

  saveRecipeHandler = async () => {
    let data = lo.cloneDeep(this.state.recipe);
    if (this.state.activeRadioRep === "") {
      if (this.state.recipe.name === "") {
        alert("Debe colcar el nombre de la receta");
      } else if (
        this.state.recipe.reorder_level === "" &&
        this.state.recipe.isSupply
      ) {
        alert("Debe colcar nivel de reposicion");
      } else if (
        this.state.recipe.unidad === "" &&
        this.state.recipe.isSupply
      ) {
        alert("Debe seleccionar la unidad");
      } else if (this.state.recipe.cf_temperatura === "") {
        alert("Indique si requiere temperatura");
      } else if (this.state.recipe.cf_cocci_n === "") {
        alert("Indique si requiere termino de coccion");
      } else if (this.state.recipe.endulzante === "") {
        alert("Indique si requiere endulzante");
      } else if (this.state.recipe.cf_lacteos === "") {
        alert("Indique si requiere tipo de lacteo");
      } else if (this.state.recipe.cf_familia === "") {
        alert("Indique la familia de la receta");
      } else if (this.state.recipe.description === "") {
        alert("Indique descripcion de la receta");
      } else if (
        this.state.recipe.precio_receta === "" &&
        !this.state.recipe.isGuarni &&
        !this.state.recipe.isSupply
      ) {
        alert("Indique precio de la receta");
      } else if (
        this.state.recipe.cf_ingredientes.length === 0 &&
        NEED_SUPPLY
      ) {
        alert("Debe agregar Ingredientes");
      } else {
        if (this.state.recipe.sub_cf_familia === "") {
          data.sub_cf_familia = "nada";
        }
        if (this.state.recipe.cf_cant_guarnicion === "") {
          data.cf_cant_guarnicion = "0";
        }
        if (this.state.recipe.cf_temperatura === "Si") {
          data.cf_temperatura = ["AL TIEMPO", "HELADA"];
        }
        if (this.state.recipe.cf_cocci_n === "Si") {
          data.cf_cocci_n = ["INGLESA", "MEDIO", "TRES CUARTOS", "BIEN COCIDO"];
        }
        if (this.state.recipe.endulzante === "Si") {
          data.endulzante = ["AZUCAR", "EDULCORANTE", "SIN AZUCAR"];
        }
        if (this.state.recipe.cf_lacteos === "Si") {
          data.cf_lacteos = ["ENTERA", "SIN LACTOSA", "DESCREMADA"];
        }
        if (this.state.recipe.reorder_level === "") {
          data.reorder_level = 0;
        }
        await this.createRecipe(data).catch(err =>
          alert("Error de comunicacion")
        );
        this.clearRecipeHandler("Formulario limpio");
      }
    }
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
            CREAR INSUMO
          </h3>

          <input
            className={classes.TextBox}
            type="text"
            name="sName"
            onBlur={() => this.handleValidation("nombre")}
            id="sName"
            value={this.state.supply.nombre}
            default=""
            onChange={this.typeHandler}
            placeholder="Nombre del insumo"
            data-tip="Nombre del insumo"
          />

          <div className={classes.GroupUnitySup}>
            <input
              style={{ width: "160px" }}
              className={classes.TextBox}
              type="number"
              name="sRepo"
              id="sRepo"
              value={this.state.supply.reorder_level}
              default=""
              onChange={this.typeHandler}
              placeholder="Nivel de Reposicion"
              data-tip="Nivel de Reposicion"
            />

            <span style={{ width: "20px" }} />

            <div className={classes.ComboContainer}>
              <select
                value={this.state.supply.unidad}
                className={classes.ComboCash}
                onChange={this.onComboChange}
                name="sUnityCombo"
                data-tip="Unidad"
                style={{
                  height: "30px",
                  width: "120px",
                  background: "#DADEE9",
                  backgroundPositionX: "30",
                  fontSize: "0.9rem"
                }}
              >
                {this.state.comboUnities}
              </select>
              <div
                className={classes.Arrow}
                style={{
                  fontSize: "0.8rem",
                  marginRight: "0px",
                  marginBottom: "0px"
                }}
              >
                <FaCaretDown />
              </div>
            </div>
          </div>

          <div className={classes.ComboContainer}>
            <select
              value={this.state.supply.cf_temperatura}
              className={classes.ComboCash}
              onChange={this.onComboChange}
              name="sTempCombo"
              data-tip="Temperatura"
              style={{
                height: "30px",
                width: "300px",
                background: "#DADEE9",
                backgroundPositionX: "30",
                fontSize: "0.9rem"
              }}
            >
              {this.state.comboTemp}
            </select>
            <div
              className={classes.Arrow}
              style={{
                fontSize: "0.8rem",
                marginRight: "0px",
                marginBottom: "0px"
              }}
            >
              <FaCaretDown />
            </div>
          </div>

          <input
            className={classes.TextBox}
            type="text"
            name="sFamilia"
            id="sFamilia"
            onBlur={() => this.handleValidation("cf_familia")}
            value={this.state.supply.cf_familia}
            default=""
            onChange={this.typeHandler}
            placeholder="Familia"
            data-tip="Familia"
          />

          <input
            className={classes.TextBox}
            type="text"
            name="sSubFamilia"
            id="sSubFamilia"
            onBlur={() => this.handleValidation("cf_subfamilia")}
            value={this.state.supply.cf_subfamilia}
            default=""
            onChange={this.typeHandler}
            placeholder="Sub Familia"
            data-tip="Sub Familia"
          />

          <input
            className={classes.TextBox}
            type="text"
            name="sDescrip"
            id="sDescrip"
            value={this.state.supply.purchase_description}
            default=""
            onChange={this.typeHandler}
            placeholder="Descripcion"
            data-tip="Descripcion"
          />

          <input
            className={classes.TextBox}
            type="number"
            name="sPriceCom"
            id="sPriceCom"
            value={this.state.supply.purchase_price}
            default=""
            onChange={this.typeHandler}
            placeholder="Precio de Compra S/"
            data-tip="Precio de Compra S/"
          />

          <input
            className={classes.TextBox}
            type="number"
            name="sPriceVen"
            id="sPriceVen"
            value={this.state.supply.selling_price}
            default=""
            onChange={this.typeHandler}
            placeholder="Precio de Venta S/"
            data-tip="Precio de Venta S/"
          />

          <input
            className={classes.TextBox}
            type="text"
            name="sMarca"
            id="sMarca"
            default=""
            placeholder="Marca"
            data-tip="Marca"
            onBlur={() => this.handleValidation("marca")}
            onChange={this.typeHandler}
            value={this.state.supply.marca}
          />

          <input
            className={classes.TextBox}
            type="text"
            name="sProveedor"
            id="sProveedor"
            default=""
            placeholder="Proveedor"
            data-tip="Proveedor"
            onChange={this.typeHandler}
            onBlur={() => this.handleValidation("proveedor")}
            value={this.state.supply.proveedor}
          />

          <input //ESTO ES UN COMBO CENTRO DE COSTO
            className={classes.TextBox}
            type="text"
            name="sCenterCost"
            id="sCenterCost"
            default=""
            placeholder="Centro de Costo"
            data-tip="Centro de Costo"
            onChange={this.typeHandler}
            value={this.state.center}
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
              <React.Fragment>
                <i
                  style={{ marginRight: "5px", fontSize: "1.5rem" }}
                  className="far fa-save"
                  onClick={this.saveSupplyHandlrer}
                />
                <span className={classes.Text}>Guardar</span>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <i
                  style={{ marginRight: "5px", fontSize: "1.5rem" }}
                  className="fas fa-external-link-alt"
                  onClick={() => this.clearSupplyHandler("Formulario limpio")}
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
                  onClick={() => this.clearSupplyHandler("Formulario limpio")}
                />
                <span className={classes.Text}>Limpiar</span>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <i
                  style={{ marginRight: "5px", fontSize: "1.5rem" }}
                  className="far fa-edit"
                  onClick={this.editSupplyHandlrer}
                />
                <span className={classes.Text}>Editar</span>
              </React.Fragment>
            )}

            <span style={{ width: "30px" }} />
            {this.state.pressedRadion === "" ? (
              ""
            ) : (
              <React.Fragment>
                <i
                  style={{ marginRight: "5px", fontSize: "1.5rem" }}
                  className="far fa-trash-alt"
                  onClick={this.deleteSupplyHandlrer}
                />
                <span className={classes.Text}>Eliminar</span>
              </React.Fragment>
            )}
          </div>
        </div>
        {
          //////////////////////////////////////////////////////// RECIPES
        }

        <div className={classes.RecipesList}>
          <h3
            style={{
              marginBottom: "10px",
              fontWeight: "Bold",
              color: "#4C5564"
            }}
          >
            RECETAS
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
                // ref={props.sRef}
                type="text"
                name="searchRep"
                id="searchRep"
                default=""
                value={this.state.searchRep}
                onChange={this.typeHandler}
                placeholder="Buscar Receta"
                // onBlur={this.resetRecipeList}
                onKeyUp={this.keyPresHandlerRep}
              />

              <table>
                <tbody>
                  <tr>
                    <th
                      style={{
                        width: "300px",
                        textAlign: "center",
                        background: "#9ec446",
                        borderTopLeftRadius: "4px"
                      }}
                    >
                      Recetas
                    </th>
                    <th
                      style={{
                        width: "110px",
                        textAlign: "center",
                        background: "#9ec446",
                        borderTopLeftRadius: "4px"
                      }}
                    >
                      Imagen
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
                      width: "300px"
                    }}
                  />
                  <th
                    style={{
                      width: "110px"
                    }}
                  />
                  <th
                    style={{
                      width: "50px"
                    }}
                  />
                </tr>
                {this.state.recipes}
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

        <div className={classes.Recipes}>
          <h3
            style={{
              marginBottom: "5px",
              fontWeight: "Bold",
              color: "#4C5564"
            }}
          >
            CREAR RECETA
          </h3>

          <div
            style={{
              display: "flex",
              width: "300px",
              height: "30px",
              alignItems: "center"
            }}
          >
            <input
              style={{
                marginRight: "8px"
              }}
              ref={input => {
                this.supRef = input;
              }}
              id="supply"
              type="radio"
              checked={this.state.recipe.isSupply}
              onChange={this.onCheckChangeRep}
            />

            <span
              style={{
                marginRight: "10px"
              }}
              className={classes.Labels}
            >
              Insumo
            </span>

            <input
              style={{
                marginRight: "8px"
              }}
              ref={input => {
                this.guaRef = input;
              }}
              id="guarni"
              type="radio"
              checked={this.state.recipe.isGuarni}
              onChange={this.onCheckChangeRep}
            />
            <span
              style={{
                marginRight: "10px"
              }}
              className={classes.Labels}
            >
              Guarnicion
            </span>
          </div>

          <input
            className={classes.TextBox}
            type="text"
            name="sNameRec"
            id="sNameRec"
            value={this.state.recipe.name}
            default=""
            onChange={this.typeHandler}
            placeholder="Nombre de Receta"
            data-tip="Nombre de Receta"
            onBlur={() => this.handleValidationRecipe("name")}
          />

          <div className={classes.GroupUnityRec}>
            <input
              style={{ width: "160px" }}
              className={classes.TextBox}
              type="number"
              name="sRepoRec"
              id="sRepoRec"
              value={this.state.recipe.reorder_level}
              default=""
              onChange={this.typeHandler}
              placeholder="Nivel de Reposicion"
              data-tip="Nivel de Reposicion"
            />

            <span style={{ width: "20px" }} />

            <div className={classes.ComboContainer}>
              <select
                value={this.state.recipe.unidad}
                className={classes.ComboCash}
                onChange={this.onComboChange}
                name="sUnityComboRec"
                data-tip="Unidad"
                style={{
                  height: "30px",
                  width: "120px",
                  background: "#DADEE9",
                  backgroundPositionX: "30",
                  fontSize: "0.9rem"
                }}
              >
                {this.state.comboUnitiesRecipe}
              </select>
              <div
                className={classes.Arrow}
                style={{
                  fontSize: "0.8rem",
                  marginRight: "0px",
                  marginBottom: "0px"
                }}
              >
                <FaCaretDown />
              </div>
            </div>
          </div>

          <div className={classes.ComboContainer}>
            <select
              value={this.state.recipe.cf_temperatura}
              className={classes.ComboCash}
              onChange={this.onComboChange}
              name="sTempComboRec"
              data-tip="Temperatura"
              style={{
                height: "30px",
                width: "300px",
                background: "#DADEE9",
                backgroundPositionX: "30",
                fontSize: "0.9rem"
              }}
            >
              {this.state.comboTempRep}
            </select>
            <div
              className={classes.Arrow}
              style={{
                fontSize: "0.8rem",
                marginRight: "0px",
                marginBottom: "0px"
              }}
            >
              <FaCaretDown />
            </div>
          </div>

          <div className={classes.ComboContainer}>
            <select
              value={this.state.recipe.cf_cocci_n}
              className={classes.ComboCash}
              onChange={this.onComboChange}
              name="sCocComboRec"
              data-tip="Cocción"
              style={{
                height: "30px",
                width: "300px",
                background: "#DADEE9",
                backgroundPositionX: "30",
                fontSize: "0.9rem"
              }}
            >
              {this.state.comboCoc}
            </select>
            <div
              className={classes.Arrow}
              style={{
                fontSize: "0.8rem",
                marginRight: "0px",
                marginBottom: "0px"
              }}
            >
              <FaCaretDown />
            </div>
          </div>

          <div className={classes.ComboContainer}>
            <select
              value={this.state.recipe.endulzante}
              className={classes.ComboCash}
              onChange={this.onComboChange}
              name="endComboRec"
              data-tip="Endulzante"
              style={{
                height: "30px",
                width: "300px",
                background: "#DADEE9",
                backgroundPositionX: "30",
                fontSize: "0.9rem"
              }}
            >
              {this.state.comboEnd}
            </select>
            <div
              className={classes.Arrow}
              style={{
                fontSize: "0.8rem",
                marginRight: "0px",
                marginBottom: "0px"
              }}
            >
              <FaCaretDown />
            </div>
          </div>

          <div className={classes.ComboContainer}>
            <select
              value={this.state.recipe.cf_lacteos}
              className={classes.ComboCash}
              onChange={this.onComboChange}
              name="lacComboRec"
              data-tip="Lacteos"
              style={{
                height: "30px",
                width: "300px",
                background: "#DADEE9",
                backgroundPositionX: "30",
                fontSize: "0.9rem"
              }}
            >
              {this.state.comboLact}
            </select>
            <div
              className={classes.Arrow}
              style={{
                fontSize: "0.8rem",
                marginRight: "0px",
                marginBottom: "0px"
              }}
            >
              <FaCaretDown />
            </div>
          </div>

          {/* <input
            className={classes.TextBox}
            type="text"
            name="sFamiliaRec"
            id="sFamiliaRec"
            value={this.state.recipe.cf_familia}
            default=""
            onChange={this.typeHandler}
            placeholder="Familia"
            data-tip="Familia"
            onBlur={() => this.handleValidationRecipe("cf_familia")}
          /> */}

          <div className={classes.ComboContainer}>
            <select
              value={this.state.recipe.cf_familia}
              className={classes.ComboCash}
              onChange={this.onComboChange}
              name="listFamily"
              data-tip="Familia"
              style={{
                height: "30px",
                width: "300px",
                background: "#DADEE9",
                backgroundPositionX: "30",
                fontSize: "0.9rem"
              }}
            >
              {this.state.comboFam}
            </select>
            <div
              className={classes.Arrow}
              style={{
                fontSize: "0.8rem",
                marginRight: "0px",
                marginBottom: "0px"
              }}
            >
              <FaCaretDown />
            </div>
          </div>

          <input
            className={classes.TextBox}
            type="text"
            name="sSubFamiliaRec"
            id="sSubFamiliaRec"
            value={this.state.recipe.cf_subfamilia}
            default=""
            onChange={this.typeHandler}
            placeholder="Sub Familia"
            data-tip="Sub Familia"
            onBlur={() => this.handleValidationRecipe("cf_subfamilia")}
          />

          <input
            className={classes.TextBox}
            type="text"
            name="sDescripRec"
            id="sDescripRec"
            value={this.state.recipe.description}
            default=""
            onChange={this.typeHandler}
            placeholder="Descripcion"
            data-tip="Descripcion"
            onBlur={() => this.handleValidationRecipe("description")}
          />

          <input
            className={classes.TextBox}
            type="number"
            name="scantGuarninRec"
            id="scantGuarninRec"
            value={this.state.recipe.cf_cant_guarnicion}
            default=""
            onChange={this.typeHandler}
            placeholder="Cantidad Guarnicion"
            data-tip="Cantidad Guarnicion"
          />

          <input
            className={classes.TextBox}
            type="number"
            name="sPriceVenRec"
            id="sPriceVenRec"
            value={this.state.recipe.precio_receta}
            default=""
            onChange={this.typeHandler}
            placeholder="Precio de Venta S/"
            data-tip="Precio de Venta S/"
          />

          <div className={classes.GroupUnityRec}>
            <div className={classes.ComboContainer}>
              <select
                // ref={input => {
                //   this.addSupRef = input;
                // }}
                value={this.state.insumoSchema.recetaYacho}
                className={classes.ComboCash}
                onChange={this.onComboChange}
                name="sIngreComboRec"
                data-tip="Ingr./Recetas"
                style={{
                  height: "30px",
                  width: "120px",
                  background: "#DADEE9",
                  backgroundPositionX: "30",
                  fontSize: "0.9rem"
                }}
              >
                {this.state.comboIngre}
              </select>
              <div
                className={classes.Arrow}
                style={{
                  fontSize: "0.8rem",
                  marginRight: "0px",
                  marginBottom: "0px"
                }}
              >
                <FaCaretDown />
              </div>
            </div>

            <span style={{ width: "5px" }} />

            <input
              style={{ width: "55px" }}
              className={classes.TextBox}
              type="number"
              name="rIngreCant"
              id="rIngreCant"
              value={this.state.insumoSchema.cantidad}
              default=""
              onChange={this.typeHandler}
              placeholder="Cant."
              data-tip="Cantidad"
            />

            <span style={{ width: "5px" }} />

            <div className={classes.ComboContainer}>
              <select
                value={this.state.insumoSchema.unidad}
                className={classes.ComboCash}
                onChange={this.onComboChange}
                name="sUnityComboIngre"
                data-tip="Unidad"
                style={{
                  height: "30px",
                  width: "90px",
                  background: "#DADEE9",
                  backgroundPositionX: "30",
                  fontSize: "0.9rem"
                }}
              >
                {this.state.comboUnitiesIngre}
              </select>
              <div
                className={classes.Arrow}
                style={{
                  fontSize: "0.8rem",
                  marginRight: "0px",
                  marginBottom: "0px"
                }}
              >
                <FaCaretDown />
              </div>
            </div>
            <span style={{ width: "5px" }} />

            <div className={classes.AddSupply}>
              <i
                style={{ fontSize: "1.2rem", alignSelf: "center" }}
                className="fas fa-plus-square"
                onClick={this.addSupRecipeHandler}
              />
            </div>
          </div>

          <div className={classes.GroupUnityRec}>
            <div className={classes.AddSupply}>
              <div className={classes.ComboContainer}>
                <select
                  value={this.state.selIngre}
                  className={classes.ComboCash}
                  onChange={this.onComboChange}
                  name="listIngre"
                  data-tip="Ingredientes"
                  style={{
                    height: "30px",
                    width: "275px",
                    background: "#DADEE9",
                    backgroundPositionX: "30",
                    fontSize: "0.9rem"
                  }}
                >
                  {this.state.comboAddedIngre}
                </select>
                <div
                  className={classes.Arrow}
                  style={{
                    fontSize: "0.8rem",
                    marginRight: "0px",
                    marginBottom: "0px"
                  }}
                >
                  <FaCaretDown />
                </div>
              </div>
              <span style={{ width: "5px" }} />
              <i
                style={{ fontSize: "1.2rem", alignSelf: "center" }}
                className="fas fa-minus-square"
                onClick={this.delSupRecipeHandler}
              />
            </div>
          </div>

          <div className={classes.Buttons}>
            {this.state.activeRadioRep === "" ? (
              <React.Fragment>
                <i
                  style={{ marginRight: "5px", fontSize: "1.5rem" }}
                  className="far fa-save"
                  onClick={this.saveRecipeHandler}
                />
                <span className={classes.Text}>Guardar</span>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <i
                  style={{ marginRight: "5px", fontSize: "1.5rem" }}
                  className="fas fa-external-link-alt"
                  onClick={() => this.clearRecipeHandler("Formulario limpio")}
                />
                <span className={classes.Text}>Limpiar</span>
              </React.Fragment>
            )}
            <span style={{ width: "30px" }} />
            {this.state.activeRadioRep === "" ? (
              <React.Fragment>
                <i
                  style={{ marginRight: "5px", fontSize: "1.5rem" }}
                  className="fas fa-external-link-alt"
                  onClick={() => this.clearRecipeHandler("Formulario limpio")}
                />
                <span className={classes.Text}>Limpiar</span>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <i
                  style={{ marginRight: "5px", fontSize: "1.5rem" }}
                  className="far fa-edit"
                  onClick={this.editRecipeHandlrer}
                />
                <span className={classes.Text}>Editar</span>
              </React.Fragment>
            )}

            <span style={{ width: "30px" }} />
            {this.state.pressedRadionRep === "" ? (
              ""
            ) : (
              <React.Fragment>
                <i
                  style={{ marginRight: "5px", fontSize: "1.5rem" }}
                  className="far fa-trash-alt"
                  onClick={this.deleteRecipeHandlrer}
                />
                <span className={classes.Text}>Eliminar</span>
              </React.Fragment>
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
)(withRouter(Recipe));
