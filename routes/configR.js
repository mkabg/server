import riddleRoutes from "./riddles-routes.js";
import playerRoutes from "./player-routes.js";

export default function configRoutes(app) {
    app.use("/riddles", riddleRoutes)
    app.use("/players", playerRoutes)
    app.use((req, res) => {
        res.status(404).json({msg: "Route not found."});
    })
}