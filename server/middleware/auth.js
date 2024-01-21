import { serverError } from "../consts/APIMessage.js";
import user from "../model/user.js";
import jwt from "jsonwebtoken";
import userPermission from "../model/userPermission.js";
import apis, { API_METHODS } from "../consts/apiConfig.js";

const authendicateUser = async (req, res, next) => {
  let code, response;
  authendicateUserTry: try {
    let token = req.headers.authorization;

    if (!token) {
      code = 401;
      response = {
        code: 401,
        message: `Unauthorized Access`,
      };
      res.status(code).json(response);
      break authendicateUserTry;
    }

    token = token.split(" ")[1];
    const authJson = jwt.decode(token, process.env.PRIVATEKEY);

    const user1 = await user.findOne({ _id: authJson.id });

    if (user1.email === authJson.email) {
      req.id = user1._id;
      req.email = user1.email;
      next();
    } else {
      code = 401;
      response = {
        code: 401,
        message: `Unauthorized Access`,
      };
      res.status(code).json(response);
    }
  } catch (error) {
    code = 500;
    response = serverError(error);
    res.status(code).json(response);
  }
};

export const checkPermission = async (req, res, next) => {
  let code, response;
  checkPermissionTry: try {
    const permission = await userPermission.findOne({ userId: req.id });
    console.log();
    let baseUrl = req.baseUrl.replace("/api/v1", "");
    let method = req.route.stack[0].method;
    let module = undefined;
    apis.forEach((api) => {
      if (api.path === baseUrl && api.method.includes(method)) {
        module = api.module;
        return;
      }
    });

    if (module === undefined) {
      code = 404;
      response = {
        message: "URL not configured",
        code: 404,
      };
      res.status(code).json(response);
      break checkPermissionTry;
    }

    code = 401;
    response = {
      message: `Unauthorized access`,
      code: 401,
    };


    const modulePermission = permission.permission[0].permissions.find(
      (perm) => perm.module === module
    );
    
    if (method === API_METHODS.GET && modulePermission.permission[0]) {
      next();
    } else if (method === API_METHODS.POST && modulePermission.permission[1]) {
      next();
    } else if (method === API_METHODS.PATCH && modulePermission.permission[2]) {
      next();
    } else if (
      method === API_METHODS.DELETE &&
      modulePermission.permission[3]
    ) {
      next();
    } else {
      res.status(code).json(response);
    }
  } catch (error) {
    code = 500;
    response = serverError(error);
    res.status(code).json(response);
  }
};

export default authendicateUser;
