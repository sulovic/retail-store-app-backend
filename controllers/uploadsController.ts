import path from "path";
import fs from "fs/promises";
import { Request, Response, NextFunction } from "express";
import { fileURLToPath } from "url";

const uploadController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file && !req.files) {
      return res.status(400).send("No files were uploaded.");
    }

    if (req.file) {
      // Single file upload
      return res.status(200).json({ message: "File uploaded successfully", filename: req.file.filename });
    }

    if (req.files) {
      // Multiple files upload
      const fileNames = (req.files as Express.Multer.File[]).map((file) => file.filename);
      return res.status(200).json({ message: "Files uploaded successfully", filenames: fileNames });
    }
  } catch (error) {
    next(error);
  }
};

const deleteFileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { files } = req.body;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No filenames provided" });
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const uploadDir = path.resolve(__dirname, "../public");

    const errors: string[] = [];
    const deletedFiles: string[] = [];

    for (const file of files) {
      const filePath = path.resolve(uploadDir, file);

      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        deletedFiles.push(file);
      } catch (error: any) {// eslint-disable-line
        if (error.code === "ENOENT") {
          errors.push(`File not found: ${file}`);
        } else {
          errors.push(`Error deleting file ${file}: ${error.message}`);
        }
      }
    }

    if (errors.length > 0) {
      // If there were errors, send them with the successful deletions
      return res.status(400).json({
        message: "Some files were not deleted",
        deletedFiles,
        errors,
      });
    }

    res.status(200).json({
      message: "All files deleted successfully",
      deletedFiles,
    });
  } catch (error: any) {// eslint-disable-line
    next(error);
  }
};

export { uploadController, deleteFileController };
