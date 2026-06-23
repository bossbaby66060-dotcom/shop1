-- Seed default categories
INSERT INTO categories (name) VALUES
  ('Suits'),
  ('Clothes'),
  ('Shoes'),
  ('Watches'),
  ('Perfume'),
  ('Hats'),
  ('Sunglasses'),
  ('Hair Products')
ON CONFLICT (name) DO NOTHING;

-- Seed admin password
INSERT INTO settings (key, value) VALUES ('admin_password', 'admin123')
ON CONFLICT (key) DO NOTHING;

-- Seed demo user
INSERT INTO users (email, first_name, last_name, password, join_date) VALUES
  ('john@elawi.com', 'John', 'Doe', 'password123', 'May 2026')
ON CONFLICT (email) DO NOTHING;

-- Seed default products
INSERT INTO products (id, title, category, price, original_price, rating, reviews, color, size, popularity, icon, icon_bg, description) VALUES
  (1, 'Tailored Slim-Fit Suit', 'Suits', 320, 420, 4.9, 187, 'charcoal', 'L', 97, '🕴️', 'linear-gradient(135deg, #2d2a26 0%, #4a4540 100%)', 'An impeccably tailored slim-fit suit in premium Italian wool-blend. Features a two-button single-breasted jacket, flat-front trousers, and a structured notched lapel — built to command every room.'),
  (2, 'Structured Linen Blazer', 'Clothes', 135, NULL, 4.7, 214, 'tan', 'M', 91, '👔', 'linear-gradient(135deg, #cda885 0%, #e8d5bc 100%)', 'A refined relaxed linen blazer with a deconstructed, unlined interior for breathable warm-weather styling. Pair with wide-leg trousers or smart denim for an effortlessly polished look.'),
  (3, 'Oxford Derby Leather Shoes', 'Shoes', 210, 265, 4.8, 156, 'charcoal', '10', 94, '👞', 'linear-gradient(135deg, #1a1614 0%, #3d322b 100%)', 'Handcrafted from full-grain calf leather, these Oxford derbies feature Goodyear-welt construction for superior durability. Almond toe, leather sole, and a mirror-polish finish.'),
  (4, 'Precision Swiss Timepiece', 'Watches', 495, NULL, 5.0, 89, 'gold', 'OS', 99, '⌚', 'linear-gradient(135deg, #b8860b 0%, #dfa124 100%)', 'Swiss-movement luxury dress watch in a 40mm stainless steel case with a sapphire crystal glass. Features an exhibition caseback, genuine leather strap, and 100M water resistance.'),
  (5, 'Signature Eau de Parfum', 'Perfume', 95, NULL, 4.8, 302, 'terracotta', 'OS', 96, '🧴', 'linear-gradient(135deg, #d46a43 0%, #f0a882 100%)', 'A sophisticated unisex fragrance with warm opening notes of bergamot and mandarin, transitioning to a rich heart of cedarwood, leather, and vetiver. Lasts 10–12 hours.'),
  (6, 'Wide-Brim Wool Fedora Hat', 'Hats', 75, 95, 4.6, 128, 'charcoal', 'OS', 85, '🎩', 'linear-gradient(135deg, #2d2a26 0%, #5c5450 100%)', 'A classic wide-brim fedora made from 100% pressed wool felt with a grosgrain ribbon band. Crushable, packable, and season-spanning — the definitive headwear statement piece.'),
  (7, 'Polarized Aviator Sunglasses', 'Sunglasses', 145, NULL, 4.9, 243, 'gold', 'OS', 98, '🕶️', 'linear-gradient(135deg, #4a3b1a 0%, #dfa124 100%)', 'Titanium-framed polarized aviator sunglasses with UV400 protection lenses. Lightweight at just 18g, featuring spring hinges, anti-reflective coating, and a premium leather case.'),
  (8, 'Argan Oil Hair Elixir Set', 'Hair Products', 68, NULL, 4.7, 375, 'terracotta', 'OS', 90, '💆', 'linear-gradient(135deg, #c17f3e 0%, #e8b87a 100%)', 'A premium 3-piece hair care ritual: cold-pressed Moroccan argan oil serum, volumizing shampoo with keratin complex, and a deep-conditioning mask. For all hair types.')
ON CONFLICT (id) DO NOTHING;
