import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  Catalog: [],
  Item: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CLEAR_CATALOG:
      return updateObject(state, { Catalog: action.Catalog });
    case actionTypes.GET_CATALOG:
      return updateObject(state, { Catalog: action.Catalog });
    case actionTypes.SEND_ITEM:
      return updateObject(state, { Item: action.Item });
    default:
      return state;
  }
};

export default reducer;
