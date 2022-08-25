import { Router } from "express"

import AṕpdDataSource from "./database"

const routes = Router()

const main = async () => {
  // Create database connection
  AṕpdDataSource.initialize()
    .then(() => {
      console.log('Database initialized.');
    })
    .catch((error) => console.log(error))
}

main().catch(err => {
  console.log("Error to setup routes " + err)
})

export default routes