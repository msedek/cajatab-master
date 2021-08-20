import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "underscore";
import moment from "moment-timezone";

import classes from "./OrderDetails.scss";
import OrderFooter from "../../components/OrderFooter/OrderFooter";
import ItemConfigurator from "../../components/ItemConfigurator/ItemConfigurator";
import * as OrderNoteActions from "../../store/actions/index";
import { GO_ZOHO } from "../../configs/configs";
// import { calculateDecimal } from "../../utils/decimal";

class OrderDetails extends Component {
  state = {
    quantity: 1,
    orders: [],
    cf_guarnicion: [],
    cf_ingredientes: [],
    sinIngredientes: [],
    cf_lacteos: [],
    endulzante: [],
    cf_temperatura: [],
    cf_cocci_n: [],
    notas: "",
    directo: false,
    lacteosState: "",
    endulzanteState: "",
    temperaturaState: "",
    terminoState: "",
    canDirecto: false
  };

  plusButton = React.createRef();
  minusButton = React.createRef();
  notes = React.createRef();
  addButton = React.createRef();
  exitButton = React.createRef();

  componentWillMount() {
    if (this.props.cajeroId === "") {
      this.backHandler();
    }
  }

  componentDidMount = async () => {
    let item = _.clone(this.props.Item);
    let state = _.clone(this.state);
    let orders = _.clone(this.props.Orders);

    let cf_guarnicion = item.cf_guarnicion;
    let cf_ingredientes = item.cf_ingredientes;

    cf_guarnicion.forEach((guarnicion, index) => {
      let checkStateGuarnicion = `checkStateGuarnicion${index}`;
      let estado = false;
      state[checkStateGuarnicion] = estado;
    });

    let ingredientes = [];
    cf_ingredientes.forEach((ingrediente, index) => {
      let checkStateIngredientes = `checkStateIngredientes${index}`;
      ingredientes.push(ingrediente);
      let estado = true;
      state[checkStateIngredientes] = estado;
    });

    orders.forEach((order, index) => {
      let checkStateOrder = `checkStateOrder${index}`;
      let estado = true;
      state[checkStateOrder] = estado;
    });

    let familia = item.cf_familia.toLowerCase();
    let canDirecto = _.clone(this.state.canDirecto);
    if (
      familia === "entradas" ||
      familia === "ensaladas" ||
      familia === "piqueos" ||
      familia === "tapas" ||
      familia === "sopas" ||
      familia === "postresCarta"
    ) {
      canDirecto = true;
    }

    await this.setState({
      ...state,
      orders: orders,
      cf_ingredientes: ingredientes,
      canDirecto: canDirecto
    });

    this.plusButton.focus();
  };

  quantityHandler = operator => {
    switch (operator) {
      case "minus":
        if (this.state.quantity > 1) {
          let qt = this.state.quantity;
          qt--;
          this.setState({
            quantity: qt
          });
        }
        break;
      default:
        let qt = this.state.quantity;
        qt++;
        this.setState({
          quantity: qt
        });
        break;
    }
  };

  backHandler = () => {
    this.props.history.goBack();
  };

  placeOrderHandler = () => {
    let order = this.props.Item;
    let orders = _.clone(this.state.orders);

    let cf_guarnicion = _.clone(this.state.cf_guarnicion);
    let sinIngredientes = _.clone(this.state.sinIngredientes);
    let cf_lacteos = _.clone(this.state.cf_lacteos);
    let endulzante = _.clone(this.state.endulzante);
    let cf_temperatura = _.clone(this.state.cf_temperatura);
    let cf_cocci_n = _.clone(this.state.cf_cocci_n);
    let notas = _.clone(this.state.notas);

    const date = moment.tz("America/Lima").format("lll");

    if (this.state.directo) {
      order.cf_familia = "DIRECTOS";
    }

    if (this.state.validator_cf_guarnicion && cf_guarnicion.length === 0) {
      alert("No ha seleccionado nunguna guarnicion");
    }

    let state = _.clone(this.state);

    let guarniValidator = false;

    _.keys(state).forEach(element => {
      if (
        element.includes("checkStateGuarnicion") &&
        cf_guarnicion.length === 0
      ) {
        guarniValidator = true;
      }
    });

    if (guarniValidator) {
      alert("No selecciono guarnicion");
    } else if (this.state.lacteosState === "" && order.cf_lacteos.length > 0) {
      alert("No ha seleccionado tipo de lacteo");
    } else if (
      this.state.endulzanteState === "" &&
      order.endulzante.length > 0
    ) {
      alert("No Selecciono endulzante");
    } else if (
      this.state.temperaturaState === "" &&
      order.cf_temperatura.length > 0
    ) {
      alert("No Selecciono temperatura");
    } else if (this.state.terminoState === "" && order.cf_cocci_n.length > 0) {
      alert("No Selecciono termino");
    } else {
      const guarniciones = [];
      const guarniSkus = [];

      cf_guarnicion.forEach(guarnicion => {
        guarniciones.push(guarnicion.name);
        guarniSkus.push(guarnicion.sku);
      });

      let sku = GO_ZOHO ? order.sku : order.msku;

      let orderHuman = `${order.name}_x(${this.state.quantity})${
        sinIngredientes.length > 0
          ? " .s(" + sinIngredientes.join(", ") + ")"
          : ""
      }${
        guarniciones.length > 0 ? " .ac(" + guarniciones.join(", ") + ")" : ""
      }${cf_cocci_n.length > 0 ? " .t(" + cf_cocci_n.join(", ") + ")" : ""}${
        cf_temperatura.length > 0
          ? " .tem(" + cf_temperatura.join(", ") + ")"
          : ""
      }${endulzante.length > 0 ? " .end(" + endulzante.join(", ") + ")" : ""}${
        cf_lacteos.length > 0 ? " .lact(" + cf_lacteos.join(", ") + ")" : ""
      }${notas !== "" ? "-" + notas : ""}`;

      let orderIngre = `${order.name}_x(${this.state.quantity})${
        sinIngredientes.length > 0
          ? " .s(" + sinIngredientes.join(", ") + ")"
          : ""
      }${
        guarniciones.length > 0 ? " .ac(" + guarniciones.join(", ") + ")" : ""
      }${cf_cocci_n.length > 0 ? " .t(" + cf_cocci_n.join(", ") + ")" : ""}${
        cf_temperatura.length > 0
          ? " .tem(" + cf_temperatura.join(", ") + ")"
          : ""
      }${endulzante.length > 0 ? " .end(" + endulzante.join(", ") + ")" : ""}${
        cf_lacteos.length > 0 ? " .lact(" + cf_lacteos.join(", ") + ")" : ""
      }-${order.cf_familia}-${sku}*${order.item_id}*${order.tax_id}*${
        order.tax_name
      }*${order.tax_percentage}*${order.precio_receta}${
        guarniSkus.length > 0 ? "#" + guarniSkus.join("#") : ""
      }${notas !== "" ? "-" + notas : ""}`;

      let pedido = {
        pedido: orderIngre,
        date: date,
        orderHuman: orderHuman,
        enviado: false,
        receta: this.props.Item
      };

      orders.push(pedido);
      this.props.onGoAddOrder(orders);
      this.backHandler();
    }
  };

  configOptionsHandler = (e, config, stateName, state, categoria) => {
    let item = _.clone(this.props.Item);
    switch (categoria) {
      case "GUARNICIONES":
        let guarniciones = _.clone(this.state.cf_guarnicion);
        if (e.target.checked) {
          if (guarniciones.length === item.cf_cant_guarnicion) {
            alert("No puede seleccionar mas guarniciones");
          } else {
            guarniciones.push(config);
            this.setState({
              cf_guarnicion: guarniciones,
              [stateName]: !state
            });
          }
        } else {
          this.setState({
            cf_guarnicion: _.without(guarniciones, config),
            [stateName]: !state
          });
        }

        break;
      case "INGREDIENTES":
        let sinIngredientes = _.clone(this.state.sinIngredientes);
        sinIngredientes.push(config);
        this.setState({
          sinIngredientes: sinIngredientes,
          [stateName]: !state
        });
        break;

      case "LACTEOS":
        let lacteos = [];
        lacteos.push(config);
        this.setState({ cf_lacteos: lacteos, lacteosState: e.target.value });
        break;
      case "ENDULZANTE":
        let endulzante = [];
        endulzante.push(config);
        this.setState({
          endulzante: endulzante,
          endulzanteState: e.target.value
        });
        break;
      case "TEMPERATURA":
        let temperatura = [];
        temperatura.push(config);
        this.setState({
          cf_temperatura: temperatura,
          temperaturaState: e.target.value
        });
        break;
      case "TERMINO":
        let coccion = [];
        coccion.push(config);
        this.setState({ cf_cocci_n: coccion, terminoState: e.target.value });
        break;
      default:
        break;
    }
  };

  removeOrderHandler = (e, order, stateName) => {
    if (order.enviado) {
      alert("No puede eliminar pedido enviado");
    } else {
      let orders = _.clone(this.state.orders);
      let remove = _.without(orders, order);
      this.setState({ orders: remove });
      this.props.onGoAddOrder(remove);
    }
  };

  notaHandler = e => {
    switch (e.target.name) {
      case "notas":
        let value = e.target.value;
        value = value.replace(/[^A-Za-z_ ]/gi, "");
        this.setState({
          notas: value
        });
        break;
      default:
        break;
    }
  };

  directoHandler = e => {
    let directo = _.clone(this.state.directo);
    this.setState({
      directo: !directo
    });
  };

  keyPressHandler = (keyboard, origen) => {
    switch (origen) {
      case "plus":
        if (keyboard.charCode === 13) {
          this.quantityHandler(origen);
        }
        break;
      case "minus":
        if (keyboard.charCode === 13) {
          this.quantityHandler(origen);
        }
        break;
      case "add":
        if (keyboard.charCode === 13) {
          this.placeOrderHandler();
        }
        break;
      case "exit":
        if (keyboard.charCode === 13) {
          this.backHandler();
        }
        break;
      default:
        break;
    }
  };

  render() {
    
    // let itemImage = require(`../../assets/ownCloud/${
    //   this.props.Item.image_name
    // }`);
    let itemImage = `./../assets/ownCloud/${this.props.Item.image_name}`

    let optionOne = "";
    let optionTwo = "";
    let optionThree = "";
    let optionFour = "";

    let validator_cf_ingredientes = false;
    let validator_cf_lacteos = false;
    let validator_endulzante = false;
    let validator_cf_temperatura = false;
    let validator_cf_cocci_n = false;

    if (this.props.Item.cf_guarnicion.length > 0) {
      optionOne = (
        <ItemConfigurator
          dataType={this.props.Item.cf_guarnicion}
          LabelFirst={"GUARNICIONES"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
    } else if (this.props.Item.cf_ingredientes.length > 0) {
      optionOne = (
        <ItemConfigurator
          dataType={this.props.Item.cf_ingredientes}
          LabelFirst={"INGREDIENTES"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_cf_ingredientes = true;
    } else if (this.props.Item.cf_lacteos.length > 0) {
      optionOne = (
        <ItemConfigurator
          dataType={this.props.Item.cf_lacteos}
          LabelFirst={"LACTEOS"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_cf_lacteos = true;
    } else if (this.props.Item.endulzante.length > 0) {
      optionOne = (
        <ItemConfigurator
          dataType={this.props.Item.endulzante}
          LabelFirst={"ENDULZANTE"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_endulzante = true;
    } else if (this.props.Item.cf_temperatura.length > 0) {
      optionOne = (
        <ItemConfigurator
          dataType={this.props.Item.cf_temperatura}
          LabelFirst={"TEMPERATURA"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_cf_temperatura = true;
    } else if (this.props.Item.cf_cocci_n.length > 0) {
      optionOne = (
        <ItemConfigurator
          dataType={this.props.Item.cf_cocci_n}
          LabelFirst={"TERMINO"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_cf_cocci_n = true;
    }

    if (
      this.props.Item.cf_ingredientes.length > 0 &&
      validator_cf_ingredientes === false
    ) {
      optionTwo = (
        <ItemConfigurator
          dataType={this.props.Item.cf_ingredientes}
          LabelFirst={"INGREDIENTES"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_cf_ingredientes = true;
    } else if (
      this.props.Item.cf_lacteos.length > 0 &&
      validator_cf_lacteos === false
    ) {
      optionTwo = (
        <ItemConfigurator
          dataType={this.props.Item.cf_lacteos}
          LabelFirst={"LACTEOS"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_cf_lacteos = true;
    } else if (
      this.props.Item.endulzante.length > 0 &&
      validator_endulzante === false
    ) {
      optionTwo = (
        <ItemConfigurator
          dataType={this.props.Item.endulzante}
          LabelFirst={"ENDULZANTE"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_endulzante = true;
    } else if (
      this.props.Item.cf_temperatura.length > 0 &&
      validator_cf_temperatura === false
    ) {
      optionTwo = (
        <ItemConfigurator
          dataType={this.props.Item.cf_temperatura}
          LabelFirst={"TEMPERATURA"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_cf_temperatura = true;
    } else if (
      this.props.Item.cf_cocci_n.length > 0 &&
      validator_cf_cocci_n === false
    ) {
      optionTwo = (
        <ItemConfigurator
          dataType={this.props.Item.cf_cocci_n}
          LabelFirst={"TERMINO"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_cf_cocci_n = true;
    }

    if (
      this.props.Item.cf_lacteos.length > 0 &&
      validator_cf_lacteos === false
    ) {
      optionThree = (
        <ItemConfigurator
          dataType={this.props.Item.cf_lacteos}
          LabelFirst={"LACTEOS"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_cf_lacteos = true;
    } else if (
      this.props.Item.endulzante.length > 0 &&
      validator_endulzante === false
    ) {
      optionThree = (
        <ItemConfigurator
          dataType={this.props.Item.endulzante}
          LabelFirst={"ENDULZANTE"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_endulzante = true;
    } else if (
      this.props.Item.cf_temperatura.length > 0 &&
      validator_cf_temperatura === false
    ) {
      optionThree = (
        <ItemConfigurator
          dataType={this.props.Item.cf_temperatura}
          LabelFirst={"TEMPERATURA"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_cf_temperatura = true;
    } else if (
      this.props.Item.cf_cocci_n.length > 0 &&
      validator_cf_cocci_n === false
    ) {
      optionThree = (
        <ItemConfigurator
          dataType={this.props.Item.cf_cocci_n}
          LabelFirst={"TERMINO"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_cf_cocci_n = true;
    }

    if (
      this.props.Item.cf_lacteos.length > 0 &&
      validator_cf_lacteos === false
    ) {
      optionFour = (
        <ItemConfigurator
          dataType={this.props.Item.cf_lacteos}
          LabelFirst={"LACTEOS"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_cf_lacteos = true;
    } else if (
      this.props.Item.endulzante.length > 0 &&
      validator_endulzante === false
    ) {
      optionFour = (
        <ItemConfigurator
          dataType={this.props.Item.endulzante}
          LabelFirst={"ENDULZANTE"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_endulzante = true;
    } else if (
      this.props.Item.cf_temperatura.length > 0 &&
      validator_cf_temperatura === false
    ) {
      optionFour = (
        <ItemConfigurator
          dataType={this.props.Item.cf_temperatura}
          LabelFirst={"TEMPERATURA"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_cf_temperatura = true;
    } else if (
      this.props.Item.cf_cocci_n.length > 0 &&
      validator_cf_cocci_n === false
    ) {
      optionFour = (
        <ItemConfigurator
          dataType={this.props.Item.cf_cocci_n}
          LabelFirst={"TERMINO"}
          configOptionsHandler={this.configOptionsHandler}
          state={this.state}
          lacteosState={this.state.lacteosState}
          endulzanteState={this.state.endulzanteState}
          temperaturaState={this.state.temperaturaState}
          terminoState={this.state.terminoState}
        />
      );
      validator_cf_cocci_n = true;
    }

    let recargo = this.props.estadoRecargo ? 1.28 : 1.18;

    let precio = (parseFloat(this.props.Item.precio_receta) * recargo).toFixed(
      2
    );

    return (
      <div className={classes.OrderContainer}>
        <div className={classes.HeaderContainer}>
          <div className={classes.ItemTitle}>
            {this.props.Item.name.toUpperCase()}
          </div>
        </div>
        <div className={classes.ItemContainer}>
          <div className={classes.ImageContainer}>
            <img
              className={classes.ActualImage}
              src={itemImage}
              style={{
                objectFit: "fill"
                // objectFit: "contain",
                // objectFit: "cover",
                // objectFit: "scale-down",
              }}
              alt=""
            />
            <span className={classes.PriceText}>{`S/ ${precio}`}</span>
          </div>
          <div className={classes.ConfigContainer}>
            <span className={classes.Description}>
              {this.props.Item.description}
            </span>
            <div className={classes.ConfigContainer}>
              <div className={classes.OptionOne}>{optionOne}</div>
              <div className={classes.OptionTwo}>{optionTwo}</div>
              <div className={classes.OptionThree}>{optionThree}</div>
              <div className={classes.OptionFour}>{optionFour}</div>
            </div>
            <div className={classes.QuantContainer}>
              <span className={classes.QuanTitle}>CANTIDAD</span>
              <div className={classes.Minus}>
                <span
                  tabIndex={2}
                  className="fas fa-minus-square"
                  onClick={() => this.quantityHandler("minus")}
                  onKeyPress={k => this.keyPressHandler(k, "minus")}
                />
              </div>
              <span className={classes.Number}>{this.state.quantity}</span>
              <div className={classes.Plus}>
                <span
                  ref={input => {
                    this.plusButton = input;
                  }}
                  tabIndex={1}
                  autoFocus
                  className="fas fa-plus-square"
                  onClick={() => this.quantityHandler("plus")}
                  onKeyPress={k => this.keyPressHandler(k, "plus")}
                />
              </div>
              {!this.state.canDirecto ? (
                ""
              ) : (
                <div className={classes.Directo}>
                  <input
                    className={classes.Check}
                    onChange={e => this.directoHandler(e)}
                    type="checkbox"
                    checked={this.state.directo}
                  />
                  <span className={classes.Text}>Directo</span>
                </div>
              )}
              <div className={classes.Notas}>
                <input
                  tabIndex={3}
                  className={classes.TextBox}
                  type="text"
                  name={"notas"}
                  value={this.state.notas}
                  maxLength="150"
                  placeholder="Notas de la orden"
                  onChange={e => this.notaHandler(e)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={classes.OrderControl}>
          <OrderFooter
            tabIndex={4}
            tabIndex2={5}
            state={this.state}
            action={"Agregar"}
            keyHandler={this.keyPressHandler}
            listItems={this.state.orders}
            // orderHanlder={this.props.onGoOrderDetails}
            orderHandler={this.placeOrderHandler}
            // backClicked={this.props.onGoTakeOrder}
            backClicked={this.backHandler}
            isVisible={"hidden"}
            removeOrderHandler={this.removeOrderHandler}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    // swView: state.swView.switchView,
    Item: state.CatalogList.Item,
    Orders: state.getDoc.Orders,
    cajeroId: state.topBarState.cajeroId,
    estadoRecargo:
      state.Recargos.Recargos.length > 0
        ? state.Recargos.Recargos[0].estado
        : null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGoAddOrder: order => dispatch(OrderNoteActions.addOrder(order))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetails);
