import React, { Component } from "react";
import { connect } from "react-redux";
import VisibilitySensor from "react-visibility-sensor";
import axios from "axios";
import _ from "underscore";

import classes from "./TakeOrder.scss";
import * as CatalogActions from "../../store/actions/index";
import * as OrderNoteActions from "../../store/actions/index";
import CatalogShape from "../../components/CatalogShape/CatalogShape";
import OrderFooter from "../../components/OrderFooter/OrderFooter";
import { END_POINT, ALERTA_INTERNA } from "../../configs/configs";
import uniqid from "uniqid";

class TakeOrder extends Component {
  state = {
    itemCategory: null,
    orders: [],
    search: "",
    items: [],
    itemNames: [],
    pax: ""
  };

  myref = React.createRef();
  searchRef = React.createRef();

  componentDidUpdate() {
    let items = _.clone(this.state.items);
    if (this.props.CatalogList.length > 0) {
      if (this.state.items.length === 0) {
        let data = _.clone(this.props.CatalogList);
        data.sort((a, b) => {
          const aCategory = a.cf_familia;
          const bCategory = b.cf_familia;
          const aName = a.name;
          const bName = b.name;

          if (aCategory === bCategory) {
            return aName < bName ? -1 : aName > bName ? 1 : 0;
          } else {
            return aCategory < bCategory ? -1 : 1;
          }
        });

        let rows = [];
        let catalog = _.chunk(data, 6);

        for (let i = 0; i < catalog.length; i++) {
          const row = catalog[i];

          let familia = "";
          let cell = [];
          let spacer = [
            <tr key={uniqid()} />,
            <tr key={uniqid()} />,
            <tr key={uniqid()} />,
            <tr key={uniqid()} />,
            <tr key={uniqid()} />,
            <tr key={uniqid()} />,
            <tr key={uniqid()} />,
            <tr key={uniqid()} />,
            <tr key={uniqid()} />,
            <tr key={uniqid()} />,
            <tr key={uniqid()} />,
            <tr key={uniqid()} />
          ];

          for (let index = 0; index < row.length; index++) {
            const el = row[index];
            this[el.name] = React.createRef();
            cell.push(
              <td
                ref={this[el.name]}
                key={`${el.id} ${index}`}
                style={{
                  paddingRight: "2.2rem"
                }}
              >
                <CatalogShape
                  key={el.id + el.id}
                  itemImage={el.image_name}
                  itemName={el.name}
                  data={el}
                  clicked={this.clickHandler}
                />
              </td>
            );

            familia = el.cf_familia;
          }
          rows.push(
            <VisibilitySensor
              ref={i === 4 ? this.myref : null}
              key={i}
              onChange={isVisible => {
                if (isVisible) {
                  this.change(familia);
                }
              }}
            >
              <tr key={i + i * 2}>{cell}</tr>
            </VisibilitySensor>
          );
          rows.push(spacer);
        }
        items.push(rows);
        this.setState({ items: items }, () => {
          this.props.onClearCatalog();
        });
      }
    }
  }

  componentDidMount = async () => {
    if (this.props.cajeroId === "") {
      this.backHandler();
    } else {
      this.props.onGetCatalog();
      await this.setState({
        orders: this.props.Orders
      });
      this.searchRef.focus();
    }
  };

  clickHandler = item => {
    this.props.onSendItemDetails(item);
    // this.props.onGoOrderDetails()
    this.props.history.push("/orderdetails");
  };

  backHandler = () => {
    this.props.onGoAddOrder([]);
    this.props.history.goBack();
  };

  sendOrder = comanda => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${END_POINT}comandas/`, comanda, {
          headers: { "Access-Control-Allow-Origin": "*" },
          responseType: "json"
        })
        .then(response => {
          resolve("Orden Creada con Exito");
        })
        .catch(error => {
          reject(error.message); 
        });
    });
  };

  placeOrderHandler = async () => {
    if (this.props.Orders.length === 0) {
      alert("Seleccione Producto");
    } else if (
      (parseInt(this.state.pax, 10) <= 0 || this.state.pax === "") &&
      (this.props.estado === "Libre" ||
        (this.props.estado === "Master" && this.props.order.length === 0))
    ) {
      if (parseInt(this.state.pax, 10) <= 0) {
        alert("Pax no puede ser menor a 1");
      } else {
        alert("Indique el pax en numero entero");
      }
    } else {
      let comanda = {};

      comanda.mesa = this.props.mesaID;
      comanda.numeroMesa = this.props.numeroMesa;

      let orders = [];
      this.props.Orders.forEach(element => {
        orders.push(element.pedido);
      });

      comanda.orders = orders;
      comanda.enviado = true;
      comanda.empleado = this.props.cajeroId;
      comanda.mesaEstado = this.props.estado;

      comanda.pax =
        this.props.estado === "Libre"
          ? parseInt(this.state.pax, 10)
          : this.props.estado === "Master" && this.props.order.length === 0
          ? parseInt(this.state.pax, 10)
          : 50000;

      comanda.fondoId = this.props.fondoId;

      const sendOrder = await this.sendOrder(comanda).catch(err =>
        alert(ALERTA_INTERNA)
      );
      if (sendOrder !== undefined) {
        this.props.onGoAddOrder([]);
        this.props.history.push("/maincashier");
      }
    }
  };

  removeOrderHandler = (e, order, stateName) => {
    if (order.sent) {
      alert("No puede eliminar pedido enviado");
    } else {
      let orders = _.clone(this.state.orders);
      let remove = _.without(orders, order);
      this.setState({ orders: remove });
      this.props.onGoAddOrder(remove);
    }
  };

  isOdd = num => num % 2;

  typeHandler = e => {
    switch (e.target.name) {
      case "search":
        this.setState(
          {
            search: e.target.value
          },
          () => {
            let items = _.clone(this.state.items).pop();
            for (let i = 0; i < items.length; i++) {
              const row = items[i];
              const isOdd = this.isOdd(i);
              if (isOdd === 0) {
                let subRows = row.props.children.props.children;
                for (let j = 0; j < subRows.length; j++) {
                  const cell = subRows[j];
                  let receta = cell.props.children.props.itemName.toLowerCase();
                  if (this.state.search.length > 4) {
                    if (receta.includes(this.state.search)) {
                      this[
                        cell.props.children.props.itemName
                      ].current.scrollIntoView();
                    }
                  }
                }
              }
            }
          }
        );
        break;
      case "pax":
        this.setState({ pax: e.target.value });
        break;
      default:
        break;
    }
  };

  change = category => this.setState({ itemCategory: category });

  keyPressHandler = (keyboard, origen) => {
    switch (origen) {
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
    return (
      <div className={classes.OrderContainer}>
        <div className={classes.Category}>
          <div className={classes.CategorySpot}>
            <div className={classes.CatActualText}>
              {this.state.itemCategory}
            </div>
            <div className={classes.CategoryBorderContainer}>
              <div className={classes.CatLine} />
            </div>
          </div>
        </div>
        <div className={classes.Catalog}>
          <table>
            <tbody>{this.state.items}</tbody>
          </table>
        </div>
        <div className={classes.OrderControl}>
          <OrderFooter
            sRef={input => {
              this.searchRef = input;
            }}
            keyHandler={this.keyPressHandler}
            estado={this.props.estado}
            state={this.state}
            orderSize={this.props.order}
            sIndex={1}
            tabIndexPax={2}
            tabIndex2={4}
            tabIndex={3}
            action={"Agregar"}
            listItems={this.state.orders}
            orderHandler={this.placeOrderHandler}
            backClicked={this.backHandler}
            isVisible={"visible"}
            pax={this.state.pax}
            search={this.state.search}
            typeHandler={this.typeHandler}
            removeOrderHandler={this.removeOrderHandler}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    CatalogList: state.CatalogList.Catalog,
    Orders: state.getDoc.Orders,
    mesaID: state.tablesList.mesaID,
    estado: state.tablesList.estado,
    numeroMesa: state.tablesList.tableNumber,
    cajeroId: state.topBarState.cajeroId,
    fondoId: state.topBarState.fondoId,
    order: state.order.order
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetCatalog: () => dispatch(CatalogActions.getCatalog()), //here pass table number
    onClearCatalog: () => dispatch(CatalogActions.clearCatalog()), //here pass table number
    onSendItemDetails: item => dispatch(CatalogActions.sendItem(item)), //here pass table number
    onGoAddOrder: order => dispatch(OrderNoteActions.addOrder(order))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TakeOrder);
