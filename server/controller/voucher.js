import { fieldValidationError, serverError } from "../consts/APIMessage.js";
import voucher from "../model/voucher.js";
export const addVoucher = async (req, res) => {
    let code, response;
    addVoucherTry: try {

        const { customerId, amount, date, bankName, isCheque, chequeNumber, chequeDate, isChequeCredited } = req.body;

        const errorFields = fieldValidationError(['customerId', 'amount', 'date'], req.body);

        if (errorFields !== undefined) {
            response = errorFields;
            code = 403;
            break addVoucherTry;
        }

        const newVoucher = new voucher({
            customerId,
            amount,
            date,
            bankName,
            isCheque: isCheque ? true : false,
            chequeDate: isCheque ? chequeDate : undefined,
            chequeNumber: isCheque ? chequeNumber : undefined,
            isChequeCredited: isChequeCredited ? isChequeCredited : false,
            userId: req.id
        });

        const result = await newVoucher.save();

        if (result) {
            code = 201;
            response = {
                message: `Voucher has been added`,
                code: code
            };
        } else {
            code = 500;
            response = serverError(null);
        }

    } catch (error) {
        code = 500;
        response = serverError(error);
    }
    res.status(code).json(response);
}


export const getVouchers = async (req, res) => {
    let code, response;

    try {
        const vouchers = await voucher.find({userId: req.id}).populate({ path: 'customerId', select: `customerName` });

        let parsedVouchers = [];

        for(let index in vouchers) {
            const voucher = vouchers[index];
            let tempVoucher = {
                ...voucher._doc,
                customerName: voucher.customerId?.customerName
            };
            parsedVouchers.push(tempVoucher);
        }

        if (vouchers) {
            response = {
                message: `Vouchers fetched successfully`,
                vouchers: parsedVouchers,
                code: 200
            }
            code = 200;
        }
    } catch (error) {
        code = 500;
        response = serverError(error);
    }
    res.status(code).json(response);
}

export const updateVoucher = async (req, res) => {
    let code, response;
    try {
        const { id } = req.params;
        const { amount, date, isCheque,bankName, chequeNumber, chequeDate, isChequeCredited } = req.body;

        const result = await voucher.updateOne(
            { _id: id },
            {
                $set: {
                    amount: amount,
                    date: date,
                    isCheque: isCheque,
                    chequeDate: chequeDate,
                    chequeNumber: chequeNumber,
                    isChequeCredited: isChequeCredited,
                    bankName: bankName
                }
            }
        );


        if (result.modifiedCount > 0) {
            response = {
                message: "Voucher updated successfully",
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


export const deleteVoucher = async (req, res) => {
    let code, response;

    try {
        const { id } = req.params;

        const result = await voucher.deleteOne({
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