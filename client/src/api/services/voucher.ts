import { toast } from "react-toastify";
import { API } from "../axios";
import { IAddVoucherFrom } from "../../models/IAddVoucherForm";

async function addVoucher(data: IAddVoucherFrom) {
    return toast.promise(API.post(`/voucher`, data), {
        pending: {
            render() {
                return `Adding Voucher`;
            },
            icon: true
        },
        success: {
            render() {
                return `Voucher Added Successfully`;
            },
            icon: true
        },
        error: {
            render({ data }) {
                //@ts-ignore
                return data?.response?.data.message;
            }
        }
    })
}

async function updateVoucher(data: IAddVoucherFrom, id: string) {
    return toast.promise(API.patch(`/voucher/${id}`, data), {
        pending: {
            render() {
                return `Updating voucher`;
            },
            icon: true
        },
        success: {
            render() {
                return `Voucher updated successfully`;
            },
            icon: true
        },
        error: {
            render({ data }) {
                //@ts-ignore
                return data?.response?.data.message;
            }
        }
    })
};


async function deleteVoucher(id: string) {
    return toast.promise(API.delete(`/voucher/${id}`), {
        pending: {
            render() {
                return `Deleting voucher`;
            },
            icon: true
        },
        success: {
            render() {
                return `Voucher has been deleted successfully`;
            },
            icon: true
        },
        error: {
            render({ data }) {
                //@ts-ignore
                return data?.response?.data.message;
            }
        }
    }) 
}

export { addVoucher, updateVoucher, deleteVoucher };