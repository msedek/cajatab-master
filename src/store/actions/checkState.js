import * as actionTypes from './actionTypes'

export const setOrder = (order) => {
  return {
    type: actionTypes.SET_ORDER,
    order: order
  };
}