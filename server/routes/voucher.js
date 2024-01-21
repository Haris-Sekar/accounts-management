import express from "express";
import auth from "../middleware/auth.js"
import { addVoucher, deleteVoucher, getVouchers, updateVoucher } from "../controller/voucher.js";


const router = express.Router();

router.post('/', auth, addVoucher);
router.get('/', auth, getVouchers);
router.patch('/:id', auth, updateVoucher);
router.delete('/:id', auth, deleteVoucher);

export default router;