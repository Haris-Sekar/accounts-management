import mongoose, { Schema } from "mongoose";

const company = new mongoose.Schema({
    name: {
        type: String,
    }, 
    userId: {
        type: Schema.ObjectId
    }, 
    isActive: {
        type: Boolean
    }
});

const model = mongoose.model('company', company);

export default model;