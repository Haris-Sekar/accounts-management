import {serverError} from "../consts/APIMessage.js";
import user from "../model/user.js";
import jwt from "jsonwebtoken";


const authendicateUser = async (req, res, next) => {
    let code, response;
    authendicateUserTry: try{

        let token = req.headers.authorization;


        if(!token) {
            code = 401;
            response = {
                code: 401,
                message: `Unauthorized Access`
            };
            res.status(code).json(response);
            break authendicateUserTry;
        }

        token = token.split(" ")[1];
        const authJson = jwt.decode(token, process.env.PRIVATEKEY);

        const user1 = await user.findOne({_id: authJson.id});

        if(user1.email === authJson.email) {
            req.id = user1._id;
            req.email = user1.email;
            next();
        } else {
            code = 401;
            response = {
                code: 401,
                message: `Unauthorized Access`
            };
            res.status(code).json(response);
        }
    } catch(error) {
        code = 500;
        response = serverError(error);
        res.status(code).json(response);
    }

}

export default authendicateUser;