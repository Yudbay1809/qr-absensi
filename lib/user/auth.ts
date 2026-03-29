import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const sessionCookieName = "gwen_session";

const getSecret = () => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
};

export const authConfig = {
  sessionCookieName,
  sessionDurationSeconds: 60 * 60 * 8,
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: {
  userId: number;
  role: "ADMIN" | "EMPLOYEE";
  email: string;
  name: string;
}) {
  return new SignJWT({
    sub: String(payload.userId),
    role: payload.role,
    email: payload.email,
    name: payload.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${authConfig.sessionDurationSeconds}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  const result = await jwtVerify(token, getSecret());
  return result.payload as {
    sub: string;
    role: "ADMIN" | "EMPLOYEE";
    email: string;
    name: string;
    exp: number;
  };
}

