import express from "express";
import { 
    getRiddle,
    getAllRiddles, 
    addRiddle,
    addRiddles, 
    updateRiddle, 
    delRiddle } from "../ctrl/riddels-c.js";

const router = express.Router();

router.get("/:id", getRiddle)
router.get("/", getAllRiddles);
router.post("/", addRiddle);
router.post("/load-initial-riddles", addRiddles)
router.put("/:id", updateRiddle);
router.delete("/:id", delRiddle);

export default router;