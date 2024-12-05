import { OAuth2Client, LoginTicket, TokenPayload } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (idToken: string): Promise<TokenPayload | undefined> => {
  const validClientIds = [
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_ID_ANDROID!,
  ];

  const ticket: LoginTicket = await client.verifyIdToken({
    idToken,
    audience: validClientIds,
  });

  const payload: TokenPayload | undefined = ticket.getPayload();

  return payload;
};

export default verifyGoogleToken;
