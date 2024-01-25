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
dotenv.config();

import user from "./routes/user.js";
import customer from "./routes/customer.js";
import bill from "./routes/bills.js";
import voucher from "./routes/voucher.js";
import dashboard from "./routes/dashboard.js";
import { createReadStream } from "fs";
import { google } from "googleapis";
import process from "process";
import path from "path";

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

async function authorize() {
  const jwtClient = new google.auth.JWT(
    pkey.client_email,
    null,
    pkey.private_key,
    SCOPES
  )
  await jwtClient.authorize();
  return jwtClient;
}

async function uploadFile(authClient) {
  const drive = google.drive({ version: 'v3', auth: authClient });

    const file = await drive.files.create({
      media: {
        body: createReadStream('./pk.json')
      },
      fields: 'id',
      requestBody: {
        name: path.basename('./pk.json'),
        parents: ["1CkUNlZn17Aqa-ziWQMNlvlTeQz6DicJw"]
      },
    });
    console.log(file.data.id)
}

app.use(`/api/v1/user`, user);
app.use(`/api/v1/customers`, customer);
app.use(`/api/v1/bills`, bill);
app.use(`/api/v1/voucher`, voucher);
app.use(`/api/v1/dashboard`, dashboard);
app.use('/', async (req, res) => {
  authorize().then(uploadFile).catch(console.error)
})

const port = process.env.PORT || 5001;
mongoose
  .connect(process.env.DB_URL)
  .then(() =>
    app.listen(port, () => console.log(`Serve running on port ${port}`))
  )
  .catch((error) => console.log(error));