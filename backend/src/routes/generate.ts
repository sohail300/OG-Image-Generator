import express from "express";
import { generateImage } from "../controllers/generateImage";

const router = express.Router();

router.post("/", generateImage);

export default router;
