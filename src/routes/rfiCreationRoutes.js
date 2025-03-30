import express from "express";
import validate from "../middlewares/validate.js";
import { getRfiCategory } from "../controllers/rfiCreationController.js";
const router = express.Router()

router.get('/rfiInspectionCategoryList', getRfiCategory);

export default router;