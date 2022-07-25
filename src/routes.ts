import { Router } from "express"

import ConnectionDatabase from "./database"

const routes = Router()

const main = async () => {
  // Create database connection
  await ConnectionDatabase.getInstance()
}

main().catch(err => {
  console.log("Error to setup routes " + err)
})

export default routes