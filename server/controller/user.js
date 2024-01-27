import bcrypt from "bcrypt";
import user from "../model/user.js";
import { fieldValidationError, serverError } from "../consts/APIMessage.js";
import userPermissions from "../model/userPermission.js";
import { DEFAULT_PERMISSION } from "../consts/permission.js";
import { USER_TYPE } from "../consts/const.js";
import company from "../model/company.js";
export const login = async (req, res) => {
  let response, code;
  loginTry: try {
    const { email } = req.body;
    const result = await user.findOne({ email: email });
    if (!result) {
      response = {
        message: "Invalid Credentials",
        code: 401,
      };
      code = 401;
      break loginTry;
    }
    const resultOfSalt = await bcrypt.compare(
      req.body.password,
      result.password
    );
    if (!resultOfSalt) {
      response = {
        message: "Invalid Credentials",
        code: 500,
      };
      code = 401;
      break loginTry;
    }

    const token = result.generateToken();
    const companyDetails = await company.findOne({ userId: result._id });
    res.cookie("jwt_token", token, { maxAge: 604800000 });
    response = {
      message: "login success",
      code: 200,
      jwt_token: token,
      user_details: result,
      company_details: companyDetails,
    };
    code = 200;
  } catch (error) {
    response = serverError(error);
    code = 500;
  }
  res.status(code).json(response);
};

export const signup = async (req, res) => {
  let response, code;
  signupTry: try {
    const {
      name,
      email,
      password,
      confirmPassword,
      userType,
      companyName,
      ownerDa,
    } = req.body;

    const isAddUser = req.url.includes("addUser");
    console.log(isAddUser);
    const errorFields = fieldValidationError(
      [`name`, `email`, `password`, `confirmPassword`, `userType`],
      req.body
    );
    if (errorFields !== null && errorFields !== undefined) {
      response = errorFields;
      code = 403;
      break signupTry;
    }

    if (password.localeCompare(confirmPassword)) {
      response = {
        message: "Password doesn't match",
        code: 422,
      };
      code = 422;
      break signupTry;
    }
    if (
      Number(userType) === USER_TYPE.ADMIN &&
      !ownerDa &&
      ownerDa !== "#_06123^%"
    ) {
      code = 401;
      response = {
        code: 401,
        message: `Unauthorized Access`,
      };
      break signupTry;
    }

    const newUser = new user({
      name,
      email,
      password,
      userType,
    });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    const alreadyAUserWithEmail = await user.findOne({ email: req.body.email });
    if (alreadyAUserWithEmail) {
      response = {
        message: "User already exits with the same Email",
        code: 409,
      };
      code = 409;
      break signupTry;
    }
    if (isAddUser) {
      newUser.companyId = req.companyId;
    }
    const result = await newUser.save();

    if (result) {
      const newCompany = new company({
        name: companyName,
        isActive: true,
        userId: result._id,
      });

      await newCompany.save();

      const userPermission = new userPermissions({
        userId: result._id,
        userType: result.userType,
        permission: DEFAULT_PERMISSION.find(
          (perm) => perm.userType === result.userType
        ),
      });
      await userPermission.save();
      response = {
        message: "User created!",
        status: 200,
      };
      code = 200;
    }
  } catch (error) {
    response = serverError(error);
    code = 500;
  }
  res.status(code).json(response);
};

export const getUserDetails = async (req, res) => {
  let code, response;

  getUserDetails: try {
    const { id } = req.query;
    const fieldError = fieldValidationError([`id`], req.query);
    if (fieldError !== null) {
      response = fieldError;
      code = 403;
      break getUserDetails;
    }

    const userDetails = user.findOne({ _id: id });
    const permissions = userPermissions.findOne({ userId: id });
    response = {
      userDetails,
      permissions,
      message: "user details fetched successfully",
      code: 200,
    };
    code = 200;
  } catch (error) {
    response = serverError(error);
    code = 500;
  }
  res.status(code).json(response);
};

export const isCompanyActive = async (req, res) => {
  let code, response;
  try {
    code = 200;
    const companyDetails = await company.findOne({ userId: req.id });
    response = {
      code: 200,
      isActive: companyDetails.isActive,
    };
  } catch (error) {
    code = 500;
    response = serverError(error);
  }
  res.status(code).json(response);
};

export const getCompanyUsers = async (req, res) => {
  let code, response;
  try {
    const users = await user.find({ companyId: req.companyId });
    const parsedUsers = [];

    for(let index in users) {
      const user = users[index];
      const permissions = await userPermissions.findOne({userId: user._id});

      const tempUser = {
        ...user._doc,
        permissions
      }
      parsedUsers.push(tempUser)
    } 
    code = 200;
    response = {
      code,
      message: "Company Users fetched successfully",
      users: parsedUsers
    }
  } catch (error) {
    code = 500;
    response = serverError(error);
  }
  res.status(code).json(response);
};
