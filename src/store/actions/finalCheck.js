import * as actionTypes from "./actionTypes";

export const fillChecks = checks => {
  return {
    type: actionTypes.FILL_CHECKS,
    checks: checks
  };
};
