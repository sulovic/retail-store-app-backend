type PrivilegesSchema = Record<string, Record<string, number>>;

const priviledgesSchema: PrivilegesSchema = {
  products: {
    GET: 1000,
    POST: 3000,
    PUT: 3000,
    DELETE: 3000,
  },
  stores: {
    GET: 1000,
    POST: 3000,
    PUT: 3000,
    DELETE: 3000,
  },
  inventories: {
    GET: 1000,
    POST: 3000,
    PUT: 3000,
    DELETE: 3000,
  },
  inventoryProducts: {
    GET: 1000,
    POST: 1000,
    PUT: 1000,
    DELETE: 1000,
  },
  procurements: {
    GET: 1000,
    POST: 3000,
    PUT: 3000,
    DELETE: 3000,
  },
  procurementProducts: {
    GET: 1000,
    POST: 1000,
    PUT: 1000,
    DELETE: 1000,
  },
  userRoles: {
    GET: 3000,
    POST: 5000,
    PUT: 5000,
    DELETE: 5000,
  },
  users: {
    GET: 3000,
    POST: 5000,
    PUT: 5000,
    DELETE: 5000,
  },
};

export default priviledgesSchema;
