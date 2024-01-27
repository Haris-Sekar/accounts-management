import express from "express";
import * as user from "../controller/user.js";
import authendicateUser, { checkPermission } from "../middleware/auth.js";

const router = express.Router();

router.post('/login', user.login);
router.post(`/signup`, user.signup);
router.post('/addUser', authendicateUser, checkPermission, user.signup);
router.get(`/`, user.getUserDetails);
router.get('/company/isActive',authendicateUser, user.isCompanyActive);
router.get('/company', authendicateUser, checkPermission, user.getCompanyUsers)

export default router;