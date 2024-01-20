import mongoose, { Schema } from "mongoose";

const bill = new mongoose.Schema({
    billNumber: {
        type: Number,
        require: true,
    },
    billDate: {
        type: Number,
        require: true
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref:'customer',
    },
    amount: {
        type: Number,
        require: true
    }
});

const model = mongoose.model('bill', bill);

export default model;