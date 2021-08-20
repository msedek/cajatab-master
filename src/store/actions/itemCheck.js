import * as actionTypes from "./actionTypes";

export const passItemToCheck = item => {
  return {
    type: actionTypes.PASS_ITEM_TO_CHECK,
    item: item
  };
};

export const passItemToList = itemBack => {
  return {
    type: actionTypes.PASS_ITEM_TO_LIST,
    itemBack: itemBack
  };
};

export const setIndexCheck = indexCheck => {
  return {
    type: actionTypes.SET_INDEX_CHECK,
    indexCheck: indexCheck
  };
};

export const setIndexSubCheck = indexSubCheck => {
  return {
    type: actionTypes.SET_INDEX_SUBCHECK,
    indexSubCheck: indexSubCheck
  };
};
