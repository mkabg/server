import express from "express";
import { 
    handleGet, 
    handlePost, 
    handlePut, 
    handleDelete } from "../services/riddels-services.js";

const router = express.Router();

router.get("/riddles", () => {}, handleGet);
router.post("create", handlePost);
router.put("/update", handlePut);
router.delete("/delete", handleDelete);


function riddleRoutes(req, res) {
    if (req.method.toUpperCase() === "GET" && req.url === "/riddles") return handleGet(req, res);
    if (req.method.toUpperCase() === "POST" && req.url === "/riddles/create") return handlePost(req, res);
    if (req.method.toUpperCase() === "PUT" && req.url === "/riddles/update") return handlePut(req, res);
    if (req.method.toUpperCase() === "DELETE" && req.url === "/riddles/delete") return handleDelete(req, res);
    // Fallback
    res.writeHead(404, { 'Content-Type':          'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
}

export {
    router,
    riddleRoutes
}