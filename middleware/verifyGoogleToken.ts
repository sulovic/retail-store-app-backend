import { OAuth2Client, LoginTicket, TokenPayload } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (idToken: string): Promise<TokenPayload | undefined> => {
  const ticket : LoginTicket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload : TokenPayload | undefined = ticket.getPayload();

  return payload;
};

export default verifyGoogleToken;
