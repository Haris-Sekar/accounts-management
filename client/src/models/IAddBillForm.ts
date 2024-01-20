import { Moment } from "moment"

export interface IBillDetails {
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