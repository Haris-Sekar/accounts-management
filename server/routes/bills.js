import express from "express";
import auth, {checkPermission} from "../middleware/auth.js";
import { addBill, deleteBill, getBills, updateBill } from "../controller/bills.js";
import multer from "multer";
import { certificatemanager } from "googleapis/build/src/apis/certificatemanager/index.js";

var upload = multer({dest:'./upload/'});

const router = express.Router();

router.post('/', auth,checkPermission,upload.single("billPdf"), addBill);
router.get('/', auth,checkPermission, getBills);
router.patch('/:id', auth, upload.single("billPdf"), updateBill);
router.delete('/:id', auth, deleteBill);

export default router;