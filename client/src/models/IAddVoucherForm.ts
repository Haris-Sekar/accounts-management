export interface IVoucherDetails {
    _id: string;
    customerName: string;
    amount: number;
    date: number;
    isCheque: boolean;
    chequeNumber: number;
    isChequeCredited: boolean;
    bankName: string
}

export interface IAddVoucherFrom {
    customerId: string;
    amount: number;
    date: number;
    isCheque: boolean;
    chequeNumber: number;
    isChequeCredited: boolean;
    bankName: string 
}