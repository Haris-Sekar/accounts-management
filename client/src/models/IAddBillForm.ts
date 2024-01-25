/* eslint-disable @typescript-eslint/no-explicit-any */
import { Moment } from "moment"

export interface IBillDetails {
    gData: any;
    _id: string,
    customerName: string,
    billNumber: number,
    billDate: number,
    amount: number
}

export interface IBillAddForm {
    billNo: number,
    customerId: string,
    billDate: number | Moment,
    amount: number
}