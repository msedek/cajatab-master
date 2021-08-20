import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { BrowserRouter } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";

import "./index.css";
import App from "./App";
// import registerServiceWorker from "./registerServiceWorker";
import shadowReducer from "./store/reducers/cShadow";
import getDocReducer from "./store/reducers/orderNote";
import getCatalogReducer from "./store/reducers/catalog";
import confTopBarReducer from "./store/reducers/topBarState";
import getTablesReducer from "./store/reducers/tables";
import setCheckReducer from "./store/reducers/checkState";
import passItemToCheck from "./store/reducers/itemCheck";
import passItemToList from "./store/reducers/itemCheck";
import indexOnCheck from "./store/reducers/itemCheck";
import indexOnSubCheck from "./store/reducers/itemCheck";
import fillingChecks from "./store/reducers/finalCheck";
import recargosReducer from "./store/reducers/recargos";

const rootReducer = combineReducers({
  shadowRed: shadowReducer,
  getDoc: getDocReducer,
  CatalogList: getCatalogReducer,
  topBarState: confTopBarReducer,
  tablesList: getTablesReducer,
  order: setCheckReducer,
  Item: passItemToCheck,
  ItemBack: passItemToList,
  indexCheck: indexOnCheck,
  indexSubCheck: indexOnSubCheck,
  finalChecks: fillingChecks,
  Recargos: recargosReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

// registerServiceWorker();
