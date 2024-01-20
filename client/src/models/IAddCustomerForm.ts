export interface IAddCustomerForm {
    customerName: string,
    area: string,
    phoneNumber: number,
    balance: number
}

export interface ICustomerDetails {
    _id: string,
    customerName: string,
    area: string,
    phoneNumber: number,
    balance: number,
    totalBills: number,
    totalSalesAmount: number,
}