import userModel from "../models/userModel.js";
import { Request, Response } from "express";
import { Users } from "@prisma/client";

const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users: Users[] = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    // Log errors and handle response codes appropriately
    console.error("Error :", error);
    res.status(500).json(error);
  }
};

const getUserController = async (req: Request, res: Response) => {
  try {
    const userId: number = parseInt(req.params.userId);
    const user: Users | null = await userModel.getUser(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    // Log errors and handle response codes appropriately
    console.error("Error :", error);
    res.status(500).json(error);
  }
};

const createUserController = async (req: Request, res: Response) => {
  try {
    const user: Omit<Users, "productId"> = req.body;
    const newUser: Users = await userModel.createUser(user);
    res.status(201).json(newUser);
  } catch (error) {
    // Log errors and handle response codes appropriately
    console.error("Error :", error);
    res.status(500).json(error);
  }
};

const updateUserController = async (req: Request, res: Response) => {
  try {
    const user: Users = req.body;
    const updatedUser: Users = await userModel.updateUser(user);
    res.json(updatedUser);
  } catch (error) {
    // Log errors and handle response codes appropriately
    console.error("Error :", error);
    res.status(500).json(error);
  }
};

const deleteUserController = async (req: Request, res: Response) => {
  try {
    const userId: number = parseInt(req.params.userId);
    const deletedUser: Users = await userModel.deleteUser(userId);
    res.json(deletedUser);
  } catch (error) {
    // Log errors and handle response codes appropriately
    console.error("Error :", error);
    res.status(500).json(error);
  }
};

export default {
getAllUsersController,
getUserController,
createUserController,
updateUserController,
deleteUserController
};
