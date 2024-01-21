import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userPermission = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    require: true,
    ref: 'user'
  },
  userType: {
    type: Number,
    require: true
  },
  permission: {
    type: Array,
    require: true
  }
});
 
const model = mongoose.model('userPermission', userPermission);
export default model;

