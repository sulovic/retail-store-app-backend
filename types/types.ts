export type UserPublicDataType = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  UserRoles: {
    roleId: number;
    roleName: string;
  };
};

export type AuthUserDataType = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string | null;
  refreshToken: string | null;
  createdAt: Date;
  UserRoles: {
    roleId: number;
    roleName: string;
  };
};

export type TokenUserDataType = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  UserRoles: {
    roleId: number;
    roleName: string;
  };
};

export type Store = {
  storeId: number;
  storeName: string;
  storeAddress: string;
};

export type Inventory = {
  inventoryId: number;
  inventoryDate: Date;
  Users: {
    userId: number;
    firstName: string;
    lastName: string;
  };
  Stores: Store;
  archived: boolean;
};

export type InventoryProduct = {
  inventoryProductId: number;
  inventoryId: number;
  productPrice: number;
  productQuantity: number;
  Users: {
    userId: number;
    firstName: string;
    lastName: string;
  };
  Products: {
    productId: number;
    productName: string;
  };
};
