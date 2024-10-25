import userModel from "../models/userModel.js";
import { Request, Response, NextFunction } from "express";
import { Users } from "@prisma/client";

const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users: Users[] = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: number = parseInt(req.params.userId);
    if (isNaN(userId)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }
    const user: Users | null = await userModel.getUser(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

const createUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: Omit<Users, "productId"> = req.body;
    const newUser: Users = await userModel.createUser(user);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: Users = req.body;
    const updatedUser: Users = await userModel.updateUser(user);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId: number = parseInt(req.params.userId);
    const deletedUser: Users = await userModel.deleteUser(userId);
    res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllUsersController,
  getUserController,
  createUserController,
  updateUserController,
  deleteUserController,
};
