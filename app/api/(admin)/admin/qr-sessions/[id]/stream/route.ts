import { prisma } from "@/lib/public/prisma";
import { getSessionUser } from "@/lib/user/session";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return new Response("Forbidden", { status: 403 });
  }

  const { id } = await params;
  const sessionId = Number(id);
  const encoder = new TextEncoder();

  let lastId = 0;
  let interval: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      const tick = async () => {
        const rows = await prisma.attendance.findMany({
          where: { qrSessionId: sessionId, id: { gt: lastId } },
          orderBy: { id: "asc" },
          include: { user: true },
        });

        if (rows.length > 0) {
          lastId = rows[rows.length - 1].id;
          send({ items: rows });
        }
      };

      interval = setInterval(() => {
        tick().catch(() => undefined);
      }, 2000);

      tick().catch(() => undefined);

      req.signal.addEventListener("abort", () => {
        if (interval) clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
