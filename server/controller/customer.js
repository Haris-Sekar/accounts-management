import { fieldValidationError, serverError } from "../consts/APIMessage.js";
import customer from "../model/customer.js";
import bills from "../model/bill.js";
import voucher from "../model/voucher.js";

export const addCustomer = async (req, res) => {
  let code, response;
  addCustomerTry: try {
    let errorFields = fieldValidationError(
      [`customerName`, `phoneNumber`, `area`],
      req.body
    );

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
      balance: balance ? balance : 0,
      companyId: req.companyId,
      userid: req.id
    });

    const result = await newCustomer.save();

    if (result) {
      code = 201;
      response = {
        id: result._id
      };
    }
  } catch (error) {
    if (error.code === 11000) {
      response = {
        message: `Customer with the phone number already exisit`,
        code: 409,
      };
      code = 409;
    } else {
      code = 500;
      response = serverError(error);
    }
  }

  res.status(code).json(response);
};

export const getCustomers = async (req, res) => {
  let code, response;
  try {
    const customers = await customer.find({companyId: req.companyId});
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
        if (voucher.isCheque && voucher.isChequeCredited) {
          amount = voucher.amount;
        } else if (!voucher.isCheque) {
          amount = voucher.amount;
        }
        return sum + amount;
      }, 0);
      const balance = customer.balance + totalSalesAmount - totalAmountRecived;
      customer.balance = balance;
      const tempCustomer = {
        ...customer._doc,
        totalBills,
        totalSalesAmount,
      };
      parsedCustomer.push(tempCustomer);
    }

    code = 200;
    response = {
      customers: parsedCustomer,
      message: `Customers fetched successfully`,
      code: 200,
    };
  } catch (error) {
    response = serverError(error);
    code = 500;
  }

  res.status(code).json(response);
};

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
          balance,
        },
      }
    );
    if (result.modifiedCount > 0) {
      response = {
        message: "Customer updated successfully",
        code: 200,
      };
      code = 200;
    } else {
      response = {
        message: "Somthing went wrong",
        code: 500,
      };
      code = 500;
    }
  } catch (error) {
    code = 500;
    response = serverError(error);
  }
  res.status(code).json(response);
};

export const deleteCustomer = async (req, res) => {
  let code, response;

  try {
    const { id } = req.params;

    await bills.deleteMany({
      customerId: id,
    });

    await voucher.deleteMany({
      customerId: id,
    });

    const result = await customer.deleteOne({
      _id: id,
    });

    if (result.deletedCount > 0) {
      code = 204;
      response = {};
    } else {
      code = 500;
      response = {
        message: `Something went wrong`,
        code,
      };
    }
  } catch (error) {
    response = serverError(error);
    code = 500;
  }
  res.status(code).json(response);
};

export const getDetailedCustomerDetails = async (req, res) => {
  let code, response;
  try {
    const { id } = req.params;
    const customerBills = await bills
      .find({ customerId: id })
      .sort({ billDate: 1 });
    const customerVouchers = await voucher
      .find({ customerId: id })
      .sort({ date: 1 });

    let customerTransDetails = [];

    for (let bill of customerBills) {
      customerTransDetails.push(
        constructTransactionDetails(bill.billNumber, bill.amount, bill.billDate)
      );
    }

    for (let voucher of customerVouchers) {
      customerTransDetails.push(
        constructTransactionDetails(0, 0, 0, voucher.amount, voucher.date)
      );
    }
    customerTransDetails = customerTransDetails.sort((a, b) => a.date - b.date);

    const customerDetails = await customer.findOne({ _id: id });
    const totalSalesAmount = customerBills.reduce((sum, bill) => {
      return sum + bill.amount;
    }, 0);
    const totalAmountRecived = customerVouchers.reduce((sum, voucher) => {
      let amount = 0;
      if (voucher.isCheque && voucher.isChequeCredited) {
        amount = voucher.amount;
      } else if (!voucher.isCheque) {
        amount = voucher.amount;
      }
      return sum + amount;
    }, 0);
    const balance =
      customerDetails.balance + totalSalesAmount - totalAmountRecived;
    const oldBalance = customerDetails.balance;
    customerDetails.balance = balance;
    const totalBills = customerBills.length;
    const tempCustomer = {
      ...customerDetails._doc,
      oldBalance,
      totalBills,
      totalSalesAmount,
      totalAmountRecived,
    };

    const parsedCustomer = {
      customerDetails: tempCustomer,
      customerTransDetails,
    };

    code = 200;
    response = {
      message: "Customer fetched successfully",
      customer: parsedCustomer,
      code: 200,
    };
  } catch (error) {
    response = serverError(error);
    code = 500;
  }
  res.status(code).json(response);
};

function constructTransactionDetails(
  billNumber = 0,
  billAmount = 0,
  billDate = 0,
  voucherAmount = 0,
  voucherDate = 0
) {
  return {
    billNumber,
    billAmount,
    date: billDate !== 0 ? billDate : voucherDate,
    voucherAmount,
  };
}
