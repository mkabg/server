import express from "express";
import {
    handleGetPlayers,
    handleLeaderboard,
    handleAddPlayer,
    handleUpdateTime,
} from "../services/player-services.js";

const router = express.Router();

router.get("/", handleGetPlayers);
router.get("/leaderboard", handleLeaderboard);
router.post("/create", handleAddPlayer);
router.put("/update", handleUpdateTime);
router.delete("/delete", handleDeletePlayer);

export default router;