import mongoose from "mongoose";

const customer = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true
  }
}); 
const model = mongoose.model('customer', customer);
export default model;

