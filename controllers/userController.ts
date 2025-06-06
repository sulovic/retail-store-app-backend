import userModel from "../models/userModel.js";
import { Request, Response, NextFunction } from "express";
import { UserPublicDataType, QueryParams } from "../types/types.js";

const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams: QueryParams = req?.query as QueryParams;

    const { sortBy, sortOrder, limit, page, search, ...filters } = queryParams;

    const take: number | undefined = limit ? parseInt(limit) : undefined;
    const skip: number | undefined = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;

    const orderBy: object | undefined = sortBy
      ? {
          [sortBy]: sortOrder || "asc",
        }
      : undefined;

    const andKeys = ["userId", "roleId"];
    const orKeys: string[] = [];

    const hasAnyAndKeys = andKeys.some((key) => key in filters);
    const hasAnyOrKeys = orKeys.some((key) => key in filters);

    if (Object.keys(filters).length > 0 && !hasAnyAndKeys && !hasAnyOrKeys) {
      return res.status(400).json({ message: "Invalid filters provided" });
    }

    const createCondition = (key: string, value: string) => {
      const values = value.split(",").map((item) => {
        return isNaN(Number(item)) ? item.toString() : Number(item);
      });
      return values.length === 1 ? { [key]: values[0] } : { [key]: { in: values } };
    };

    const andConditions: object[] = [];
    const orConditions: object[] = [];

    if (filters) {
      andKeys.forEach((key) => {
        const value = (filters as Record<string, string>)[key]; 
        if (value) {
          andConditions.push(createCondition(key, value));
        }
      });
    
      orKeys.forEach((key) => {
        const value = (filters as Record<string, string>)[key];
        if (value) {
          orConditions.push(createCondition(key, value));
        }
      });
    }

    if (search) {
      orConditions.push({
        OR: [{ firstName: { contains: search } }, { lastName: { contains: search } }, { email: { contains: search } }],
      });
    }

    const whereClause = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const users: UserPublicDataType[] = await userModel.getAllUsers({
      whereClause,
      orderBy,
      take,
      skip,
    });
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const getAllUsersCountController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams: QueryParams = req?.query as QueryParams;

    const { sortBy, sortOrder, limit, page, search, ...filters } = queryParams; // eslint-disable-line @typescript-eslint/no-unused-vars

    const andKeys = ["userId", "roleId"];
    const orKeys: string[] = [];

    const hasAnyAndKeys = andKeys.some((key) => key in filters);
    const hasAnyOrKeys = orKeys.some((key) => key in filters);

    if (Object.keys(filters).length > 0 && !hasAnyAndKeys && !hasAnyOrKeys) {
      return res.status(400).json({ message: "Invalid filters provided" });
    }

    const createCondition = (key: string, value: string) => {
      const values = value.split(",").map((item) => {
        return isNaN(Number(item)) ? item.toString() : Number(item);
      });
      return values.length === 1 ? { [key]: values[0] } : { [key]: { in: values } };
    };

    const andConditions: object[] = [];
    const orConditions: object[] = [];

    if (filters) {
      andKeys.forEach((key) => {
        const value = (filters as Record<string, string>)[key]; 
        if (value) {
          andConditions.push(createCondition(key, value));
        }
      });
    
      orKeys.forEach((key) => {
        const value = (filters as Record<string, string>)[key];
        if (value) {
          orConditions.push(createCondition(key, value));
        }
      });
    }

    if (search) {
      orConditions.push({
        OR: [{ firstName: { contains: search } }, { lastName: { contains: search } }, { email: { contains: search } }],
      });
    }

    const whereClause = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const usersCount: number = await userModel.getAllUsersCount({ whereClause });
    return res.status(200).json(usersCount);
  } catch (err) {
    next(err);
  }
};

const getUserController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
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

const createUserController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const user: Omit<UserPublicDataType, "userId"> = req.body;
    const newUser: UserPublicDataType = await userModel.createUser(user);
    return res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

const updateUserController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const user: UserPublicDataType = req.body;
    const updatedUser: UserPublicDataType = await userModel.updateUser(user);
    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

const deleteUserController = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
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
  getAllUsersCountController,
  getUserController,
  createUserController,
  updateUserController,
  deleteUserController,
};
