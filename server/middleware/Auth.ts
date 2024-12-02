import { expressjwt, GetVerificationKey } from "express-jwt";
import jwks from 'jwks-rsa'

const domain = 'https://roa-2024-katuta.au.auth0.com'
const audience = 'performance-logger-api'

const checkJwt = expressjwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${domain}/.well-known/jwks.json`,
  }) as GetVerificationKey,
  audience: audience,
  issuer: `${domain}/`,
  algorithms: ['RS256'],
})

export default {checkJwt}