import * as actionTypes from './actionTypes'

export const turnShadowCardOff = (value) => {
    return {
        type: actionTypes.TURN_SHADOW_CARD_OFF,
        val: value
    };
}