import * as actionType from "../consts/actionTypes";
import { IReducerAction } from "../models/IReducer";


const customerReducer = (
    state = { customers: [], customer: {}, isLoading: false },
    action: IReducerAction
) => {
    switch (action.type) {
        case actionType.GET_CUSTOMERS:
            return { ...state, customers: action.data.customers, isLoading: false };
        case actionType.GET_CUSTOMER: 
            return { ...state, customer: action.data.customer, isLoading: false };
        case actionType.LOADING:
            return { ...state, isLoading: action.data };
        default:
            return state;
    }
};

export default customerReducer;
