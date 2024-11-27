import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenUserDataType } from "../types/types.js";
import priviledgesSchema from "../config/priviledgesSchema.js";

interface AuthenticatedRequest extends Request {
  authUser?: TokenUserDataType;
}

const verifyAccessToken = (route: keyof typeof priviledgesSchema) => async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader: string | undefined = req?.headers?.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized - Missing Authorization Header" });
    }

    const [scheme, accessToken]: string[] = authHeader.split(" ");

    if (scheme !== "Bearer" || !accessToken) {
      return res.status(401).json({ error: "Unauthorized - Invalid Authorization Format" });
    }

    // Verify the accessToken signature

    const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string) as TokenUserDataType;

    // Token valid, attach authUser to request

    req.authUser = decodedAccessToken;

    //verify minRole route and method priviledges, fallback 5000

    const minRole = priviledgesSchema[route][req.method as string] || 5000;

    if (decodedAccessToken.UserRoles.roleId < minRole) {
      return res.status(403).json({ error: "Forbidden - Insufficient Privileges" });
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Unauthorized - Access Token Expired" });
    }
    // Handle other unexpected errors
    next(error);
  }
};

export default verifyAccessToken;
