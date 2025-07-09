import { read, write } from "../dal/fs.dal.js";

const filePath = "../db/players.txt";

// GET /players
async function handleGetPlayers(req, res) {
    try {
        const players = await read(filePath);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(players));
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to read players file." }));
    }
}

// POST /players/addPlayer
async function handleAddPlayer(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const newPlayer = JSON.parse(body);
            const players = await read(filePath);
            const exists = players.find(p => p.name === newPlayer.name);
            if (exists) {
                res.writeHead(409, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Player already exists." }));
                return;
            }
            const newId = players.length > 0 ? Math.max(...players.map(p => p.id || 0)) + 1 : 1;
            newPlayer.id = newId;
            players.push(newPlayer);
            await write(filePath, players);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Player added", player: newPlayer }));
        } catch (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid data or write error." }));
        }
    });
}

// PUT /players/updateTime
async function handleUpdateTime(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const { name, time } = JSON.parse(body);
            const players = await read(filePath);
            const index = players.findIndex(p => p.name === name);
            if (index === -1) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Player not found" }));
                return;
            }

            const current = players[index];
            if (!current.lowestTime || time < current.lowestTime) {
                players[index].lowestTime = time;
                await write(filePath, players);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "New record!", time }));
            } else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Time not improved", previous: current.lowestTime }));
            }
        } catch (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid request." }));
        }
    });
}

// GET /players/leaderboard
async function handleLeaderboard(req, res) {
    try {
        const players = await read(filePath);
        const sorted = players
            .filter(p => typeof p.lowestTime === "number")
            .sort((a, b) => a.lowestTime - b.lowestTime);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(sorted));
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to generate leaderboard." }));
    }
}

export {
    handleGetPlayers,
    handleAddPlayer,
    handleUpdateTime,
    handleLeaderboard
};
