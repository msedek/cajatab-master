import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import LoginScreen from "./containers/LoginScreen/LoginScreen";
import MainCashier from "./containers/MainCashier/MainCashier";
import StatusMesas from "./containers/StatusMesas/StatusMesas";
import MainCharge from "./containers/MainCharge/MainCharge";
import TakeOrder from "./containers/TakeOrder/TakeOrder";
import OrderDetails from "./containers/OrderDetails/OrderDetails";
import ActualCashier from "./containers/ActualCashier/ActualCashier";
import CashierResume from "./containers/CashierResume/CashierResume";
import CashierRegister from "./containers/CashierRegister/CashierRegister";
import CashSettings from "./containers/cashSettings/cashSettings";
import Recipe from "./containers/Recipe/Recipe";
import WareHouse from "./containers/WareHouse/WareHouse";
import CreditNotes from "./containers/CreditNotes/CreditNotes";

class App extends Component {
  render() {
    return (
      <div>
        <Layout infoTop={undefined}>
          <Switch>
            <Route path="/maincashier" component={MainCashier} />
            <Route path="/statusmesas" component={StatusMesas} />
            <Route path="/maincharge" component={MainCharge} />
            <Route path="/takeorder" component={TakeOrder} />
            <Route path="/orderdetails" component={OrderDetails} />
            <Route path="/actualcashier" component={ActualCashier} />
            <Route path="/cashierresume" component={CashierResume} />
            <Route path="/cashierregister" component={CashierRegister} />
            <Route path="/settings" component={CashSettings} />
            <Route path="/recipes" component={Recipe} />
            <Route path="/warehouse" component={WareHouse} />
            <Route path="/creditnotes" component={CreditNotes} />
            <Route path="/" exact component={LoginScreen} />
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;
