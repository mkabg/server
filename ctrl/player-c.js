import { json } from "express";
import { supabase } from "../db/playersDB.js";
import {getPlayerByUsernameFromDB} from "../utils/function.js"

/**
 * Get all players from the database
 */
export async function getPlayers(req, res) {
  try {
    // Fetch all rows from 'players' table
    const { data, error } = await supabase
      .from("players")
      .select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data); // Return list of players
  } catch (err) {
    console.error("Unexpected error in getPlayers:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get a single player by username.
 * Returns the player object if found, or null if not found.
 */
export async function getPlayerByUsername(req, res) {
  const { username } = req.params;

  try {
    const player = await getPlayerByUsernameFromDB(username);
    return res.status(200).json({ data: player });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


/**
 * Get the leaderboard: all players with best_time > 0, sorted ascending
 */
export async function leaderboard(req, res) {
  try {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .gt("best_time", 0) // Only players who finished at least one game
      .order("best_time", { ascending: true }); // Sort by best time (lowest first)

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data); // Return sorted leaderboard
  } catch (err) {
    console.error("Unexpected error in leaderboard:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Add a new player, only if username does not already exist
 */
export async function addPlayer(req, res) {
  try {
    const { username, best_time = 0 } = req.body;
    console.log("Incoming request body:", req.body);

    const existingPlayer = await getPlayerByUsernameFromDB(username);
    if (existingPlayer) {
      return res.status(400).json({ error: "Player already exists" });
    }

    const { data, error } = await supabase
      .from("players")
      .insert([{ username, best_time }])
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("Supabase insert error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ data });
  } catch (err) {
    console.error("Unexpected error in addPlayer:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}


/**
 * Update a player's best_time only if the new time is better (lower)
 */
export async function updateTime(req, res) {
  console.log("BODY:", req.body);

  try {
    const { username, time } = req.body;

    // Fetch current best_time for the player
    const { data: player, error: fetchError } = await supabase
      .from("players")
      .select("best_time")
      .eq("username", username)
      .single(); // Require exact match

    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    console.log("TYPE CHECK:", typeof time, typeof player.best_time);

    console.log("Previous best:", player.best_time, "New time:", time);
    // Compare new time with current best and choose the better one
    const newTime = Math.min(time, player.best_time);
    console.log("Updating best_time to:", newTime);


    // Update player's best_time in the database
    const { data: updated, error: updateError } = await supabase
      .from("players")
      .update({ best_time: newTime })
      .eq("username", username)
      .select(); // Return updated row

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    if (!updated || updated.length === 0) {
      return res.status(404).json({ error: "Player not found or not updated" });
    }

    res.json(updated[0]); // Return updated player
  } catch (err) {
    console.error("Unexpected error in updateTime:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
