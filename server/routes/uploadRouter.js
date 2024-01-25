import express from "express";


const router = express.Router();
 

const storage = multer.diskStorage({ destination: os.tmpdir(), filename: (req, file, callback) => callback(null, `${file.originalname}`) });

const upload = multer({ storage: storage });

router.post("/uploadToDrive", upload.single("drive_file"), getFileDetails);

module.exports = router;