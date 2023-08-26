import express, { Router } from "express";
import { uploadImage } from "../controllers/imageController.js";

const imageRouter: Router = express.Router();

imageRouter.post("/upload-image/:sessionCode", uploadImage);

export default imageRouter;
