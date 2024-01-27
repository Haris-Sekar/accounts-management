import express, { urlencoded } from "express";
import auth, {checkPermission} from "../middleware/auth.js";
import { addBill, deleteBill, getBills, updateBill } from "../controller/bills.js";
import multer from "multer";

var upload = multer({dest:'./upload/'});

const router = express.Router();
router.post('/withoutpdf', auth, checkPermission, addBill);
router.post('/', auth,checkPermission,upload.single("billPdf"), addBill);
router.get('/', auth,checkPermission, getBills);
router.patch('/:id', auth, updateBill);
router.delete('/:id', auth, deleteBill);

export default router;