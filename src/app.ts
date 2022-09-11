import "reflect-metadata"
import express from "express"
import passport from "passport"
import path from "path"

import cors from "cors"
import routes from "./routes"
import authInit from "./auth/auth"
import { useContainer, useExpressServer } from "routing-controllers"
import { Container } from "typedi"
import Bull from "./parallel-jobs"

class App {
  public express: express.Application

  public constructor() {
    this.express = express()
    this.middlewares()
    this.routes()
    Bull();
  }

  private middlewares(): void {
    const corsOptions = {
      origin: [
        "http://url-dofrontend.com.br"
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
      allowedHeaders: "*",
    }

    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: true }))
    this.express.use(cors(corsOptions))
    this.express.use(passport.initialize())
    authInit()
  }

  private routes(): void {
    this.express.use(routes)
    useContainer(Container)
    useExpressServer(this.express, {
      cors: true,
      classTransformer: true,
      controllers: [path.join(__dirname + "**/controllers/*Controller.ts")],
    })
  }
}

export default new App().express