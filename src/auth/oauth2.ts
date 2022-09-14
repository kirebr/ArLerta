import passport from 'passport'
import oauth2orize from 'oauth2orize'
import jwt from 'jsonwebtoken'
import Repository from '../repository';
import Client from '../models/Client'
import RefreshToken from '../models/RefreshToken'
import User from '../models/User'
import AccessToken from '../models/AccessToken';

const accessTokenRepository = Repository(AccessToken);
const refreshTokenRepository = Repository(RefreshToken);
const userRepository = Repository(User);

let aServer = oauth2orize.createServer()
const TOKEN_LIFE = process.env.TOKEN_LIFE || 1800
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'ad20e0ad21cd2bbd12a2342342f98c67469cf6993cb9175cf22b17a57ed1fcd983e34ccb0729dbc74a203ce8b06d206def01238cf0757e1b22cdde3010791efe83f'

// Exchange username & password for an access token
aServer.exchange(oauth2orize.exchange.password(async (client, username, password, scope, done) => {
    console.log('EXCHANGE USERNAME FOR ACCESS TOKEN')
    // @ts-ignore
    let user: User | undefined = await userRepository.findOne({ where: { email: username }});

    if (!user) {
        return done(null, false)
    }
    if (!user.checkPassword(password)) {
        return done(null, false)
    }
    await generateTokenForApp(client, user, done)
}))

// Exchange refreshToken for an access token
aServer.exchange(oauth2orize.exchange.refreshToken(async (client, refreshToken, scope, done) => {
    console.log('EXCHANGE REFRESH TOKEN FOR ACCESS TOKEN')
    // @ts-ignore
    const actualRefreshToken: RefreshToken | undefined = await refreshTokenRepository.findOne({ where: { refreshToken: refreshToken }})

    if (!actualRefreshToken) {
        return done(null, false)
    }

    const userID = actualRefreshToken.userId 

    // @ts-ignore
    const user: User | undefined  = await userRepository.findOne({ where: { email: userID }})

    if (!user) {
      return done(null, false)
    }

    await generateTokenForApp(client, user, done)
}))

const generateTokenForApp = async (client: Client, user: User, done: any) => {
  const userID  = user.id;

  // @ts-ignore
  const actualRefreshToken: RefreshToken | undefined = await refreshTokenRepository.findOne({ where: { userId: userID }})

  if (actualRefreshToken) {
      await actualRefreshToken.remove()
  }

  // @ts-ignore
  const actualToken: AccessToken | undefined = await accessTokenRepository.findOne({ where: { userId: userID }});

  if (actualToken) {
      await actualToken.remove()
  }

  const tokenValue = generateUserJWTToken(user)
  const refreshTokenValue = generateUserJWTToken(user)

  const accessToken = new AccessToken()
  accessToken.clientId = client.clientId;
  accessToken.token = tokenValue
  accessToken.userId = user.email

  const refreshToken = new RefreshToken()
  refreshToken.clientId = client.clientId;
  refreshToken.token = refreshTokenValue
  refreshToken.userId = user.email

  await refreshTokenRepository.save(refreshToken);
  await accessTokenRepository.save(accessToken);

  done(null, tokenValue, refreshTokenValue, {'expires_in': TOKEN_LIFE})
}

const generateUserJWTToken = (user: User) => {
    const payload = { name: user.name, email: user.email, type: user.type }
    // @ts-ignore
    return jwt.sign(payload, TOKEN_SECRET, { expiresIn: +TOKEN_LIFE })
}

const token = [
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    aServer.token(),
    aServer.errorHandler()
]

export default token
