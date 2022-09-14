import passport from 'passport'
import Repository from '../repository';
import Client from '../models/Client'
import AccessToken from '../models/AccessToken'
import User from '../models/User'

const BasicStrategy = require('passport-http').BasicStrategy
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy
const BearerStrategy = require('passport-http-bearer').Strategy

const clientRepository = Repository(Client);
const accessTokenRepository = Repository(AccessToken);
const UserRepository = Repository(User);

export default function init() {
    const { TOKEN_LIFE } = process.env

    passport.use(
        new BasicStrategy(async (username: string, password: string, done: any) => {
            console.log('BASIC STRATEGY')
            const client =  await clientRepository.findOne({ where: { clientId: username } })
            console.log("CLient:", client);

            if (!client) {
                return done(null, false)
            }

            // @ts-ignore
            if (client.clientSecret !== password) {
                return done(null, false)
            }

            return done(null, client)
        })
    )

    passport.use(
        new ClientPasswordStrategy(async (clientId: string, clientSecret: string, done: any) => {
            console.log('CLIENT PASSWORD STRATEGY')
            const client = await clientRepository.findOne({ where: { clientId: clientId }});

            if (!client) {
                return done(null, false)
            }

            // @ts-ignore
            if (client.clientSecret !== clientSecret) {
                return done(null, false)
            }

            return done(null, client)
        })
    )

    passport.use(
        new BearerStrategy(async (accessToken: string, done: any) => {
            console.log('BEARER STRATEGY')
            const token = await accessTokenRepository.findOne({ where: { token: accessToken }});

            if (!token) {
                return done(null, false)
            }

            // @ts-ignore
            if (Math.round((Date.now() - token.createdAt) / 1000) > +TOKEN_LIFE) {
                await accessTokenRepository.delete(token);
                return done(null, false, { message: 'Token expired' });
            }

            let info = { scope: '*' }
            // @ts-ignore
            const { userId } = token;

            const user = await UserRepository.findOne({ where: { email: userId }});

            if (!user) {
                return done(null, false, { message: 'Unknown user' })
            }

            done(null, user, info)
        })
    )
}
