import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('shopping.db');

export const initDb = () => {
  db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS cart_categories(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      remote_id TEXT,
      update_at TEXT
    );

    CREATE TABLE IF NOT EXISTS products(
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL CHECK(price >= 0),
      init TEXT NOT NULL,
      description TEXT,
      image_uri TEXT,
      category_id INTEGER NOT NULL REFERENCES cart_categories(id) ON DELETE CASCADE,
      remote_id TEXT,
      update_at TEXT,
      is_deleted INTEGER DEFAULT 0
    );
  `);

  // Thêm dữ liệu mẫu
  db.execAsync(`
    INSERT OR IGNORE INTO cart_categories (id, name, remote_id, update_at)
    VALUES
      (1, 'Điện thoại', 'r1', '2025-10-30'),
      (2, 'Thời trang', 'r2', '2025-10-30'),
      (3, 'Sách', 'r3', '2025-10-30');

    INSERT OR IGNORE INTO products (id, name, price, init, description, image_uri, category_id, remote_id, update_at)
    VALUES
      ('p1', 'iPhone 15', 999.99, 'Apple', 'Điện thoại mới nhất của Apple', 'https://example.com/iphone.jpg', 1, 'rp1', '2025-10-30'),
      ('p2', 'MacBook Air', 1299.00, 'Apple', 'Laptop mỏng nhẹ hiệu năng cao', 'https://example.com/macbook.jpg', 1, 'rp2', '2025-10-30'),
      ('p3', 'Áo thun Uniqlo', 19.99, 'Uniqlo', 'Áo cotton thoáng mát', 'https://example.com/tshirt.jpg', 2, 'rp3', '2025-10-30'),
      ('p4', 'Quần jeans Levis', 49.99, 'Levis', 'Quần bò cao cấp', 'https://example.com/jeans.jpg', 2, 'rp4', '2025-10-30'),
      ('p5', 'Atomic Habits', 15.50, 'James Clear', 'Sách self-help nổi tiếng', 'https://example.com/book.jpg', 3, 'rp5', '2025-10-30');
  `);
};
