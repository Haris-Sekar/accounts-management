import { toast } from "react-toastify";
import { API } from "../axios";
import { IAddCustomerForm } from "../../models/IAddCustomerForm"; 

async function addCustomers(data: IAddCustomerForm) { 

    return toast.promise(API.post(`/customers`, data), {
        pending: {
            render() {
                return `Creating customer`;
            },
            icon: true
        },
        success: {
            render() {
                return `Customer created successfully`;
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

async function updateCustomers(data: IAddCustomerForm, id: string) {
    return toast.promise(API.patch(`/customers/${id}`, data), {
        pending: {
            render() {
                return `Updating customer`;
            },
            icon: true
        },
        success: {
            render() {
                return `Customer updated successfully`;
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

async function deleteCustomer(id: string) {
    return toast.promise(API.delete(`/customers/${id}`), {
        pending: {
            render() {
                return `Deleting customer`;
            },
            icon: true
        },
        success: {
            render() {
                return `Customer deleted successfully`;
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
export { addCustomers, updateCustomers, deleteCustomer };