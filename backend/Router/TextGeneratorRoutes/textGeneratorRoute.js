const { contentGenerator } = require('../../API Setup Routes/contentGenerator')
import { upload } from "../middlewares/uploadMiddleware.js";
import { generateAssignmentFromPdf } from "../controllers/assignmentController.js";

const router= require('express').Router()

router.post("/generate-assignment-from-pdf", upload.single("pdf"), generateAssignmentFromPdf);
router.route('/generateText').post(contentGenerator)

module.exports=router