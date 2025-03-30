import express from "express";
//import uccRoutes from "../routes/uccRoutes.js";
import rfiCreationRoutes from "./rfiCreationRoutes.js";

const router = express.Router();

router.use("/ucc", rfiCreationRoutes);

export default router;
