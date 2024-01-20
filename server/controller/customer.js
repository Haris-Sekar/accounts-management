import { fieldValidationError, serverError } from "../consts/APIMessage.js";
import customer from "../model/customer.js";
import bills from "../model/bill.js";
import voucher from "../model/voucher.js";

export const addCustomer = async (req, res) => {
    let code, response;
    addCustomerTry: try {

        let errorFields = fieldValidationError([`customerName`, `phoneNumber`, `area`], req.body);

        if (errorFields !== null && errorFields !== undefined) {
            code = 403;
            response = errorFields;
            break addCustomerTry;
        }

        const { customerName, phoneNumber, area, balance } = req.body;

        const newCustomer = new customer({
            customerName,
            phoneNumber,
            area,
            balance
        });

        const result = await newCustomer.save();

        if (result) {
            code = 201;
            response = {
                message: `Customer created`,
                code: 201
            }
        }

    } catch (error) {
        code = 500;
        response = serverError(error);
    }

    res.status(code).json(response);

}

export const getCustomers = async (req, res) => {
    let code, response;
    try {

        const customers = await customer.find();
        let parsedCustomer = [];

        for (let cus in customers) {
            const customer = customers[cus];
            const bills1 = await bills.find({ customerId: customer._id });
            const vouchers = await voucher.find({ customerId: customer._id });
            const totalBills = bills1.length;
            const totalSalesAmount = bills1.reduce((sum, bill) => {
                return sum + bill.amount;
            }, 0);
            const totalAmountRecived = vouchers.reduce((sum, voucher) => {
                let amount = 0;
                if (voucher.isChequeCredited) {
                    amount = voucher.amount;
                }
                return sum + amount;
            }, 0);
            const balance = (customer.balance + totalSalesAmount) - totalAmountRecived;
            customer.balance = balance;
            const tempCustomer = {
                ...customer._doc,
                totalBills,
                totalSalesAmount
            }
            parsedCustomer.push(tempCustomer);
        }

        code = 200;
        response = {
            customers: parsedCustomer,
            message: `Customers fetched successfully`,
            code: 200
        };

    } catch (error) {
        console.log(error);
        response = serverError(error);
        code = 500;
    }

    res.status(code).json(response);
}

export const updateCustomer = async (req, res) => {
    let code, response;
    try {
        const { id } = req.params;
        const { customerName, phoneNumber, area, balance } = req.body;
        const result = await customer.updateOne(
            { _id: id },
            {
                $set: {
                    customerName,
                    phoneNumber,
                    area,
                    balance
                }
            }

        );
        if (result.modifiedCount > 0) {
            response = {
                message: "Customer updated successfully",
                code: 200
            };
            code = 200;
        } else {
            response = {
                message: "Somthing went wrong",
                code: 500
            }
            code = 500;
        }

    } catch (error) {
        code = 500;
        response = serverError(error);
    }
    res.status(code).json(response);
}

export const deleteCustomer = async (req, res) => {
    let code, response;

    try {
        const { id } = req.params;

        await bills.deleteMany({
            customerId: id
        });

        await voucher.deleteMany({
            customerId: id
        });

        const result = await customer.deleteOne({
            _id: id
        });

        if (result.deletedCount > 0) {
            code = 204;
            response = {};
        } else {
            code = 500;
            response = {
                message: `Something went wrong`,
                code
            }
        }
    } catch (error) {
        response = serverError(error);
        code = 500;
    }
    res.status(code).json(response)
}