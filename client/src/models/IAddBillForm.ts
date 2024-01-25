import { Moment } from "moment"

export interface IBillDetails {
    gData(_id: string, customerName: string, billNumber: number, billDate: number, amount: number, gData: any): Data
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