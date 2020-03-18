import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify} from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
//import axios from 'axios'
//import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const cert =`-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJCuEHx9sVKsMHMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi01cDJ4YnN1eC5hdXRoMC5jb20wHhcNMjAwMzE2MjMxNzUzWhcNMzMx
MTIzMjMxNzUzWjAhMR8wHQYDVQQDExZkZXYtNXAyeGJzdXguYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApUpcLmhSl7K2HRYi+0NQ2VFu
i3AswYgEJjnwfCtbmDmEAQ3kaC7hqUHGWrh/AfCwUnG5boYPTrW3pR+mZFDGZuav
Nl9Chg0JWbwlRkRLRVR/bzpRp0AYGykmiV2rVj3LDbZvVo0khvdCCvPpnOfxaLOS
yxkv514SHe2XZni4ECNke663+FMwMAP+0NsjJG7qTUGH9lyGqlcElTLpI3e3fzj2
+PzxBS0ViqcU+EbzyT3mAOR244wTBiBurld3pHbPpBUL+X6n9jROdkUtw5kcmDFX
W750sB8iT6q4Nn+c0zUiTBG5j5jpYGqQPQnCHLscXhw6Pllh9QMbH8QJ6/fwRQID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSRZqjI4wH8tAIdGcJC
RXNaUag/1DAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAJmjb1Kv
/vQ4vnWtpgS6/YN6dqmY3hM6DnwByIJBs/x7bWqcfAU9IrJRIbwlY3JbmNEs+o9V
N+qUi82GVWpRzv1QLprWJbqjin269IFFRL0e8onLXEI7bPJ6FQIsXF4fUUmM0TJb
Y2AKC6sf89a8Qkdlk5GoU9NT+ZPvDL7PrJ8vx3WCcCE31VPxJ6LYQooxYtTqUraF
p9/39uPW8fveGnyKFQOVu2uA60en29ULsLhHvn9G1HbjKsGy5rTh/JYE7fuM1A6v
lyFE1hyAn1sojAND9txevcKIxAb83fgCnW3plmLGflnO1GHQcOjP8QDklbr+NDGm
h7lg+rBBwxSkUPA=
-----END CERTIFICATE-----`

//const jwksUrl = '...'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  //const jwt: Jwt = decode(token, { complete: true }) as Jwt
  logger.info("verifyToken")
  logger.info(token)
  return verify(token, getCert(), { algorithms: ['RS256'] }) as JwtPayload
}


function getCert():string{
  return cert
}


function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
