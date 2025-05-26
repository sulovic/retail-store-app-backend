import * as z from "zod";

export const userRolesSchema = z.object({
  roleId: z.number(),
  roleName: z.string(),
});

export const storeListSchema = z.object({
  storeId: z.number(),
  storeName: z.string(),
  storeAddress: z.string(),
});

export const userSchema = z.object({
  userId: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
});

export const userPublicDataSchema = z.object({
  userId: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  UserRoles: userRolesSchema,
  Stores: z.array(storeListSchema),
});

export type UserPublicDataType = z.infer<typeof userPublicDataSchema>;

export const authUserSchema = z.object({
  userId: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().nullable(),
  refreshToken: z.string().nullable(),
  createdAt: z.date(),
  UserRoles: userRolesSchema,
  Stores: z.array(storeListSchema),
});

export type AuthUserDataType = z.infer<typeof authUserSchema>;

export const tokenUserSchema = z.object({
  userId: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  UserRoles: userRolesSchema,
  Stores: z.array(storeListSchema),
});

export type TokenUserDataType = z.infer<typeof tokenUserSchema>;

export const storeSchema = z.object({
  storeId: z.number().optional(),
  storeName: z.string(),
  storeAddress: z.string(),
  Users: z.array(userSchema),
});

export type Store = z.infer<typeof storeSchema>;

export const inventorySchema = z.object({
  inventoryId: z.number().optional(),
  inventoryDate: z.date(),
  Creator: userSchema,
  Stores: storeSchema,
  archived: z.boolean(),
});

export type Inventory = z.infer<typeof inventorySchema>;

export const inventoryProductSchema = z.object({
  inventoryProductId: z.number(),
  inventoryId: z.number(),
  productPrice: z.number(),
  productQuantity: z.number(),
  Users: z.object({ userId: z.number(), firstName: z.string(), lastName: z.string() }),
  Products: z.object({ productId: z.number(), productName: z.string() }),
});

export type InventoryProduct = z.infer<typeof inventoryProductSchema>;

export const procurementSchema = z.object({
  procurementId: z.number(),
  Products: z.object({ productId: z.number(), productName: z.string(), productBarcode: z.string() }),
  productQuantity: z.number(),
  Stores: z.object({ storeId: z.number(), storeName: z.string() }),
  Users: z.object({ userId: z.number(), firstName: z.string(), lastName: z.string() }),
  completed: z.boolean().nullable(),
  createdAt: z.date(),
});

export type Procurement = z.infer<typeof procurementSchema>;

export const queryParamsSchema = z.object({
  sortBy: z.string().optional().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  limit: z.string().optional(),
  page: z.string().optional(),
  search: z.string().optional(),
  filters: z.record(z.string()).optional(),
});

export type QueryParams = z.infer<typeof queryParamsSchema>;

export const categorySchema = z.object({
  categoryId: z.number().optional(),
  categoryName: z.string(),
  categoryPath: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

export const productSchema = z.object({
  productId: z.number().optional(),
  productBarcode: z.string(),
  productName: z.string(),
  productUrl: z.string(),
  productPrice: z.number(),
  productDesc: z.string().nullable(),
  productImage: z.string().nullable(),
  Categories: z.array(categorySchema),
});

export type Product = z.infer<typeof productSchema>;
