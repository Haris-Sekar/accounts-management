import mongoose from "mongoose";

const customer = new mongoose.Schema({
  customerName: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: Number,
    unique: true,
    require: true,
  },
  area: {
    type: String,
    require: true,
  },
  balance: {
    type: Number,
    require: true,
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
const model = mongoose.model("customer", customer);
export default model;
