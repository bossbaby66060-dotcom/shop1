const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware for parsing JSON and urlencoded data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    title: "Tailored Slim-Fit Suit",
    category: "Suits",
    price: 320.00,
    originalPrice: 420.00,
    rating: 4.9,
    reviews: 187,
    color: "charcoal",
    size: "L",
    popularity: 97,
    icon: "🕴️",
    iconBg: "linear-gradient(135deg, #2d2a26 0%, #4a4540 100%)",
    description: "An impeccably tailored slim-fit suit in premium Italian wool-blend. Features a two-button single-breasted jacket, flat-front trousers, and a structured notched lapel — built to command every room."
  },
  {
    id: 2,
    title: "Structured Linen Blazer",
    category: "Clothes",
    price: 135.00,
    originalPrice: null,
    rating: 4.7,
    reviews: 214,
    color: "tan",
    size: "M",
    popularity: 91,
    icon: "👔",
    iconBg: "linear-gradient(135deg, #cda885 0%, #e8d5bc 100%)",
    description: "A refined relaxed linen blazer with a deconstructed, unlined interior for breathable warm-weather styling. Pair with wide-leg trousers or smart denim for an effortlessly polished look."
  },
  {
    id: 3,
    title: "Oxford Derby Leather Shoes",
    category: "Shoes",
    price: 210.00,
    originalPrice: 265.00,
    rating: 4.8,
    reviews: 156,
    color: "charcoal",
    size: "10",
    popularity: 94,
    icon: "👞",
    iconBg: "linear-gradient(135deg, #1a1614 0%, #3d322b 100%)",
    description: "Handcrafted from full-grain calf leather, these Oxford derbies feature Goodyear-welt construction for superior durability. Almond toe, leather sole, and a mirror-polish finish."
  },
  {
    id: 4,
    title: "Precision Swiss Timepiece",
    category: "Watches",
    price: 495.00,
    originalPrice: null,
    rating: 5.0,
    reviews: 89,
    color: "gold",
    size: "OS",
    popularity: 99,
    icon: "⌚",
    iconBg: "linear-gradient(135deg, #b8860b 0%, #dfa124 100%)",
    description: "Swiss-movement luxury dress watch in a 40mm stainless steel case with a sapphire crystal glass. Features an exhibition caseback, genuine leather strap, and 100M water resistance."
  },
  {
    id: 5,
    title: "Signature Eau de Parfum",
    category: "Perfume",
    price: 95.00,
    originalPrice: null,
    rating: 4.8,
    reviews: 302,
    color: "terracotta",
    size: "OS",
    popularity: 96,
    icon: "🧴",
    iconBg: "linear-gradient(135deg, #d46a43 0%, #f0a882 100%)",
    description: "A sophisticated unisex fragrance with warm opening notes of bergamot and mandarin, transitioning to a rich heart of cedarwood, leather, and vetiver. Lasts 10–12 hours."
  },
  {
    id: 6,
    title: "Wide-Brim Wool Fedora Hat",
    category: "Hats",
    price: 75.00,
    originalPrice: 95.00,
    rating: 4.6,
    reviews: 128,
    color: "charcoal",
    size: "OS",
    popularity: 85,
    icon: "🎩",
    iconBg: "linear-gradient(135deg, #2d2a26 0%, #5c5450 100%)",
    description: "A classic wide-brim fedora made from 100% pressed wool felt with a grosgrain ribbon band. Crushable, packable, and season-spanning — the definitive headwear statement piece."
  },
  {
    id: 7,
    title: "Polarized Aviator Sunglasses",
    category: "Sunglasses",
    price: 145.00,
    originalPrice: null,
    rating: 4.9,
    reviews: 243,
    color: "gold",
    size: "OS",
    popularity: 98,
    icon: "🕶️",
    iconBg: "linear-gradient(135deg, #4a3b1a 0%, #dfa124 100%)",
    description: "Titanium-framed polarized aviator sunglasses with UV400 protection lenses. Lightweight at just 18g, featuring spring hinges, anti-reflective coating, and a premium leather case."
  },
  {
    id: 8,
    title: "Argan Oil Hair Elixir Set",
    category: "Hair Products",
    price: 68.00,
    originalPrice: null,
    rating: 4.7,
    reviews: 375,
    color: "terracotta",
    size: "OS",
    popularity: 90,
    icon: "💆",
    iconBg: "linear-gradient(135deg, #c17f3e 0%, #e8b87a 100%)",
    description: "A premium 3-piece hair care ritual: cold-pressed Moroccan argan oil serum, volumizing shampoo with keratin complex, and a deep-conditioning mask. For all hair types."
  }
];

const DEFAULT_CATEGORIES = ['Suits', 'Clothes', 'Shoes', 'Watches', 'Perfume', 'Hats', 'Sunglasses', 'Hair Products'];

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database with default data if file doesn't exist
function initDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      products: DEFAULT_PRODUCTS,
      categories: DEFAULT_CATEGORIES,
      users: [
        {
          email: "john@elawi.com",
          firstName: "John",
          lastName: "Doe",
          password: "password123",
          joinDate: "May 2026"
        }
      ],
      settings: {
        admin_password: "admin123"
      }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
  }
}

function readData() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      initDatabase();
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading database file:', err);
    return { products: [], categories: [], users: [], settings: {} };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

function saveBase64Image(base64Data, productId) {
  if (!base64Data || !base64Data.startsWith('data:image/')) {
    return base64Data; // Return as-is if it's already a URL or empty
  }
  
  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return base64Data;
    }
    
    const type = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    
    let ext = 'jpg';
    if (type.includes('png')) ext = 'png';
    else if (type.includes('webp')) ext = 'webp';
    else if (type.includes('gif')) ext = 'gif';
    
    const filename = `img-${productId}-${Date.now()}.${ext}`;
    const filepath = path.join(uploadsDir, filename);
    
    fs.writeFileSync(filepath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Error saving base64 image:', err);
    return null;
  }
}

function deleteProductImageFile(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) return;
  try {
    const filepath = path.join(__dirname, imageUrl.substring(1)); // strip leading slash
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  } catch (err) {
    console.error('Error deleting image file:', err);
  }
}

// Serve static uploads
app.use('/uploads', express.static(uploadsDir));

// --- PRODUCTS API ---
app.get('/api/products', (req, res) => {
  try {
    const data = readData();
    res.json(data.products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const p = req.body;
    if (!p.id || !p.title || !p.category || p.price === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const data = readData();
    const idx = data.products.findIndex(item => item.id === Number(p.id));

    let imagePath = p.image || null;
    if (p.image && p.image.startsWith('data:image/')) {
      imagePath = saveBase64Image(p.image, p.id);
      // Delete old file if updating
      if (idx > -1 && data.products[idx].image && data.products[idx].image !== imagePath) {
        deleteProductImageFile(data.products[idx].image);
      }
    }

    const product = {
      id: Number(p.id),
      title: p.title,
      category: p.category,
      price: Number(p.price),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
      rating: p.rating ? Number(p.rating) : 4.7,
      reviews: p.reviews ? Number(p.reviews) : 0,
      color: p.color || null,
      size: p.size || null,
      popularity: p.popularity ? Number(p.popularity) : 80,
      icon: p.icon || null,
      iconBg: p.iconBg || null,
      description: p.description || null,
      image: imagePath
    };

    if (idx > -1) {
      data.products[idx] = product;
    } else {
      data.products.push(product);
    }

    writeData(data);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = readData();
    const idx = data.products.findIndex(item => item.id === id);
    if (idx > -1) {
      if (data.products[idx].image) {
        deleteProductImageFile(data.products[idx].image);
      }
      data.products.splice(idx, 1);
      writeData(data);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products/reset', (req, res) => {
  try {
    const data = readData();
    
    // Clean up uploaded image files
    data.products.forEach(p => {
      if (p.image) {
        deleteProductImageFile(p.image);
      }
    });

    data.products = DEFAULT_PRODUCTS;
    data.categories = DEFAULT_CATEGORIES;
    writeData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CATEGORIES API ---
app.get('/api/categories', (req, res) => {
  try {
    const data = readData();
    res.json(data.categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/categories', (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const data = readData();
    if (!data.categories.includes(name.trim())) {
      data.categories.push(name.trim());
      writeData(data);
    }
    res.json({ success: true, name: name.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/categories/:name', (req, res) => {
  try {
    const name = req.params.name;
    const data = readData();
    data.categories = data.categories.filter(c => c !== name);
    writeData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- USERS API ---
app.post('/api/users/register', (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const data = readData();
    if (data.users.find(u => u.email === cleanEmail)) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const joinDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const newUser = { email: cleanEmail, firstName: firstName.trim(), lastName: lastName.trim(), password, joinDate };
    data.users.push(newUser);
    writeData(data);
    res.json({ success: true, user: { firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email, joinDate } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const data = readData();
    const user = data.users.find(u => u.email === cleanEmail && u.password === password);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    res.json({ success: true, user: { firstName: user.firstName, lastName: user.lastName, email: user.email, joinDate: user.joinDate } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users/update', (req, res) => {
  try {
    const { currentEmail, firstName, lastName, email, password } = req.body;
    if (!currentEmail || !firstName || !lastName || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const cleanCurrent = currentEmail.trim().toLowerCase();
    const cleanNew = email.trim().toLowerCase();
    const data = readData();

    if (cleanNew !== cleanCurrent && data.users.find(u => u.email === cleanNew)) {
      return res.status(400).json({ error: 'Email already registered by another account' });
    }

    const idx = data.users.findIndex(u => u.email === cleanCurrent);
    if (idx === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    data.users[idx].firstName = firstName.trim();
    data.users[idx].lastName = lastName.trim();
    data.users[idx].email = cleanNew;
    if (password) {
      data.users[idx].password = password;
    }

    writeData(data);
    res.json({ success: true, user: { firstName: data.users[idx].firstName, lastName: data.users[idx].lastName, email: data.users[idx].email, joinDate: data.users[idx].joinDate } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADMIN API ---
app.post('/api/admin/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const data = readData();
    const currentPass = data.settings.admin_password || 'admin123';
    if (username === 'admin' && password === currentPass) {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/change-password', (req, res) => {
  try {
    const { password } = req.body;
    if (!password || !password.trim()) {
      return res.status(400).json({ error: 'Password cannot be empty' });
    }
    const data = readData();
    data.settings.admin_password = password;
    writeData(data);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware to serve static files with clean URLs (e.g. /shop serves shop.html)
app.use((req, res, next) => {
  if (req.method === 'GET' && !path.extname(req.path)) {
    const cleanPath = req.path === '/' ? 'index.html' : req.path.substring(1) + '.html';
    const filePath = path.join(__dirname, cleanPath);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
  }
  next();
});

// Serve regular static files
app.use(express.static(__dirname));

// Default fallback 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Initialize database then start server
initDatabase();
app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`  ELAWI FULL-STACK EXPRESS SERVER IS RUNNING`);
  console.log(`  Url: http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});
