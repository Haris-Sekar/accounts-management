import * as actionType from "../consts/actionTypes";
import { IReducerAction } from "../models/IReducer";


const userReducer = (
    state = { users: [], isLoading: false },
    action: IReducerAction
) => {
    switch (action.type) {
        case actionType.GET_USERS:
            return { ...state, users: action.data.users, isLoading: false };
        case actionType.LOADING:
            return { ...state, isLoading: action.data };
        default:
            return state;
    }
};

export default userReducer;
