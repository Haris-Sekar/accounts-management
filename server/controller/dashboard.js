import { serverError } from "../consts/APIMessage.js";
import billModel from "../model/bill.js";
import voucherModel from "../model/voucher.js";
import customerModel from "../model/customer.js";

export const getDashboardDetails = async (req, res) => {
  let code, response;
  getDashboardDetailsTry: try {
    const allBills = await billModel.find({
      userId: req.id,
    });

    const totalBillAmount = allBills.reduce(
      (acc, bill) => acc + bill.amount,
      0
    );

    const allVouchers = await voucherModel.find({
      userId: req.id,
    });

    const allCustomers = await customerModel.find({
      userId: req.id,
    });

    const oldBalance = allCustomers.reduce(
      (acc, customer) => acc + customer.balance,
      0
    );

    const totalVoucherAmount = allVouchers.reduce(
      (acc, voucher) => acc + voucher.amount,
      0
    );

    const totalOutstandingAmount =
      totalBillAmount + oldBalance - totalVoucherAmount;
    const topCustomers = await billModel.aggregate([
      {
        $group: {
          _id: "$customerId",
          totalBillAmount: { $sum: "$amount" },
          billCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      {
        $unwind: "$customerInfo",
      },
      {
        $lookup: {
          from: "vouchers",
          localField: "_id",
          foreignField: "customerId",
          as: "voucherInfo",
        },
      },
      {
        $unwind: "$voucherInfo",
      },
      {
        $group: {
          _id: "$_id",
          customerName: { $first: "$customerInfo.customerName" },
          phoneNumber: { $first: "$customerInfo.phoneNumber" },
          area: { $first: "$customerInfo.area" },
          balance: { $first: "$customerInfo.balance" },
          totalBillAmount: { $first: "$totalBillAmount" },
          billCount: { $first: "$billCount" },
          totalVoucherAmount: { $sum: "$voucherInfo.amount" }, // Calculate total voucher amount
        },
      },
      {
        $project: {
          customerId: "$_id",
          customerName: 1,
          phoneNumber: 1,
          area: 1,
          balance: 1,
          totalBillAmount: 1,
          billCount: 1,
          totalVoucherAmount: 1,
        },
      },
      {
        $sort: {
          totalBillAmount: -1,
          billCount: -1,
        },
      },
      {
        $limit: 20,
      },
    ]);
    console.log("Top Customers Result:", topCustomers);
    code = 200;
    response = {
      dashboardDetails: {
        topCustomers,
        totalCustomers: allCustomers.length,
        totalBillAmount,
        totalVoucherAmount,
        totalOutstandingAmount,
      },
      code: 200,
      message: "Dashboard details fetched successfully",
    };
  } catch (error) {
    code = 500;
    response = serverError(error);
  }
  res.status(code).json(response);
};
