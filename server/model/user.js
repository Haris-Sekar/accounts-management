import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  companyId: {
    type: mongoose.Schema.ObjectId,
  },
  userType: {
    type: Number,
    required: true,
  },
});

user.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      userType: this.userType,
    },
    process.env.PRIVATEKEY
  );
};
const model = mongoose.model("user", user);
export default model;
