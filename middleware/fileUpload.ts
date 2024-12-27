import multer from "multer";
import path from "path";
import fileUploadParams from "../config/fileUploadParams.js";
import { Request, Response, NextFunction } from "express";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempUploadDir = path.resolve(__dirname, "../public/tmp");
const uploadDir = path.resolve(__dirname, "../public");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempUploadDir);
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = file.originalname
      .replace(/[^a-zA-Z0-9-_.]/g, "") // Remove invalid characters
      .replace(/\s+/g, "_"); // Replace spaces with underscores
    cb(null, sanitizedFileName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: fileUploadParams.fileSize,
    files: fileUploadParams.fileCount,
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = fileUploadParams.allowedFileTypes;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype.toLowerCase());

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed"));
    }
  },
});

const fileUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await new Promise<void>((resolve, reject) => {
      upload.any()(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Process uploaded files after multer has completed
    if (req.file) {
      const tempFilePath = path.join(tempUploadDir, req.file.filename);
      const finalFilePath = path.join(uploadDir, req.file.filename);
      await fs.rename(tempFilePath, finalFilePath);
    }

    if (req.files) {
      for (const file of req.files as Express.Multer.File[]) {
        const tempFilePath = path.join(tempUploadDir, file.filename);
        const finalFilePath = path.join(uploadDir, file.filename);
        await fs.rename(tempFilePath, finalFilePath);
      }
    }

    next();
  } catch (err: any) {// eslint-disable-line
    res.status(400).json({ message: err.message });
  }
};

export default fileUpload;
