import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gwen_session")?.value;
  if (!token) return null;

  try {
    const payload = await verifySessionToken(token);
    return {
      userId: Number(payload.sub),
      role: payload.role,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
}
