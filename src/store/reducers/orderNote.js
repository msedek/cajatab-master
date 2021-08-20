import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  Comanda: [],
  Orders: [],
  Pax:""
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_PAX:
      return updateObject(state, { Pax: action.Pax });
    case actionTypes.GET_COMANDA:
      return updateObject(state, { Comanda: action.Orders });
    case actionTypes.ADD_ORDER:
      return updateObject(state, { Orders: action.Order });
    default:
      return state;
  }
};

export default reducer;
