import * as actionType from "../consts/actionTypes";
import { IReducerAction } from "../models/IReducer";


const voucherReducer = (
    state = { vouchers: [], isLoading: false },
    action: IReducerAction
) => {
    switch (action.type) {
        case actionType.GET_VOUCHERS:
            return { ...state, vouchers: action.data.vouchers, isLoading: false };
        case actionType.LOADING:
            return { ...state, isLoading: action.data };
        default:
            return state;
    }
};

export default voucherReducer;
