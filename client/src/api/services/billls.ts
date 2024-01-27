import { toast } from "react-toastify";
import { IBillAddForm } from "../../models/IAddBillForm";
import { API, unauthorizedAccess } from "../axios";

async function addBills(data: IBillAddForm) {
    return toast.promise(API.post(`/bills`, data), {
        pending: {
            render() {
                return `Adding Bill`;
            },
            icon: true
        },
        success: {
            render() {
                return `Bill Added Successfully`;
            },
            icon: true
        },
        error: {
            render({ data }) {
                //@ts-ignore
                unauthorizedAccess(data?.response?.data);
                //@ts-ignore
                return data?.response?.data.message;
            }
        }
    })
}

async function updateBill(data: IBillAddForm, id: string) {
    return toast.promise(API.patch(`/bills/${id}`, data), {
        pending: {
            render() {
                return `Updating bill`;
            },
            icon: true
        },
        success: {
            render() {
                return `Bill updated successfully`;
            },
            icon: true
        },
        error: {
            render({ data }) {
                //@ts-ignore
                unauthorizedAccess(data?.response?.data);
                //@ts-ignore
                return data?.response?.data.message;
            }
        }
    })
};


async function deleteBill(id: string) {
    return toast.promise(API.delete(`/bills/${id}`), {
        pending: {
            render() {
                return `Deleting bill`;
            },
            icon: true
        },
        success: {
            render() {
                return `Bill has been deleted successfully`;
            },
            icon: true
        },
        error: {
            render({ data }) {
                //@ts-ignore
                unauthorizedAccess(data?.response?.data);
                //@ts-ignore
                return data?.response?.data.message;
            }
        }
    }) 
}

export { addBills, updateBill, deleteBill };