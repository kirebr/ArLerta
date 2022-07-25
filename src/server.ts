import { config as envConfig } from "dotenv"

envConfig()
import app from "./app"

const SERVER_PORT = parseInt(process?.env?.SERVER_PORT || '8080');

app.listen(SERVER_PORT, () => {
  console.log("Server Running on port: " + SERVER_PORT)
})