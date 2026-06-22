import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { categories } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default async (req: Request) => {
  const url = new URL(req.url);
  const nameParam = url.searchParams.get("name");

  try {
    if (req.method === "GET") {
      const rows = await db.select({ name: categories.name }).from(categories).orderBy(categories.id);
      return Response.json(rows.map((r) => r.name));
    }

    if (req.method === "DELETE" && nameParam) {
      await db.delete(categories).where(eq(categories.name, nameParam));
      return Response.json({ success: true });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const name = body?.name?.trim();
      if (!name) {
        return Response.json({ error: "Name is required" }, { status: 400 });
      }
      await db.insert(categories).values({ name }).onConflictDoNothing();
      return Response.json({ success: true, name });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
};

export const config: Config = {
  path: "/api/categories.php",
};
