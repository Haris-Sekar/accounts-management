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
        ref: 'customer',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: true,
    }
});

const model = mongoose.model('bill', bill);

export default model;
