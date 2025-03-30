import express from "express";
import { validateToken } from "../middlewares/validate.js";
import { agencyUserUccList, getRfiCategory } from "../controllers/rfiCreationController.js";
const router = express.Router()

router.get('/rfiInspectionCategoryList', getRfiCategory);
router.get('/OrgUserUccList', validateToken, agencyUserUccList);

export default router;