import http from "http";
import express from "express";
import logger from "";
import configRoutes from "./routes/configR.js";
import { handleRiddleRoutes } from "./routes/riddles-routes.js";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(logger);

configRoutes(app);

const server = http.createServer(async (req, res) => {
    if (req.url.startsWith("/riddles")) {
        handleRiddleRoutes(req, res);
    } else if (req.url.startsWith("/players")) {
        handlePlayerRoutes(req, res);
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Route not found" }));
    }
})

server.listen(PORT, () => {
    console.log("server is running on port:", PORT);
})
