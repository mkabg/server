import { read, write } from "../dal/fs.dal.js";

const filePath = "./db/players.txt";

// GET /players
async function handleGetPlayers(req, res) {
  try {
    const players = await read(filePath);
    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({ error: "Failed to read players file." });
  }
}

// GET /players/leaderboard
async function handleLeaderboard(req, res) {
  try {
    const players = await read(filePath);
    const sorted = players
      .filter(p => typeof p.lowestTime === "number")
      .sort((a, b) => a.lowestTime - b.lowestTime);
    res.status(200).json(sorted);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate leaderboard." });
  }
}

// POST /players/create
async function handleAddPlayer(req, res) {
  try {
    const newPlayer = req.body;
    const players = await read(filePath);
    const exists = players.find(p => p.name === newPlayer.name);
    if (exists) {
      return res.status(409).json({ error: "Player already exists." });
    }

    const newId = players.length > 0 ? Math.max(...players.map(p => p.id || 0)) + 1 : 1;
    newPlayer.id = newId;
    players.push(newPlayer);
    await write(filePath, players);
    res.status(201).json({ message: "Player added", player: newPlayer });
  } catch (err) {
    res.status(400).json({ error: "Invalid data or write error." });
  }
}

// PUT /players/update
async function handleUpdateTime(req, res) {
  try {
    const { name, time } = req.body;
    const players = await read(filePath);
    const index = players.findIndex(p => p.name === name);

    if (index === -1) {
      return res.status(404).json({ error: "Player not found" });
    }

    const current = players[index];
    if (!current.lowestTime || time < current.lowestTime) {
      players[index].lowestTime = time;
      await write(filePath, players);
      res.status(200).json({ message: "New record!", time });
    } else {
      res.status(200).json({ message: "Time not improved", previous: current.lowestTime });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid request." });
  }
}


// // DELET /players/delete
// async function handleDeletePlayer(req, res) {
//   try {
//     const { id } = req.body;
//     const players = await read(filePath);
//     const newPlayers = players.filter(p => p.id !== id);

//     if (newPlayers.length === players.length) {
//       return res.status(404).json({ error: "Player not found" });
//     }

//     await write(filePath, newPlayers);
//     res.status(200).json({ message: "Player deleted" });
//   } catch (err) {
//     res.status(400).json({ error: "Invalid request or failed to write." });
//   }
// }

export {
  handleGetPlayers,
  handleAddPlayer,
  handleUpdateTime,
  handleLeaderboard,
};
