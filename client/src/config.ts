// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'it9sl019cl'
export const apiEndpoint = `https://${apiId}.execute-api.ap-southeast-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-5p2xbsux.auth0.com',            // Auth0 domain
  clientId: 'BEuXkgdpTZUYeSwENAMfeXKWOokkknQa',          // Auth0 client id
  callbackUrl: 'http://todo.cikooapps.com:8080/callback'
}
