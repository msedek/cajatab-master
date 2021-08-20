import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  order: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ORDER:
      return updateObject(state, { order: action.order });
    default:
      return state;
  }
};

export default reducer;
