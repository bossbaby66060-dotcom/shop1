import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const { email, password, firstName, lastName, currentEmail } = body;

    // Update user account
    if (currentEmail) {
      if (!firstName || !lastName || !email) {
        return Response.json({ error: "Missing required fields" }, { status: 400 });
      }
      const cleanCurrent = currentEmail.trim().toLowerCase();
      const cleanNew = email.trim().toLowerCase();

      if (cleanNew !== cleanCurrent) {
        const existing = await db.select().from(users).where(eq(users.email, cleanNew));
        if (existing.length > 0) {
          return Response.json({ error: "Email already registered by another account" }, { status: 400 });
        }
      }

      const current = await db.select().from(users).where(eq(users.email, cleanCurrent));
      if (current.length === 0) {
        return Response.json({ error: "User not found" }, { status: 404 });
      }

      const updateData: Record<string, string> = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: cleanNew,
      };
      if (password) updateData.password = password;

      await db.update(users).set(updateData).where(eq(users.email, cleanCurrent));
      const [updated] = await db.select().from(users).where(eq(users.email, cleanNew));
      return Response.json({
        success: true,
        user: { firstName: updated.firstName, lastName: updated.lastName, email: updated.email, joinDate: updated.joinDate },
      });
    }

    // Register new user
    if (firstName) {
      if (!lastName || !email || !password) {
        return Response.json({ error: "All fields are required" }, { status: 400 });
      }
      const cleanEmail = email.trim().toLowerCase();
      const existing = await db.select().from(users).where(eq(users.email, cleanEmail));
      if (existing.length > 0) {
        return Response.json({ error: "Email already registered" }, { status: 400 });
      }
      const joinDate = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
      const [newUser] = await db
        .insert(users)
        .values({ email: cleanEmail, firstName: firstName.trim(), lastName: lastName.trim(), password, joinDate })
        .returning();
      return Response.json({
        success: true,
        user: { firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email, joinDate },
      });
    }

    // Login
    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }
    const cleanEmail = email.trim().toLowerCase();
    const [user] = await db.select().from(users).where(eq(users.email, cleanEmail));
    if (!user || user.password !== password) {
      return Response.json({ error: "Invalid email or password" }, { status: 400 });
    }
    return Response.json({
      success: true,
      user: { firstName: user.firstName, lastName: user.lastName, email: user.email, joinDate: user.joinDate },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
};

export const config: Config = {
  path: "/api/users.php",
};
