import express from "express";
import { validateToken } from "../middlewares/validate.js";
import { agencyUserUccList, getRfiCategory,  getRfiItem,  getRfiLayer,  getRfiSubCategory} from "../controllers/rfiCreationController.js";
const router = express.Router()

router.get('/OrgUserUccList', validateToken, agencyUserUccList);
router.get('/rfiInspectionCategoryList', getRfiCategory);
router.get('/rfiInspectionSubCategoryList', getRfiSubCategory);
router.get('/rfiInspectionItemList', getRfiItem);
router.get('/rfiInspectionLayerList',  getRfiLayer);

export default router;