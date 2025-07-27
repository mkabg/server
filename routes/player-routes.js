import express from "express";
import {
    getPlayers,
    getPlayerByUsername,
    leaderboard,
    addPlayer,
    updateTime,
} from "../ctrl/player-c.js";

const router = express.Router();

router.get("/", getPlayers);
router.put("/", updateTime);

router.get("/:username", getPlayerByUsername)
router.get("/leaderboard", leaderboard);
router.post("/", addPlayer);

export default router;