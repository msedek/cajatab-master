import * as actionTypes from "./actionTypes";
import axios from "axios";

import { END_POINT } from "../../configs/configs";

const myUrl = `${END_POINT}comandacas`;

export const getComanda = order => {
  return {
    type: actionTypes.GET_COMANDA,
    Orders: order
  };
};

export const addOrder = order => {
  return {
    type: actionTypes.ADD_ORDER,
    Order: order
  };
};

export const setPax = pax => {
  return {
    type: actionTypes.SET_PAX,
    Pax: pax
  };
};

export const getOrder = () => {
  return dispatch => {
    axios
      .get(myUrl, {
        headers: { "Access-Control-Allow-Origin": "*" },
        responseType: "json"
      })
      .then(response => {
        dispatch(getComanda(response.data));
      })
      .catch(error => {
        console.log(error); 
      });
  };
};
