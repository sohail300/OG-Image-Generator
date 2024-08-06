import express, { Request, Response } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/generate";

dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  console.log("Healthy Server!");
  return res.status(200).json({ msg: "Healthy Server!" });
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.post("/test", upload.single("photo"), router);

app.listen(3000, () => {
  console.log("Server listenting on port 3000");
});
