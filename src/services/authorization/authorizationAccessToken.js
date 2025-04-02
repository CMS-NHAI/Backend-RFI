import express from 'express';
import session from 'express-session';
import Keycloak from 'keycloak-connect'
import axios from 'axios'
import { authorizationCredential } from '../../constants/authorization/authorizationCredential.js';
import https from 'https';
import { RESPONSE_MESSAGES } from '../../constants/responseMessages.js';
import { authorizationUrl } from '../../constants/authorization/authorizationUrl.js';

const app = express();

const agent = new https.Agent({  
  rejectUnauthorized: false
});

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore }, authorizationCredential);

app.use(
  session({
    secret: authorizationCredential?.credentials?.clientSecret,
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

app.use(keycloak.middleware());
const { clientId, credentials} = authorizationCredential;

/**
 * Description : @generateAccessToken user to generate token.
*/
export const generateAccessToken = async (req, res) => {

    try {
      const tokenResponse = await axios.post(
        `${authorizationUrl.access_token}`,
        new URLSearchParams({
          client_id: clientId,
          client_secret: credentials?.clientSecret,
          grant_type: "client_credentials",
        }),
        { httpsAgent: agent }
      );
      const keycloakToken = tokenResponse.data.access_token;
      return keycloakToken;
      
    } catch (error) {
      throw new Error(
        error?.response?.data?.error || RESPONSE_MESSAGES.ERROR.ACCESS_TOKEN_FAIL
      );
    }
  };