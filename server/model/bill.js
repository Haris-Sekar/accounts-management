import mongoose, { Schema } from "mongoose";

const bill = new mongoose.Schema({
  billNumber: {
    type: Number,
    required: true,
  },
  billDate: {
    type: Number,
    required: true,
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "customer",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  gFileId: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    require: true,
  },
  companyId: {
    type: mongoose.Schema.ObjectId,
    ref: "comapny",
    require: true,
  },
});

const model = mongoose.model("bill", bill);

export default model;
