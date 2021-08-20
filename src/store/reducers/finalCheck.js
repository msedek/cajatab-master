import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  checks: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FILL_CHECKS:
      return updateObject(state, { checks: action.checks });
    default:
      return state;
  }
};

export default reducer;
