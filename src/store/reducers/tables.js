import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  Mesas: [],
  tableNumber: null,
  mesaID: null,
  estado:""
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_MESA_ESTADO:
      return updateObject(state, { estado: action.estado });
    case actionTypes.GET_MESAS:
      return updateObject(state, { Mesas: action.Mesas });
    case actionTypes.SET_TABLE_NUMBER:
      return updateObject(state, { tableNumber: action.tableNumber });
    case actionTypes.GET_MESA_ID:
      return updateObject(state, { mesaID: action.mesaID });
    default:
      return state;
  }
};

export default reducer;
