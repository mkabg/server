import { supabase } from "../db/playersDB.js";

/**
 * Get all players
 */
export async function getPlayers(req, res) {
  try {
    const { data, error } = await supabase
      .from("players")
      .select("*");
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error("Unexpected error in getPlayers:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get leaderboard (sorted by best_time ascending)
 */
export async function leaderboard(req, res) {
  try {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .gt("best_time", 0)                     
      .order("best_time", { ascending: true });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error("Unexpected error in leaderboard:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}



/**
 * Add a new player if not exists
 */
export async function addPlayer(req, res) {
  try {
    const { username, best_time = 0, total_time = 0 } = req.body;

    // check if player already exists
    const { data: existing, error: fetchError } = await supabase
      .from("players")
      .select("username")
      .eq("username", username);
    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }
    if (existing.length > 0) {
      return res.status(400).json({ error: "Player already exists" });
    }

    // insert new player and return the inserted row
    const { data: inserted, error: insertError } = await supabase
      .from("players")
      .insert({ username, best_time, total_time })
      .select();

    if (insertError) {
      return res.status(500).json({ error: insertError.message });
    }
    if (!inserted || inserted.length === 0) {
      return res.status(500).json({ error: "Insert did not return data" });
    }

    res.status(201).json(inserted[0]);
  } catch (err) {
    console.error("Unexpected error in addPlayer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Update player's best_time if new time is better (lower)
 */
export async function updateTime(req, res) {
  try {
    const { username, time } = req.body;

    // fetch current best_time
    const { data: player, error: fetchError } = await supabase
      .from("players")
      .select("best_time")
      .eq("username", username)
      .single();
    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    const newTime = Math.min(time, player.best_time);

    // update record and return the updated row
    const { data: updated, error: updateError } = await supabase
      .from("players")
      .update({ best_time: newTime })
      .eq("username", username)
      .select();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }
    if (!updated || updated.length === 0) {
      return res.status(404).json({ error: "Player not found or not updated" });
    }

    res.json(updated[0]);
  } catch (err) {
    console.error("Unexpected error in updateTime:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
