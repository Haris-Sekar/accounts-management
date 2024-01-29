import mongoose, { Schema } from "mongoose";

const voucher = new mongoose.Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref:'customer',
        require: true
    },
    amount: {
        type: Number,
        require: true,
    },
    date: {
        type: Number,
        require: true,
    },
    isCheque: {
        type: Boolean,
    },
    bankName: {
        type: String,
    },
    chequeNumber: {
        type: Number,
    },
    chequeDate: {
        type: Number,
    },
    isChequeCredited: {
        type: Boolean
    },
    bankName: {
        type: String
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        require: true
    },
    companyId: {
      type: mongoose.Schema.ObjectId,
      ref: 'comapny',
      require: true
    }
});

const model = mongoose.model('voucher', voucher);

export default model;