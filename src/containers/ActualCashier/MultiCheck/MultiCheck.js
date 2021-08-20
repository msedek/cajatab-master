import React, { Component } from "react";
import uniqid from "uniqid";
import classes from "./MultiCheck.scss";

class MultiCheck extends Component {
  render() {
    let nCuenta = this.props.numCuenta === "" ? "TOTAL" : this.props.numCuenta;

    let trow = [];

    let preKey = this.props.numCuenta + "";
    for (let i = 0; i < this.props.dataCuenta.length; i++) {
      let cuenta = this.props.dataCuenta[i];
      let key = preKey + i;
      let nombreArticulo = cuenta.nombrePlato;
      let totalArticulo = cuenta.precioTotal.toFixed(2);
      trow.push(
        <tr
          key={key}
          style={{
            width: "250px"
          }}
        >
          <td
            key={uniqid()}
            style={{
              width: "80%"
            }}
          >
            {nombreArticulo}
          </td>
          <td
            key={uniqid()}
            style={{
              width: "7%"
            }}
          >
            <input
              key={uniqid()}
              style={{
                cursor: "pointer"
              }}
              checked={this.props.values[`check${i}`]}
              type="checkbox"
              onChange={() =>
                this.props.descuentoHandler(totalArticulo, i, `check${i}`)
              }
            />
          </td>
          <td
            key={uniqid()}
            style={{
              textAlign: "start",
              width: "20%"
            }}
          >
            {totalArticulo}
          </td>
        </tr>
      );
    }

    let recargo = parseFloat(this.props.recargo).toFixed(2);
    let impIgv = parseFloat(this.props.igv).toFixed(2);
    let total;

    let inafectas = this.props.inafectas.toFixed(2);

    if (
      this.props.gratuito ||
      this.props.exoneradas > 0 ||
      this.props.inafectas > 0
    ) {
      if (this.props.gratuito) {
        total = "0.00";
        inafectas = "0.00";
      }
      if (this.props.inafectas > 0) {
        total = this.props.inafectas.toFixed(2);
      }
      //   total = parseFloat(
      //     this.props.total - this.props.total * 0.18 - this.props.total * 0.1
      //   ).toFixed(2);
      recargo = "0.00";
      impIgv = "0.00";
    } else {
      total = parseFloat(this.props.total).toFixed(2);
    }

    // this.props.gratuito ? "0.00" : parseFloat(this.props.total).toFixed(2);

    return (
      <div className={classes.Container}>
        <div className={classes.ListContainer}>
          <div className={classes.BreakLine} />
          <div className={classes.Title}>
            <div className={classes.NumCuenta}>{"CUENTA " + nCuenta}</div>
          </div>
          <div className={classes.Content}>
            <table
              className={classes.TableContent}
              cellSpacing="0"
              cellPadding="2"
              style={{
                width: "100%"
              }}
            >
              <tbody>{trow}</tbody>
            </table>
          </div>
          <div className={classes.Totals}>
            <div className={classes.TotalLabel}>Total Op. Gravada</div>
            <div className={classes.TotalSol}>S/</div>
            <div className={classes.TotalPrice}>
              {parseFloat(this.props.gravadas).toFixed(2)}
            </div>
            <div className={classes.DsctoLabel}>Total Dscto.</div>
            <div className={classes.DsctoSol}>S/</div>
            <div className={classes.DsctoPrice}>
              {this.props.totalDescuentos > 0
                ? parseFloat(this.props.totalDescuentos).toFixed(2)
                : "-"}
            </div>
            <div className={classes.GratuitaLabel}>Total Op. Gratuita.</div>
            <div className={classes.GratuitaSol}>S/</div>
            <div className={classes.GratuitaPrice}>
              {this.props.gratuito
                ? this.props.totalReferencial.toFixed(2)
                : "-"}
            </div>
            <div className={classes.InafectaLabel}>Total Op. Inafecta</div>
            <div className={classes.InafectaSol}>S/</div>
            <div className={classes.InafectaPrice}>{inafectas}</div>
            <div className={classes.ExoneradaLabel}>Total Op. Exonerada</div>
            <div className={classes.ExoneradaSol}>S/</div>
            <div className={classes.ExoneradaPrice}>
              {this.props.exoneradas.toFixed(2)}
            </div>
            <div className={classes.RecargoLabel}>Recargo por Consumo 10%</div>
            <div className={classes.RecargoSol}>S/</div>
            <div className={classes.RecargoPrice}>{recargo}</div>
            <div className={classes.IGVLabel}>Total IGV 18%</div>
            <div className={classes.IGVSol}>S/</div>
            <div className={classes.IGVPrice}>{impIgv}</div>
            <div className={classes.MontoLabel}>Monto Total</div>
            <div className={classes.MontoSol}>S/</div>
            <div className={classes.MontoPrice}>{total}</div>
          </div>
        </div>
        <div className={classes.TypeDocumentContainer}>
          <div className={classes.Radios}>
            <div className={classes.Document}>
              {this.props.tipoDoc === "01" ? "FACTURA" : "BOLETA"}
            </div>
          </div>
        </div>
        <div className={classes.RucContainer}>
          <div className={classes.Ruc}>
            <div className={classes.Label}>RUC</div>
          </div>
          <div className={classes.NumRuc}> {this.props.numDocReceptor}</div>
        </div>
        <div className={classes.NameContainer}>
          <div className={classes.Name}>
            <div className={classes.LabelName}>NOMBRE</div>
          </div>
          <div className={classes.ActualName}> {this.props.nombreReceptor}</div>
        </div>
        <div className={classes.DirectionContainer}>
          <div className={classes.Dir}>
            <div className={classes.LabelDir}>DIRECCION</div>
          </div>
          <div className={classes.ActualDir}>{this.props.direccionDestino}</div>
        </div>
        <div className={classes.emailContainer}>
          <div className={classes.mail}>
            <div className={classes.LabelMail}>E-MAIL</div>
          </div>
          <div className={classes.email}> {this.props.email}</div>
        </div>
      </div>
    );
  }
}

export default MultiCheck;
