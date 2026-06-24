import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'data.json');
const JWT_SECRET = process.env.JWT_SECRET || 'khanh-spa-dev-secret';
const PORT = process.env.PORT || 5001;

const app = express();
app.use(cors());
app.use(express.json());

const readDb = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

const writeDb = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

const ensureAdminPassword = () => {
  const db = readDb();
  const admin = db.users.find((u) => u.email === 'admin@admin.com');
  if (admin && !admin.password.startsWith('$2a$')) {
    admin.password = bcrypt.hashSync('admin123', 10);
    writeDb(db);
  } else if (admin && admin.password.includes('PLACEHOLDER')) {
    admin.password = bcrypt.hashSync('admin123', 10);
    writeDb(db);
  }
};

ensureAdminPassword();

const DEV_ADMIN = { _id: 'u1', email: 'admin@admin.com', role: 'admin', name: 'Admin' };

const resolveUser = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
      return next();
    } catch {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }
  }
  req.user = DEV_ADMIN;
  next();
};

const auth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Chưa đăng nhập' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Không có quyền truy cập' });
  }
  next();
};

const sanitizeUser = (user) => {
  const { password, ...safe } = user;
  return safe;
};

// ── Auth ─────────────────────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Thiếu thông tin đăng ký' });
  }
  const db = readDb();
  if (db.users.some((u) => u.email === email)) {
    return res.status(400).json({ message: 'Email đã được sử dụng' });
  }
  const user = {
    _id: randomUUID(),
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role: 'user',
  };
  db.users.push(user);
  writeDb(db);
  res.status(201).json({ message: 'Đăng ký thành công', user: sanitizeUser(user) });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  const user = db.users.find((u) => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
  }
  const token = jwt.sign(
    { _id: user._id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({
    message: 'Đăng nhập thành công',
    token,
    user: sanitizeUser(user),
  });
});

// ── Products ─────────────────────────────────────────────────
app.get('/api/products', (_req, res) => {
  const { products } = readDb();
  res.json(products);
});

app.post('/api/products', resolveUser, adminOnly, (req, res) => {
  const db = readDb();
  const product = {
    _id: randomUUID(),
    ...req.body,
    thumbnail: req.body.thumbnail || req.body.image,
    categoryId: req.body.categoryId || null,
  };
  db.products.push(product);
  writeDb(db);
  res.status(201).json(product);
});

app.put('/api/products/:id', resolveUser, adminOnly, (req, res) => {
  const db = readDb();
  const idx = db.products.findIndex((p) => p._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  db.products[idx] = {
    ...db.products[idx],
    ...req.body,
    _id: db.products[idx]._id,
    thumbnail: req.body.thumbnail || req.body.image || db.products[idx].thumbnail,
  };
  writeDb(db);
  res.json(db.products[idx]);
});

app.delete('/api/products/:id', resolveUser, adminOnly, (req, res) => {
  const db = readDb();
  const before = db.products.length;
  db.products = db.products.filter((p) => p._id !== req.params.id);
  if (db.products.length === before) {
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  }
  writeDb(db);
  res.json({ message: 'Đã xóa sản phẩm' });
});

// ── Categories ─────────────────────────────────────────────────
app.get('/api/categories', (_req, res) => {
  res.json(readDb().categories);
});

app.post('/api/categories', resolveUser, adminOnly, (req, res) => {
  const db = readDb();
  const category = { _id: randomUUID(), ...req.body };
  db.categories.push(category);
  writeDb(db);
  res.status(201).json(category);
});

app.put('/api/categories/:id', resolveUser, adminOnly, (req, res) => {
  const db = readDb();
  const idx = db.categories.findIndex((c) => c._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
  db.categories[idx] = { ...db.categories[idx], ...req.body, _id: db.categories[idx]._id };
  writeDb(db);
  res.json(db.categories[idx]);
});

app.delete('/api/categories/:id', resolveUser, adminOnly, (req, res) => {
  const db = readDb();
  db.categories = db.categories.filter((c) => c._id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Đã xóa danh mục' });
});

// ── Users ──────────────────────────────────────────────────────
app.get('/api/users', resolveUser, adminOnly, (_req, res) => {
  res.json(readDb().users.map(sanitizeUser));
});

app.put('/api/users/:id', resolveUser, adminOnly, (req, res) => {
  const db = readDb();
  const idx = db.users.findIndex((u) => u._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  db.users[idx] = { ...db.users[idx], ...req.body, _id: db.users[idx]._id };
  writeDb(db);
  res.json(sanitizeUser(db.users[idx]));
});

app.put('/api/users/:id/role', resolveUser, adminOnly, (req, res) => {
  const db = readDb();
  const user = db.users.find((u) => u._id === req.params.id);
  if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  user.role = req.body.role;
  writeDb(db);
  res.json(sanitizeUser(user));
});

app.put('/api/users/:id/password', resolveUser, adminOnly, (req, res) => {
  const db = readDb();
  const user = db.users.find((u) => u._id === req.params.id);
  if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  user.password = bcrypt.hashSync(req.body.newPassword, 10);
  writeDb(db);
  res.json({ message: 'Đổi mật khẩu thành công' });
});

app.delete('/api/users/:id', resolveUser, adminOnly, (req, res) => {
  const db = readDb();
  db.users = db.users.filter((u) => u._id !== req.params.id);
  writeDb(db);
  res.json({ message: 'Đã xóa người dùng' });
});

// ── Orders ─────────────────────────────────────────────────────
app.get('/api/orders', resolveUser, adminOnly, (_req, res) => {
  res.json(readDb().orders);
});

app.post('/api/orders', auth, (req, res) => {
  const { items = [] } = req.body;
  if (!items.length) {
    return res.status(400).json({ message: 'Giỏ hàng trống' });
  }

  const db = readDb();
  const user = db.users.find((u) => u._id === req.user._id);
  const orderItems = [];
  let totalPrice = 0;

  for (const item of items) {
    const product = db.products.find((p) => p._id === item.productId);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong đơn hàng' });
    }
    const qty = item.quantity || 1;
    const priceAtPurchase = product.price;
    totalPrice += priceAtPurchase * qty;
    orderItems.push({
      productId: product,
      quantity: qty,
      priceAtPurchase,
    });
  }

  const order = {
    _id: randomUUID(),
    userId: user ? sanitizeUser(user) : { _id: req.user._id, name: req.user.name, email: req.user.email },
    items: orderItems,
    totalPrice,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  db.orders.unshift(order);
  db.carts[req.user._id] = [];
  writeDb(db);
  res.status(201).json(order);
});

app.patch('/api/orders/:id/status', resolveUser, adminOnly, (req, res) => {
  const db = readDb();
  const order = db.orders.find((o) => o._id === req.params.id);
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  order.status = req.body.status;
  writeDb(db);
  res.json(order);
});

// ── Cart ───────────────────────────────────────────────────────
const getCart = (db, userId) => {
  if (!db.carts[userId]) db.carts[userId] = [];
  return db.carts[userId];
};

app.get('/api/cart', auth, (req, res) => {
  const db = readDb();
  res.json({ items: getCart(db, req.user._id) });
});

app.post('/api/cart/items', auth, (req, res) => {
  const { productId, quantity } = req.body;
  const db = readDb();
  const product = db.products.find((p) => p._id === productId);
  if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  const cart = getCart(db, req.user._id);
  const existing = cart.find((i) => (i.productId?._id || i.productId) === productId);
  if (existing) {
    existing.quantity += quantity || 1;
  } else {
    cart.push({ productId: product, quantity: quantity || 1, price: product.price });
  }
  writeDb(db);
  res.json({ items: cart });
});

app.put('/api/cart/items/:productId', auth, (req, res) => {
  const db = readDb();
  const cart = getCart(db, req.user._id);
  const item = cart.find((i) => (i.productId?._id || i.productId) === req.params.productId);
  if (!item) return res.status(404).json({ message: 'Sản phẩm không có trong giỏ' });
  item.quantity = req.body.quantity;
  writeDb(db);
  res.json({ items: cart });
});

app.delete('/api/cart/items/:productId', auth, (req, res) => {
  const db = readDb();
  db.carts[req.user._id] = getCart(db, req.user._id).filter(
    (i) => (i.productId?._id || i.productId) !== req.params.productId
  );
  writeDb(db);
  res.json({ items: db.carts[req.user._id] });
});

app.delete('/api/cart', auth, (req, res) => {
  const db = readDb();
  db.carts[req.user._id] = [];
  writeDb(db);
  res.json({ message: 'Đã xóa giỏ hàng' });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
