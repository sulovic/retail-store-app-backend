import { Request, Response, NextFunction } from "express";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const resizeImage =
  (width: number = 800) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      // Single file resize
      if (req.file) {
        const filePath = path.join(__dirname, "../public/", req.file.originalname);
        const tempFilePath = path.join(__dirname, "../public/", `temp-${req.file.originalname}`);

        await sharp(filePath).resize(width).toFile(tempFilePath);

        await fs.rename(tempFilePath, filePath);
      }

      // Multiple file resize
      if (Array.isArray(req.files)) {
        await Promise.all(
          req.files.map(async (file) => {
            const filePath = path.join(__dirname, "../public/", file.originalname);
            const tempFilePath = path.join(__dirname, "../public/", `temp-${file.originalname}`);

            await sharp(filePath).resize(width).toFile(tempFilePath);

            await fs.rename(tempFilePath, filePath);
          })
        );
      }

      next();
    } catch (error) {
      res.status(500).send("Failed to resize image.");
      next(error);
    }
  };

export default resizeImage;
