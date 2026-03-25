require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

function getDatabasePath() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!url.startsWith("file:")) {
    throw new Error("DATABASE_URL must start with file:");
  }
  return url.replace("file:", "");
}

const sqlPath = path.join(__dirname, "..", "prisma", "init.sql");
const sql = fs.readFileSync(sqlPath, "utf8");
const rawPath = getDatabasePath();
const dbPath = path.isAbsolute(rawPath)
  ? rawPath
  : path.join(process.cwd(), rawPath);

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);

db.exec(sql);

db.close();
console.log("Database initialized at", dbPath);
