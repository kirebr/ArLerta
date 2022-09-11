import passport from "passport"
import AccessToken from "../models/AccessToken"
import User from "../models/User"

import { Strategy as BearerStrategy } from "passport-http-bearer"

export default function init() {
  const { TOKEN_LIFE } = process.env

  passport.use(
    new BearerStrategy(async (accessToken: string, done: any) => {
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
        const client = await AccessToken.findOne({ clientId: token.clientId })
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