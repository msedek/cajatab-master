import * as actionTypes from "./actionTypes";
import axios from "axios";

import { END_POINT } from "../../configs/configs";

const myUrl = `${END_POINT}recargos`;

export const getRecargo = recargos => {
  return {
    type: actionTypes.GET_RECARGOS,
    Recargos: recargos
  };
};

export const getRecargos = () => {
  return dispatch => {
    axios
      .get(myUrl, {
        headers: { "Access-Control-Allow-Origin": "*" },
        responseType: "json"
      })
      .then(response => {
        dispatch(getRecargo(response.data));
      })
      .catch(error => {
        console.log(error); 
      });
  };
};
