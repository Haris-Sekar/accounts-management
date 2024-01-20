import { ReactElement } from "react";

export interface IDialogBox {
    id: string,
    title: string;
    description: ReactElement;
    failureBtnText: string;
    successBtnText: string;
}