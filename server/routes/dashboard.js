import express from "express";
import authendicateUser, { checkPermission } from "../middleware/auth.js";
import { getDashboardDetails } from "../controller/dashboard.js";

const router = express.Router();

router.get('/', authendicateUser, checkPermission, getDashboardDetails);

export default router;