import * as actionTypes from "./actionTypes";

export const saveClientZoho = clientZoho => {
  return {
    type: actionTypes.SAVE_CLIENT_ZOHO,
    clientZoho: clientZoho
  };
};

export const setFondoId = fondoId => {
  return {
    type: actionTypes.SET_FONDO_ID,
    fondoId: fondoId
  };
};

export const setCajeroId = cajeroId => {
  return {
    type: actionTypes.SET_CAJERO_ID,
    cajeroId: cajeroId
  };
};

export const setCargo = cargo => {
  return {
    type: actionTypes.SET_CARGO,
    cargo: cargo
  };
};

export const saveToken = token => {
  return {
    type: actionTypes.SAVE_TOKEN,
    token: token
  };
};

export const setFirstTitle = firstTitle => {
  return {
    type: actionTypes.SET_FIRST_TITLE,
    firstTitle: firstTitle
  };
};

export const setSecondTitle = secondTitle => {
  return {
    type: actionTypes.SET_SECOND_TITLE,
    secondTitle: secondTitle
  };
};

export const setThirdTitle = thirdTitle => {
  return {
    type: actionTypes.SET_THIRD_TITLE,
    thirdTitle: thirdTitle
  };
};

export const setFirstData = firstData => {
  return {
    type: actionTypes.SET_FIRST_DATA,
    firstData: firstData
  };
};

export const setSecondData = secondData => {
  return {
    type: actionTypes.SET_SECOND_DATA,
    secondData: secondData
  };
};

export const setThirdData = thirdData => {
  return {
    type: actionTypes.SET_THIRD_DATA,
    thirdData: thirdData
  };
};

export const setFirstTop = firstTop => {
  return {
    type: actionTypes.SET_FIRST_TOP,
    firstTop: firstTop
  };
};

export const setSecondTop = secondTop => {
  return {
    type: actionTypes.SET_SECOND_TOP,
    secondTop: secondTop
  };
};

export const setFirstBottom = firstBottom => {
  return {
    type: actionTypes.SET_FIRST_BOTTOM,
    firstBottom: firstBottom
  };
};

export const setSecondBottom = secondBottom => {
  return {
    type: actionTypes.SET_SECOND_BOTTOM,
    secondBottom: secondBottom
  };
};

export const setTextAlignFirstBottom = textAlignFirstBottom => {
  return {
    type: actionTypes.SET_TEXT_ALIGN_FIRST_BOTTOM,
    textAlignFirstBottom: textAlignFirstBottom
  };
};

export const setFontSizeSecondBottom = fontSizeSecondBottom => {
  return {
    type: actionTypes.SET_FONT_SIZE_SECOND_BOTTOM,
    fontSizeSecondBottom: fontSizeSecondBottom
  };
};

export const setFontWeightSecondBottom = fontWeightSecondBottom => {
  return {
    type: actionTypes.SET_FONT_WEIGHT_SECOND_BOTTOM,
    fontWeightSecondBottom: fontWeightSecondBottom
  };
};

export const setTopBarVisibility = topBarVisibility => {
  return {
    type: actionTypes.SET_TOP_BAR_VISIBILITY,
    topBarVisibility: topBarVisibility
  };
};
