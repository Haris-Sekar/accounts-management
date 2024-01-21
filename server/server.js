import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import morgan from "morgan";
import mongoose from "mongoose";
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().array());
app.use(morgan("combined"));
dotenv.config();

import user from "./routes/user.js";
import customer from "./routes/customer.js";
import bill from "./routes/bills.js";
import voucher from "./routes/voucher.js";
import userPermission from "./model/userPermission.js";
import { USER_TYPE } from "./consts/const.js";
import { DEFAULT_PERMISSION } from "./consts/permission.js";

app.use(`/api/v1/user`, user);
app.use(`/api/v1/customers`, customer);
app.use(`/api/v1/bills`, bill);
app.use(`/api/v1/voucher`, voucher);

// app.get('/', async(req, res) => {

//   await userPermission.deleteOne({_id: "65ac331a06fbf37699b88741"});

//   const perm = new userPermission({
//     userId: "65ab780c2b6ad996b6cda2fe",
//     userType: USER_TYPE.ADMIN,
//     permission: DEFAULT_PERMISSION[0].permissions
//   });
//   ;

//   res.status(200).json(await perm.save())
// });


const port = process.env.PORT || 5001;
mongoose
  .connect(process.env.DB_URL)
  .then(() =>
    app.listen(port, () => console.log(`Serve running on port ${port}`))
  )
  .catch((error) => console.log(error));