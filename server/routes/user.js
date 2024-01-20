import express from "express";
import * as user from "../controller/user.js";

const router = express.Router();

router.post('/login', user.login);
router.post(`/signup`, user.signup);
router.get(`/`, user.getUserDetails);

export default router;