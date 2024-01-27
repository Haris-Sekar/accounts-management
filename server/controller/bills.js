import { fieldValidationError, serverError } from "../consts/APIMessage.js";
import Bill from "../model/bill.js";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

const KEY_FILE_PATH = path.join("./pk.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: SCOPES,
});

export const addBill = async (req, res) => {
  let code, response;
  addBilTry: try {
    const { billNo, billDate, customerId, amount } = req.body;
    const { file } = req;
    let fileId = "";  
    if (file) {
      const { data } = await google
        .drive({ version: "v3", auth: auth })
        .files.create({
          media: {
            mimeType: file.mimeType,
            body: fs.createReadStream(file.path),
          },
          requestBody: {
            name: file.originalname,
            parents: ["1CkUNlZn17Aqa-ziWQMNlvlTeQz6DicJw"],
          },
          fields: "id,name",
        });
      fileId = data.id;
      console.log(`file uploaded successfully ${JSON.stringify(data)}`);
    }

    const errorFields = fieldValidationError(
      [`billNo`, "billDate", "customerId", "amount"],
      req.body
    );

    if (errorFields !== undefined && errorFields.length > 0) {
      code = 403;
      response = errorFields;
      break addBilTry;
    }

    const newBill = new Bill({
      billNumber: billNo,
      billDate: billDate,
      customerId: customerId,
      amount: amount,
      gFileId: fileId,
      userId: req.id,
    });

    const result = await newBill.save();

    if (result) {
      code = 201;
      response = {
        message: `New Bill has been added`,
        code: 201,
        bill: newBill
      };
    }
  } catch (error) {
    code = 500;
    response = serverError(error);
  }
  res.status(code).json(response);
};

export const getBills = async (req, res) => {
  let code, response;
  try {
    let bills = await Bill.find({ userId: req.id }).populate({
      path: "customerId",
      select: `customerName`,
    });

    let parsedBills = [];

    for (let index in bills) {
      const bill = bills[index];
      let tempBill = {
        ...bill._doc,
        customerName: bill.customerId?.customerName,
      };
      if(bill.gFileId) {
        const gData = await google.drive({ version: "v3", auth: auth }).files.get({fileId: bill.gFileId, alt: 'media'});
        const parsedGData = {
            url: gData.config.url,
            token: gData.config.headers.Authorization
        }
        tempBill.gData = parsedGData;
      }      
      parsedBills.push(tempBill);
    }

    code = 200;
    response = {
      bills: parsedBills,
      message: `Bills fetched successfully`,
      code: 200,
    };
  } catch (error) {
    response = serverError(error);
    code = 500;
  }

  res.status(code).json(response);
};

export const updateBill = async (req, res) => {
  let code, response;
  try {
    const { id } = req.params;
    const { billNo, billDate, customerId, amount } = req.body;
    const result = await Bill.updateOne(
      { _id: id },
      {
        $set: {
          customerId,
          billNo,
          billDate,
          amount,
        },
      }
    );
    if (result.modifiedCount > 0) {
      response = {
        message: "Bill updated successfully",
        code: 200,
      };
      code = 200;
    } else {
      response = {
        message: "Somthing went wrong",
        code: 500,
      };
      code = 500;
    }
  } catch (error) {
    code = 500;
    response = serverError(error);
  }
  res.status(code).json(response);
};

export const deleteBill = async (req, res) => {
  let code, response;

  try {
    const { id } = req.params;

    const result = await Bill.deleteOne({
      _id: id,
    });

    if (result.deletedCount > 0) {
      code = 204;
      response = {};
    } else {
      code = 500;
      response = {
        message: `Something went wrong`,
        code,
      };
    }
  } catch (error) {
    response = serverError(error);
    code = 500;
  }
  res.status(code).json(response);
};
