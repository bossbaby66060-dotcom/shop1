CREATE TABLE "categories" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" bigint PRIMARY KEY,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"price" real NOT NULL,
	"original_price" real,
	"rating" real DEFAULT 4.7,
	"reviews" integer DEFAULT 0,
	"color" text,
	"size" text,
	"popularity" integer DEFAULT 80,
	"icon" text,
	"icon_bg" text,
	"description" text,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"email" text NOT NULL UNIQUE,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"password" text NOT NULL,
	"join_date" text
);
