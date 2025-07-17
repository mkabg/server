import express from "express";
import logger from "./middlewares/logger.js";
import configRoutes from "./routes/configR.js";

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(logger);

configRoutes(app);

app.listen(PORT, () => console.log("server is running on port:", PORT))
