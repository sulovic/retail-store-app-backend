export type UserPublicDataType = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  UserRoles: {
    roleId: number;
    roleName: string;
  };
  Stores: {
    storeId: number;
    storeName: string;
    storeAddress: string;
  }[];
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
  Stores: {
    storeId: number;
    storeName: string;
    storeAddress: string;
  }[];
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
  Stores: {
    storeId: number;
    storeName: string;
    storeAddress: string;
  }[];
};

export type Store = {
  storeId: number;
  storeName: string;
  storeAddress: string;
  Users: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
  }[];
};

export type Inventory = {
  inventoryId: number;
  inventoryDate: Date;
  Creator: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
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

export type Procurement = {
  procurementId: number;
  Products: {
    productId: number;
    productName: string;
    productBarcode: string;
  }
  productQuantity: number;
  Stores: {
    storeId: number;
    storeName: string;}
    Users: {
    userId: number;
    firstName: string;
    lastName: string;
  };
  completed: boolean | null;
  createdAt:  Date;
};

export type  QueryParams = {
  sortBy?: string; 
  sortOrder?: 'asc' | 'desc'; 
  limit?: string; 
  page?: string; 
  search?: string;
  [key: string]: string | undefined;
}