import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { settings } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();

    // Change admin password
    if (body.action === "change_password") {
      const newPassword = body.newPassword?.trim();
      if (!newPassword) {
        return Response.json({ error: "Password cannot be empty" }, { status: 400 });
      }
      await db.update(settings).set({ value: newPassword }).where(eq(settings.key, "admin_password"));
      return Response.json({ success: true });
    }

    // Admin login
    const { username, password } = body;
    if (!username || !password) {
      return Response.json({ error: "Username and password are required" }, { status: 400 });
    }

    const [setting] = await db.select().from(settings).where(eq(settings.key, "admin_password"));
    const adminPassword = setting?.value ?? "admin123";

    if (username === "admin" && password === adminPassword) {
      return Response.json({ success: true });
    }
    return Response.json({ error: "Invalid username or password" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
};

export const config: Config = {
  path: "/api/admin.php",
};
