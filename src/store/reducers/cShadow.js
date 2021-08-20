import * as actionTypes from '../actions/actionTypes'
import { updateObject } from '../utility'

const initialState = {
    // cardShadow: '0 0 8px #888'
    cardShadow: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.TURN_SHADOW_CARD_OFF: return updateObject(state, { cardShadow: action.val })
        default: return state
    }
};

export default reducer