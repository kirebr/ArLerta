import "reflect-metadata"
import express from "express"
import passport from "passport"
import path from "path"

import cors from "cors"
import routes from "./routes"
import { useContainer, useExpressServer } from "routing-controllers"
import { Container } from "typedi"
import jobs from "./jobs"

import auth from "./auth/auth";
import oauth2 from "./auth/oauth2";

class App {
  public express: express.Application

  public constructor() {
    this.express = express()
    this.middlewares()
    this.routes()
    jobs();
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
    this.express.post('/oauth/token', oauth2)
    auth()
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