import pkg from '@prisma/client';
import { arch } from 'os';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const seedPredefinedData = async () => {
  try {

    // Predefined UserRoles
    const userRoles = [
      { roleId: 1001, roleName: "Seller" },
      { roleId: 3101, roleName: "Manager" },
      { roleId: 5001, roleName: "Admin" },
    ];

    // Predefined Admin Users
    const adminUsers = [
      {
        userId: 1,
        firstName: "Vladimir",
        lastName: "Šulović",
        email: "sulovic@gmail.com",
        password:"$2a$12$MxOp73piSxGiWfuwx0X5T.e3jbhO6xrJW0ThSUUokz48Ao5vNCQgS",
        roleId: 5001,
      },
    ];

    const testStores = [
      { storeId:1, storeName: "Test Store 1", storeAddress: "Test Address 1" },
      {storeId:2, storeName: "Test Store 2", storeAddress: "Test Address 2" },
    ];

    const testInventories = [
      { inventoryId: 1, inventoryDate: new Date(), userId: 1, archived: false, storeId: 1 },
    ]

    const testProducts = [
      { productId: 1, productName: "Test Product 1", productBarcode: "123456789", productPrice: 100 },
      { productId: 2, productName: "Test Product 2", productBarcode: "12345678", productPrice: 200 },
      { productId: 3, productName: "Test Product 3", productBarcode: "1234567", productPrice: 300 },
    ];



    // Insert UserRoles
    for (const role of userRoles) {
      await prisma.userRoles.upsert({
        where: { roleId: role.roleId },
        update: {},
        create: role,
      });
    }

    // Insert Admin Users
    for (const user of adminUsers) {
      await prisma.users.upsert({
        where: { userId: user.userId },
        update: {},
        create: user,
      });
    }

    // Insert Test Stores
    for (const store of testStores) {
      await prisma.stores.upsert({
        where: { storeId: store.storeId },
        update: {},
        create: store,
      });
    }

    // Insert Test Inventories
    for (const inventory of testInventories) {
      await prisma.inventories.upsert({
        where: { inventoryId: inventory.inventoryId },
        update: {},
        create: inventory,
      });
    }

    // Insert Test Products
    for (const product of testProducts) {
      await prisma.products.upsert({
        where: { productId: product.productId },
        update: {},
        create: product,
      });
    }
    
    console.log("Predefined data seeded successfully");
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

seedPredefinedData();
