import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  Recargos: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_RECARGOS:
      return updateObject(state, { Recargos: action.Recargos });
    default:
      return state;
  }
};

export default reducer;
