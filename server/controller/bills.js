import { fieldValidationError, serverError } from "../consts/APIMessage.js";
import Bill from "../model/bill.js";


export const addBill = async (req, res) => {

    let code, response;
    addBilTry: try {

        const { billNo, billDate, customerId, amount } = req.body;


        const errorFields = fieldValidationError([`billNo`, 'billDate', 'customerId', 'amount'], req.body);

        if (errorFields !== undefined && errorFields.length > 0) {
            code = 403;
            response = errorFields;
            break addBilTry;
        }

        const newBill = new Bill({
            billNumber: billNo,
            billDate: billDate,
            customerId: customerId,
            amount: amount,
            userId: req.id
        });

        const result = await newBill.save();

        if (result) {
            code = 201;
            response = {
                message: `New Bill has been added`,
                code: 201
            }
        }
    } catch (error) {
        code = 500;
        response = serverError(error);
    }
    res.status(code).json(response);
}

export const getBills = async (req, res) => {
    let code, response;
    try {

        let bills = await Bill.find({userId: req.id}).populate({ path: 'customerId', select: `customerName` });

        let parsedBills = [];

        for(let index in bills) {
            const bill = bills[index];
            console.log(bill);
            let tempBill = {
                ...bill._doc,
                customerName: bill.customerId?.customerName
            }
            parsedBills.push(tempBill);
        }

        code = 200;
        response = {
            bills: parsedBills,
            message: `Bills fetched successfully`,
            code: 200
        };

    } catch (error) {
        response = serverError(error);
        code = 500;
    }

    res.status(code).json(response);
}

export const updateBill = async (req, res) => {
    let code, response;
    try {
        const { id } = req.params;
        const { billNo, billDate, customerId, amount } = req.body;
        const result = await Bill.updateOne(
            { _id: id },
            {
                $set: {
                    customerId,
                    billNo,
                    billDate,
                    amount
                }
            }

        );
        if (result.modifiedCount > 0) {
            response = {
                message: "Bill updated successfully",
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

export const deleteBill = async (req, res) => {
    let code, response;

    try {
        const { id } = req.params;

        const result = await Bill.deleteOne({
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