import procurementsModel from "../models/procurementsModel.js";
import { Request, Response, NextFunction } from "express";
import { Procurements } from "@prisma/client";
import { Procurement } from "../types/types.js";
import { TokenUserDataType } from "../types/types.js";

interface AuthenticatedRequest extends Request {
  authUser?: TokenUserDataType;
}

const getAllProcurementsController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response<any> | void> => {
  try {
    const queryParams: any = req?.query;

    const { sortBy, sortOrder, limit, page, search, ...filters } = queryParams;

    const take: number | undefined = limit ? parseInt(limit) : undefined;
    const skip: number | undefined = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;

    const orderBy: object | undefined =
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : undefined;

    const andKeys = ["procurementId", "productId", "storeId", "userId"];
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

    andKeys.forEach((key) => {
      if (filters[key]) {
        andConditions.push(createCondition(key, filters[key]));
      }
    });

    orKeys.forEach((key) => {
      if (filters[key]) {
        orConditions.push(createCondition(key, filters[key]));
      }
    });

    if (search) {
      andConditions.push({
        OR: [
          { Products: { productName: { contains: search } } },
          { Products: { productBarcode: { contains: search } } },
          { Products: { productDesc: { contains: search } } },
        ],
      });
    }
    // Check if the user is authorized to access all procurements, return only their Store procurements otherwise
    if (!req.authUser || req.authUser.UserRoles.roleId < 3000) {
      andConditions.push({ Stores: { storeId: { in: req.authUser?.Stores.map((store) => store.storeId) || [] } } });
    }

    const whereClause = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const procurements: Procurement[] = await procurementsModel.getAllProcurements({
      whereClause,
      orderBy,
      take,
      skip,
    });
    return res.status(200).json(procurements);
  } catch (error) {
    next(error);
  }
};

const getAllProcurementsCountController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const queryParams: any = req?.query;

    const { sortBy, sortOrder, limit, page, search, ...filters } = queryParams;

    const take: number | undefined = limit ? parseInt(limit) : undefined;
    const skip: number | undefined = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined;

    const orderBy: object | undefined =
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : undefined;

    const andKeys = ["procurementId", "productId", "storeId", "userId"];
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

    andKeys.forEach((key) => {
      if (filters[key]) {
        andConditions.push(createCondition(key, filters[key]));
      }
    });

    orKeys.forEach((key) => {
      if (filters[key]) {
        orConditions.push(createCondition(key, filters[key]));
      }
    });

    if (search) {
      andConditions.push({
        OR: [
          { Products: { productName: { contains: search } } },
          { Products: { productBarcode: { contains: search } } },
          { Products: { productDesc: { contains: search } } },
        ],
      });
    }
    // Check if the user is authorized to access all procurements, return only their Store procurements otherwise
    if (!req.authUser || req.authUser.UserRoles.roleId < 3000) {
      andConditions.push({ Stores: { storeId: { in: req.authUser?.Stores.map((store) => store.storeId) || [] } } });
    }

    const whereClause = {
      AND: andConditions.length > 0 ? andConditions : undefined,
      OR: orConditions.length > 0 ? orConditions : undefined,
    };

    const count: number = await procurementsModel.getAllProcurementsCount({ whereClause });
    return res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};

const getProcurementController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const procurementId: number = parseInt(req.params.procurementId);
    if (isNaN(procurementId)) {
      return res.status(400).json({ message: "Invalid inventory procurement ID" });
    }
    const procurement: Procurement | null = await procurementsModel.getProcurement(procurementId);

    if (!procurement) {
      return res.status(404).json({ message: "Procurement not found" });
    }

    // Check if the user is authorized to access the procurement
    if (
      !req.authUser ||
      (req.authUser.UserRoles.roleId < 3000 &&
        req.authUser.Stores?.some((store) => store.storeId === procurement.Stores?.storeId))
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json(procurement);
  } catch (error) {
    next(error);
  }
};

const createProcurementController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const procurement: Omit<Procurements, "procurementId"> = req.body;

    if (
      !req.authUser ||
      (req.authUser.UserRoles.roleId < 3000 &&
        req.authUser.Stores?.some((store) => store.storeId === procurement.storeId))
    ) {
      return res.status(401).json({ message: "Unauthorized to create procurement for this Store" });
    }
    // Set the user ID if not provided
    procurement.userId = req.authUser.userId;
    const newProcurement: Procurements = await procurementsModel.createProcurement(procurement);
    return res.status(201).json(newProcurement);
  } catch (error) {
    next(error);
  }
};

const updateProcurementController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const existingProcurement = await procurementsModel.getProcurement(parseInt(req.params.procurementId));
    if (!existingProcurement) {
      return res.status(404).json({ message: "Procurement not found" });
    }

    if (
      !req.authUser ||
      (req.authUser.UserRoles.roleId < 3000 &&
        req.authUser.Stores?.some((store) => store.storeId === existingProcurement.Stores.storeId))
    ) {
      return res.status(401).json({ message: "Unauthorized to update this procurement" });
    }
    const procurement: Procurements = req.body;
    const updatedProcurement: Procurements = await procurementsModel.updateProcurement(
      procurement
    );
    return res.status(200).json(updatedProcurement);
  } catch (error) {
    next(error);
  }
};

const deleteProcurementController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const existingProcurement = await procurementsModel.getProcurement(parseInt(req.params.procurementId));
    if (!existingProcurement) {
      return res.status(404).json({ message: "Procurement not found" });
    }

    if (
      !req.authUser ||
      (req.authUser.UserRoles.roleId < 3000 &&
        req.authUser.Stores?.some((store) => store.storeId === existingProcurement.Stores.storeId))
    ) {
      return res.status(401).json({ message: "Unauthorized to delete this procurement" });
    }
    const deletedProcurement: Procurements = await procurementsModel.deleteProcurement(
      existingProcurement.procurementId
    );
    return res.status(200).json(deletedProcurement);
  } catch (error) {
    next(error);
  }
};

const resetProcurementsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  
  if (!req.authUser || req.authUser.UserRoles.roleId < 3000) {
    return res.status(401).json({ message: "Unauthorized to reset procurements" });
  }


  try {
    const storeId: number = parseInt(req.params.storeId);
    const resetProcurements: { count: number } = await procurementsModel.resetProcurements(storeId);
    return res.status(200).json("Deleted procurements count: " + resetProcurements.count);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllProcurementsController,
  getAllProcurementsCountController,
  getProcurementController,
  createProcurementController,
  updateProcurementController,
  deleteProcurementController,
  resetProcurementsController
};
