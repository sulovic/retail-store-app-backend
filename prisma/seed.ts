import pkg from '@prisma/client';
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
        roleId: 5001,
      },
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
