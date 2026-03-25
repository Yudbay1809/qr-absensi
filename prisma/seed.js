require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const employeePassword = await bcrypt.hash("karyawan123", 10);

  await prisma.user.upsert({
    where: { email: "admin@gwenabsensi.com" },
    update: {},
    create: {
      name: "Admin Gwen",
      email: "admin@gwenabsensi.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "karyawan@gwenabsensi.com" },
    update: {},
    create: {
      name: "Karyawan Demo",
      email: "karyawan@gwenabsensi.com",
      passwordHash: employeePassword,
      role: "EMPLOYEE",
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
