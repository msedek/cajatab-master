import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  Item: null,
  ItemBack: null,
  indexCheck: null,
  indexSubCheck: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PASS_ITEM_TO_CHECK:
      return updateObject(state, { Item: action.item });
    case actionTypes.PASS_ITEM_TO_LIST:
      return updateObject(state, { ItemBack: action.itemBack });
    case actionTypes.SET_INDEX_CHECK:
      return updateObject(state, { indexCheck: action.indexCheck });
    case actionTypes.SET_INDEX_SUBCHECK:
      return updateObject(state, { indexSubCheck: action.indexSubCheck });
    default:
      return state;
  }
};

export default reducer;
