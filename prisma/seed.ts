import pkg from "@prisma/client";
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
        password: "$2a$12$MxOp73piSxGiWfuwx0X5T.e3jbhO6xrJW0ThSUUokz48Ao5vNCQgS",
        roleId: 5001,
        Stores: [1, 2],
        Inventories: [1, 2],
      },
      {
        userId: 2,
        firstName: "Test Sale",
        lastName: "User",
        email: "sulovic@outlook.com",
        password: "$2a$12$MxOp73piSxGiWfuwx0X5T.e3jbhO6xrJW0ThSUUokz48Ao5vNCQgS",
        roleId: 1001,
        Stores: [1],
      },
    ];

    const testStores = [
      { storeId: 1, storeName: "Test Store 1", storeAddress: "Test Address 1" },
      { storeId: 2, storeName: "Test Store 2", storeAddress: "Test Address 2" },
    ];

    const testInventories = [
      { inventoryId: 1, inventoryDate: new Date(), creatorId: 1, archived: false, storeId: 1 },
      { inventoryId: 2, inventoryDate: new Date(), creatorId: 1, archived: false, storeId: 2 },
    ];

    const testProducts = [
      {
        productId: 1,
        productName: "Test Product 1",
        productBarcode: "123456789",
        productPrice: 100,
        productUrl: "test-product-1",
        productDesc: "Test Product 1 Description",
      },
      {
        productId: 2,
        productName: "Test Product 2",
        productBarcode: "12345678",
        productPrice: 200,
        productUrl: "test-product-2",
        productDesc: "Test Product 2 Description",
      },
      {
        productId: 3,
        productName: "Test Product 3",
        productBarcode: "1234567",
        productPrice: 300,
        productUrl: "test-product-3",
        productDesc: "Test Product 3 Description",
      },
    ];

    const testCategories = [
      { categoryId: 1, categoryName: "Test Category 1", categoryPath: "test-category-1" },
      { categoryId: 2, categoryName: "Test Category 2", categoryPath: "test-category-2" },
      { categoryId: 3, categoryName: "Test Category 3", categoryPath: "test-category-1/test-category-3" },
      { categoryId: 4, categoryName: "Test Category 4", categoryPath: "test-category-1/test-category-4" },
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
        create: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          roleId: user.roleId,
        },
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

    // Connect Users to Stores and Inventories

    for (const user of adminUsers) {
      if (user.Stores) {
        await prisma.users.update({
          where: { userId: user.userId },
          data: {
            Stores: {
              connect: user.Stores.map((storeId) => ({ storeId })),
            },
          },
        });
      }

      if (user.Inventories) {
        await prisma.users.update({
          where: { userId: user.userId },
          data: {
            Inventories: {
              connect: user.Inventories.map((inventoryId) => ({ inventoryId })),
            },
          },
        });
      }
    }

    // Insert Test Products
    for (const product of testProducts) {
      await prisma.products.upsert({
        where: { productId: product.productId },
        update: {},
        create: product,
      });
    }

    // Insert Test Categories
    for (const category of testCategories) {
      await prisma.categories.upsert({
        where: { categoryId: category.categoryId },
        update: {},
        create: category,
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
