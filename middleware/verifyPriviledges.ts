import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenUserDataType } from "types/types.js";

interface AuthenticatedRequest extends Request {
  authUser?: TokenUserDataType;
}

const verifyAccessToken =
  (minRole: number = 5000) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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

      // Verify minimum role condition

      if (decodedAccessToken.UserRoles.roleId < minRole) {
        return res.status(403).json({ error: "Forbidden - Insufficient privileges" });
      }

      // Min role condition successful, attach authUser to request and continue

      req.authUser = decodedAccessToken;

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: "Unauthorized - Access Token Expired" });
      }
      // Handle other unexpected errors
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

module.exports = verifyAccessToken;
