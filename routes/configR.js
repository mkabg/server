import riddleRoutes from "./riddles-routes";
import playerRoutes from "./player-routes";

export default function configRoutes(app) {
    app.use("/riddles", riddleRoutes)
    app.use("/players", playerRoutes)
    app.use((req, res)=>{
        res.status(404).json({msg: "Route not found."});
    })
}