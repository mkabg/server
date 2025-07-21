import express from "express";
import {
    getPlayers,
    leaderboard,
    addPlayer,
    updateTime,
} from "../ctrl/player-c.js";

const router = express.Router();

router.get("/", getPlayers);
router.get("/leaderboard", leaderboard);
router.post("/", addPlayer);
router.put("/", updateTime);

export default router;