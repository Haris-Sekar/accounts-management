import * as actionType from "../consts/actionTypes";
import { IReducerAction } from "../models/IReducer";


const billsReducer = (
    state = { bills: [], isLoading: false },
    action: IReducerAction
) => {
    switch (action.type) {
        case actionType.GET_BILLS:
            return { ...state, bills: action.data.bills, isLoading: false };
        case actionType.LOADING:
            return { ...state, isLoading: action.data };
        default:
            return state;
    }
};

export default billsReducer;
