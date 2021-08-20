import * as actionTypes from "./actionTypes";
import axios from "axios";

import { END_POINT } from "../../configs/configs";

const myUrl = `${END_POINT}recetasYacho`;

export const clearCatalog = () => {
  return {
    type: actionTypes.CLEAR_CATALOG,
    Catalog: []
  };
};

export const getCatalogs = catalog => {
  return {
    type: actionTypes.GET_CATALOG,
    Catalog: catalog
  };
};

export const getCatalog = () => {
  let spanishData = [];
  return dispatch => {
    axios
      .get(myUrl, {
        headers: { "Access-Control-Allow-Origin": "*" },
        responseType: "json"
      })
      .then(response => {
        spanishData = [...response.data];
        spanishData = spanishData.filter(el => {
          if (!el.image_name.includes(".jpg"))
            el.image_name = `${el.image_name}.jpg`;
          return el.idioma !== "english";
        });
        dispatch(getCatalogs(spanishData));
      })
      .catch(error => {
        console.log(error); 
      });
  };
};

export const sendItem = item => {
  return {
    type: actionTypes.SEND_ITEM,
    Item: item
  };
};
