import express from "express";
import rfiCreationRoutes from "./rfiCreationRoutes.js";

const router = express.Router();

router.use("/creation", rfiCreationRoutes);

export default router;
