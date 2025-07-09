import {
    handleGetPlayers,
    handleAddPlayer,
    handleUpdateTime,
    handleLeaderboard
} from "../services/players-services.js";

export default function playerRoutes(req, res) {
    if (req.method.toUpperCase() === "GET" && req.url === "/users") return handleGetPlayers(req, res);
    
    if (req.method.toUpperCase() === "POST" && req.url === "/create/user") return handleAddPlayer(req, res);
    
    if (req.method.toUpperCase === "PUT" && req.url === "/update/user") return handleUpdateTime(req, res);
    
    if (req.method.toUpperCase() === "DELETE" && req.url === "/delete/user") return handleLeaderboard(req, res);
    
    // Fallback
    res.writeHead(404, { 'Content-Type':          'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
}