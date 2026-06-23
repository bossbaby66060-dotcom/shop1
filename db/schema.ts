import { pgTable, bigint, text, real, integer, serial } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  price: real("price").notNull(),
  originalPrice: real("original_price"),
  rating: real("rating").default(4.7),
  reviews: integer("reviews").default(0),
  color: text("color"),
  size: text("size"),
  popularity: integer("popularity").default(80),
  icon: text("icon"),
  iconBg: text("icon_bg"),
  description: text("description"),
  image: text("image"),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  password: text("password").notNull(),
  joinDate: text("join_date"),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
