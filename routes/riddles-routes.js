import express from "express";
import { 
    handleGet, 
    handlePost, 
    handlePut, 
    handleDelete } from "../ctrl/riddels-services.js";

const router = express.Router();

router.get("/", handleGet);
router.post("/", handlePost);
router.put("/:id", handlePut);
router.delete("/:id", handleDelete);

export default router;