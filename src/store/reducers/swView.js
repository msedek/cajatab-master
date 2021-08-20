import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../utility'

const initialState = {
  // switchView: 'StatusMesas',
  switchView: 'Login',
  // switchView: 'MainCashier',
  // switchView: 'MainCharge',
  // switchView: 'ActualCashier',
  // switchView: 'CashierResume',
  // switchView: 'CashierRegister',
  // switchView: 'OrderDetails',
  // switchView: 'TakeOrder',

}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GO_LOGIN: return updateObject(state, { switchView: 'Login' })
    case actionTypes.GO_MAINCASHIER: return updateObject(state, { switchView: 'MainCashier' })
    case actionTypes.GO_STATUSMESA: return updateObject(state, { switchView: 'StatusMesas' })
    case actionTypes.GO_MAINCHARGE: return updateObject(state, { switchView: 'MainCharge' })
    case actionTypes.GO_ACTUALCASHIER: return updateObject(state, { switchView: 'ActualCashier' })
    case actionTypes.GO_CASHIERRESUME: return updateObject(state, { switchView: 'CashierResume' })
    case actionTypes.GO_CASHIERREGISTER: return updateObject(state, { switchView: 'CashierRegister' })
    case actionTypes.GO_TAKEORDER: return updateObject(state, { switchView: 'TakeOrder' })
    case actionTypes.GO_ORDERDETAILS: return updateObject(state, { switchView: 'OrderDetails' })
    default: return state
  }
};

export default reducer;
//concat() is push but returns changens inmutably
//array.filter((el) => el.condition !== action.payload.condition); delete element inmutably