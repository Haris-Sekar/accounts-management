import bcrypt from "bcrypt";
import user from "../model/user.js";
import { fieldValidationError, serverError } from "../consts/APIMessage.js";
import { USER_TYPE } from "../consts/const.js";
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
        res.cookie("jwt_token", token, { maxAge: 604800000 });
        response = {
            message: "login success",
            code: 200,
            jwt_token: token,
            user_details: result
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
        const { name, email, password, confirmPassword } = req.body;
        const errorFields = fieldValidationError([`name`, `email`, `password`, `confirmPassword`], req.body);
        if(errorFields !== null && errorFields !== undefined) {
            response = errorFields;
            code = 403;
            break signupTry;
        }
        
        const newUser = new user({
            name,
            email,
            password,
            userType: USER_TYPE.ADMIN,
        });
        if (password.localeCompare(confirmPassword)) {
            response = {
                message: "Password doesn't match",
                code: 422
            }
            code = 422;
            break signupTry;
        }
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);
        const alreadyAUserWithEmail = await user.findOne({ email: req.body.email });
        if (alreadyAUserWithEmail) {
            response = {
                message: "User already exits with the same Email",
                code: 409
            }
            code = 409;
            break signupTry;
        }
        const result = await newUser.save();
        if (result) {
            response = {
                message: "User created!",
                status: 200,
            }
            code = 200;
        }
    } catch (error) {
        response = serverError(error);
        code = 500;
    }
    res.status(code).json(response);
}

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

        response = {
            userDetails,
            message: "user details fetched successfully",
            code: 200
        };
        code = 200;

    } catch (error) {
        response = serverError(error);
        code = 500;
    }
    res.status(code).json(response);
}