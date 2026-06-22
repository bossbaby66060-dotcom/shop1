import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { products } from "../../db/schema.js";
import { eq } from "drizzle-orm";

const DEFAULT_PRODUCTS = [
  { id: 1, title: "Tailored Slim-Fit Suit", category: "Suits", price: 320, originalPrice: 420, rating: 4.9, reviews: 187, color: "charcoal", size: "L", popularity: 97, icon: "🕴️", iconBg: "linear-gradient(135deg, #2d2a26 0%, #4a4540 100%)", description: "An impeccably tailored slim-fit suit in premium Italian wool-blend. Features a two-button single-breasted jacket, flat-front trousers, and a structured notched lapel — built to command every room.", image: null },
  { id: 2, title: "Structured Linen Blazer", category: "Clothes", price: 135, originalPrice: null, rating: 4.7, reviews: 214, color: "tan", size: "M", popularity: 91, icon: "👔", iconBg: "linear-gradient(135deg, #cda885 0%, #e8d5bc 100%)", description: "A refined relaxed linen blazer with a deconstructed, unlined interior for breathable warm-weather styling. Pair with wide-leg trousers or smart denim for an effortlessly polished look.", image: null },
  { id: 3, title: "Oxford Derby Leather Shoes", category: "Shoes", price: 210, originalPrice: 265, rating: 4.8, reviews: 156, color: "charcoal", size: "10", popularity: 94, icon: "👞", iconBg: "linear-gradient(135deg, #1a1614 0%, #3d322b 100%)", description: "Handcrafted from full-grain calf leather, these Oxford derbies feature Goodyear-welt construction for superior durability. Almond toe, leather sole, and a mirror-polish finish.", image: null },
  { id: 4, title: "Precision Swiss Timepiece", category: "Watches", price: 495, originalPrice: null, rating: 5.0, reviews: 89, color: "gold", size: "OS", popularity: 99, icon: "⌚", iconBg: "linear-gradient(135deg, #b8860b 0%, #dfa124 100%)", description: "Swiss-movement luxury dress watch in a 40mm stainless steel case with a sapphire crystal glass. Features an exhibition caseback, genuine leather strap, and 100M water resistance.", image: null },
  { id: 5, title: "Signature Eau de Parfum", category: "Perfume", price: 95, originalPrice: null, rating: 4.8, reviews: 302, color: "terracotta", size: "OS", popularity: 96, icon: "🧴", iconBg: "linear-gradient(135deg, #d46a43 0%, #f0a882 100%)", description: "A sophisticated unisex fragrance with warm opening notes of bergamot and mandarin, transitioning to a rich heart of cedarwood, leather, and vetiver. Lasts 10–12 hours.", image: null },
  { id: 6, title: "Wide-Brim Wool Fedora Hat", category: "Hats", price: 75, originalPrice: 95, rating: 4.6, reviews: 128, color: "charcoal", size: "OS", popularity: 85, icon: "🎩", iconBg: "linear-gradient(135deg, #2d2a26 0%, #5c5450 100%)", description: "A classic wide-brim fedora made from 100% pressed wool felt with a grosgrain ribbon band. Crushable, packable, and season-spanning — the definitive headwear statement piece.", image: null },
  { id: 7, title: "Polarized Aviator Sunglasses", category: "Sunglasses", price: 145, originalPrice: null, rating: 4.9, reviews: 243, color: "gold", size: "OS", popularity: 98, icon: "🕶️", iconBg: "linear-gradient(135deg, #4a3b1a 0%, #dfa124 100%)", description: "Titanium-framed polarized aviator sunglasses with UV400 protection lenses. Lightweight at just 18g, featuring spring hinges, anti-reflective coating, and a premium leather case.", image: null },
  { id: 8, title: "Argan Oil Hair Elixir Set", category: "Hair Products", price: 68, originalPrice: null, rating: 4.7, reviews: 375, color: "terracotta", size: "OS", popularity: 90, icon: "💆", iconBg: "linear-gradient(135deg, #c17f3e 0%, #e8b87a 100%)", description: "A premium 3-piece hair care ritual: cold-pressed Moroccan argan oil serum, volumizing shampoo with keratin complex, and a deep-conditioning mask. For all hair types.", image: null },
];

export default async (req: Request) => {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  const idParam = url.searchParams.get("id");

  try {
    if (req.method === "GET") {
      const all = await db.select().from(products);
      return Response.json(all);
    }

    if (req.method === "DELETE" && idParam) {
      const id = Number(idParam);
      await db.delete(products).where(eq(products.id, id));
      return Response.json({ success: true });
    }

    if (req.method === "POST" && action === "reset") {
      await db.delete(products);
      await db.insert(products).values(DEFAULT_PRODUCTS);
      return Response.json({ success: true });
    }

    if (req.method === "POST") {
      const p = await req.json();
      if (!p.id || !p.title || !p.category || p.price === undefined) {
        return Response.json({ error: "Missing required fields" }, { status: 400 });
      }

      const product = {
        id: Number(p.id),
        title: String(p.title),
        category: String(p.category),
        price: Number(p.price),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
        rating: p.rating !== undefined ? Number(p.rating) : 4.7,
        reviews: p.reviews !== undefined ? Number(p.reviews) : 0,
        color: p.color || null,
        size: p.size || null,
        popularity: p.popularity !== undefined ? Number(p.popularity) : 80,
        icon: p.icon || null,
        iconBg: p.iconBg || null,
        description: p.description || null,
        image: p.image || null,
      };

      await db.insert(products)
        .values(product)
        .onConflictDoUpdate({
          target: products.id,
          set: {
            title: product.title,
            category: product.category,
            price: product.price,
            originalPrice: product.originalPrice,
            rating: product.rating,
            reviews: product.reviews,
            color: product.color,
            size: product.size,
            popularity: product.popularity,
            icon: product.icon,
            iconBg: product.iconBg,
            description: product.description,
            image: product.image,
          },
        });

      const [result] = await db.select().from(products).where(eq(products.id, product.id));
      return Response.json(result);
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
};

export const config: Config = {
  path: "/api/products.php",
};
