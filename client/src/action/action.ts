/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "react-toastify";
import { API } from "../api/axios";
import {
  GET_CUSTOMERS,
  LOADING,
  GET_BILLS,
  GET_VOUCHERS,
  GET_CUSTOMER,
  GET_DASHBOARD_DETAILS,
} from "../consts/actionTypes";

export const getCustomers =
  (id: string | null) => async (dispatch: Function) => {
    try {
      dispatch({ type: LOADING, data: true });
      const url =
        id !== null && id !== undefined ? `customers/${id}` : `/customers`;
      const { data } = await API.get(url);
      if (id && id.length > 0) {
        dispatch({ type: GET_CUSTOMER, data });
      } else {
        dispatch({ type: GET_CUSTOMERS, data });
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

export const getBills = (id: string | null) => async (dispatch: Function) => {
  try {
    dispatch({ type: LOADING, data: true });
    const url = id !== null && id !== undefined ? `bills/${id}` : `/bills`;
    const { data } = await API.get(url);
    if (data.code === 200) {
      dispatch({ type: GET_BILLS, data });
    } else {
      toast.error(data.message);
    }
  } catch (error: any) {
    toast.error(error);
  }
};

export const getVouchers =
  (id: string | null) => async (dispatch: Function) => {
    try {
      dispatch({ type: LOADING, data: true });
      const url =
        id !== null && id !== undefined ? `voucher/${id}` : `/voucher`;
      const { data } = await API.get(url);
      if (data.code === 200) {
        dispatch({ type: GET_VOUCHERS, data });
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

export const getDashBoardDetails = () => async (dispatch: Function) => {
  try {
    dispatch({ type: LOADING, data: true });
    const { data } = await API.get("/dashboard");
    if (data.code === 200) {
      dispatch({ type: GET_DASHBOARD_DETAILS, data });
    } else {
      toast.error(data.message);
    }
  } catch (error: any) {
    toast.error(error);
  }
};
