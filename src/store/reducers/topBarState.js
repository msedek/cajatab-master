import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  clientZoho: "general",
  cajeroId: "",
  fondoId: "",
  firstTitle: "CAJERO:",
  secondTitle: "CAJA:",
  thirdTitle: "",
  firstData: "",
  secondData: "01",
  thirdData: "",
  firstTop: "",
  secondTop: "",
  firstBottom: "10/10/2017",
  secondBottom: "12:20:45 pm",
  textAlignFirstBottom: "center",
  fontSizeSecondBottom: "1.3rem",
  fontWeightSecondBottom: "bold",
  topBarVisibility: "hidden",
  cargo: "",
  token: ""
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SAVE_CLIENT_ZOHO:
      return updateObject(state, { clientZoho: action.clientZoho });
    case actionTypes.SAVE_TOKEN:
      return updateObject(state, { token: action.token });
    case actionTypes.SET_CARGO:
      return updateObject(state, { cargo: action.cargo });
    case actionTypes.SET_FONDO_ID:
      return updateObject(state, { fondoId: action.fondoId });
    case actionTypes.SET_CAJERO_ID:
      return updateObject(state, { cajeroId: action.cajeroId });
    case actionTypes.SET_FIRST_TITLE:
      return updateObject(state, { firstTitle: action.firstTitle });
    case actionTypes.SET_SECOND_TITLE:
      return updateObject(state, { secondtTitle: action.secondtTitle });
    case actionTypes.SET_THIRD_TITLE:
      return updateObject(state, { thirdTitle: action.thirdTitle });
    case actionTypes.SET_FIRST_DATA:
      return updateObject(state, { firstData: action.firstData });
    case actionTypes.SET_SECOND_DATA:
      return updateObject(state, { secondData: action.secondData });
    case actionTypes.SET_THIRD_DATA:
      return updateObject(state, { thirdData: action.thirdData });
    case actionTypes.SET_FIRST_TOP:
      return updateObject(state, { firstTop: action.firstTop });
    case actionTypes.SET_SECOND_TOP:
      return updateObject(state, { secondTop: action.secondTop });
    case actionTypes.SET_FIRST_BOTTOM:
      return updateObject(state, { firstBottom: action.firstBottom });
    case actionTypes.SET_SECOND_BOTTOM:
      return updateObject(state, { secondBottom: action.secondBottom });
    case actionTypes.SET_TEXT_ALIGN_FIRST_BOTTOM:
      return updateObject(state, {
        textAlignFirstBottom: action.textAlignFirstBottom
      });
    case actionTypes.SET_FONT_SIZE_SECOND_BOTTOM:
      return updateObject(state, {
        fontSizeSecondBottom: action.fontSizeSecondBottom
      });
    case actionTypes.SET_FONT_WEIGHT_SECOND_BOTTOM:
      return updateObject(state, {
        fontWeightSecondBottom: action.fontWeightSecondBottom
      });
    case actionTypes.SET_TOP_BAR_VISIBILITY:
      return updateObject(state, { topBarVisibility: action.topBarVisibility });
    default:
      return state;
  }
};

export default reducer;
