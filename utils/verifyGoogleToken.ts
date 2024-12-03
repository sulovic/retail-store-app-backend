import { OAuth2Client, LoginTicket, TokenPayload } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (idToken: string): Promise<TokenPayload | undefined> => {
 
  console.log("received token", idToken);
 
  const ticket : LoginTicket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload : TokenPayload | undefined = ticket.getPayload();

console.log("verified", payload);

  return payload;
};

export default verifyGoogleToken;
