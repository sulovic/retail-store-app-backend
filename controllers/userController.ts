import userModel from "../models/userModel.js";
import { Request, Response, NextFunction } from "express";
import { UserPublicDataType } from "../types/types.js";

const getAllUsersController = async (req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {
  try {
    const users: UserPublicDataType[] = await userModel.getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const getUserController = async (req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {
  try {
    const userId: number = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user: UserPublicDataType | null = await userModel.getUser(userId);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
};

const createUserController = async (req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {
  try {
    const user: Omit<UserPublicDataType, "userId"> = req.body;
    const newUser: UserPublicDataType = await userModel.createUser(user);
    return res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

const updateUserController = async (req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {
  try {
    const user: UserPublicDataType = req.body;
    const updatedUser: UserPublicDataType = await userModel.updateUser(user);
    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

const deleteUserController = async (req: Request, res: Response, next: NextFunction): Promise<Response<any> | void> => {
  try {
    const userId: number = parseInt(req.params.userId);
    const deletedUser: UserPublicDataType = await userModel.deleteUser(userId);
    return res.status(200).json(deletedUser);
  } catch (err) {
    next(err);
  }
};

export default {
  getAllUsersController,
  getUserController,
  createUserController,
  updateUserController,
  deleteUserController,
};
