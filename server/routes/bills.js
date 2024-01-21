import express from "express";
import auth, {checkPermission} from "../middleware/auth.js";
import { addBill, deleteBill, getBills, updateBill } from "../controller/bills.js";

const router = express.Router();

router.post('/', auth,checkPermission, addBill);
router.get('/', auth,checkPermission, getBills);
router.patch('/:id', auth, updateBill);
router.delete('/:id', auth, deleteBill);

export default router;