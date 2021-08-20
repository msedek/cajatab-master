import * as actionTypes from "./actionTypes";
import axios from "axios";

import { END_POINT } from "../../configs/configs";

const myUrl = `${END_POINT}mesas`;

export const getMesas = mesas => {
  return {
    type: actionTypes.GET_MESAS,
    Mesas: mesas
  };
};

export const setMesaEstado = estado => {
  return {
    type: actionTypes.SET_MESA_ESTADO,
    estado: estado
  };
};

export const getTables = () => {
  return dispatch => {
    axios
      .get(myUrl, {
        headers: { "Access-Control-Allow-Origin": "*" },
        responseType: "json"
      })
      .then(response => {
        dispatch(getMesas(response.data));
      })
      .catch(error => {
        console.log(error); 
      });
  };
};

export const setTableNumber = tableNumber => {
  return {
    type: actionTypes.SET_TABLE_NUMBER,
    tableNumber: tableNumber
  };
};

export const getMesaID = mesaID => {
  return {
    type: actionTypes.GET_MESA_ID,
    mesaID: mesaID
  };
};
