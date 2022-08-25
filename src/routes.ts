import { Router } from "express"

import AppDataSource from "./database"

const routes = Router()

const main = async () => {
  // Create database connection
  AppDataSource.initialize()
    .then(() => {
      console.log('Database initialized.');
    })
    .catch((error) => console.log(error))
  // Create whatsapp integration
}

main().catch(err => {
  console.log("Error to setup routes " + err)
})

export default routes