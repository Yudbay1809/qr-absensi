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
      username: "admin",
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
      username: "karyawan",
      email: "karyawan@gwenabsensi.com",
      passwordHash: employeePassword,
      role: "EMPLOYEE",
    },
  });

  const defaultShift = await prisma.shift.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Shift Reguler",
      workStart: "09:00",
      breakStart: "12:00",
      breakEnd: "13:00",
      workEnd: "17:00",
      isActive: true,
    },
  });

  await prisma.settings.upsert({
    where: { id: 1 },
    update: { defaultShiftId: defaultShift.id },
    create: {
      defaultShiftId: defaultShift.id,
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
