import express from "express";
import logger from "./middlewares/logger.js";
import configRoutes from "./routes/configR.js";
import cors from "cors";
import { config } from "dotenv";
config();

const URL = process.env.URL;
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.URL || "*" }));
app.use(logger);

configRoutes(app);

app.listen(PORT, () => console.log("server is running on:", URL, PORT))
