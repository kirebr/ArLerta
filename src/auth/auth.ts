import passport from "passport"
import Client from "../models/Client"
import AccessToken from "../models/AccessToken"
import User from "../models/User"

import { Strategy as BearerStrategy } from "passport-http-bearer"
import { Strategy as ClientPasswordStrategy } from "passport-oauth2-client-password"
import { BasicStrategy } from "passport-http"

export default function init() {
  const { TOKEN_LIFE } = process.env

  passport.use(
    new BasicStrategy(async (username: string, password: string, done: any) => {
      console.log("BASIC STRATEGY")
      // @ts-ignore
      const client = await Client.findOne({ clientId: username })

      if (!client) {
        return done(null, false)
      }

      if (client.clientSecret !== password) {
        return done(null, false)
      }

      return done(null, client)
    }),
  )

  passport.use(
    new ClientPasswordStrategy(
      async (clientId: string, clientSecret: string, done: any) => {
        console.log("CLIENT PASSWORD STRATEGY")
        // @ts-ignore
        const client = await Client.findOne({ clientId: clientId })

        if (!client) {
          return done(null, false)
        }

        if (client.clientSecret !== clientSecret) {
          return done(null, false)
        }

        return done(null, client)
      },
    ),
  )

  passport.use(
    new BearerStrategy(async (accessToken: string, done: any) => {
      console.log("BEARER STRATEGY")
      // @ts-ignore
      const token = await AccessToken.findOne({ token: accessToken })

      if (!token) {
        return done(null, false)
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (Math.round((Date.now() - token.createdAt) / 1000) > +TOKEN_LIFE) {
        await token.remove()

        return done(null, false, { message: "Token expired" })
      }

      const info = { scope: "*" }
      if (token.userId === token.clientId) {
        // @ts-ignore
        const client = await Client.findOne({ clientId: token.clientId })
        return done(null, client, info)
      }
      // @ts-ignore
      const user = await User.findOne({ email: token.userId })

      if (!user) {
        return done(null, false, { message: "Unknown user" })
      }

      done(null, user, info)
    }),
  )
}