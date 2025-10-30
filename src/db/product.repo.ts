import { db } from './db';

export interface Product {
  id?: string;          // TEXT PRIMARY KEY trong DB
  name: string;
  price: number;
  init: string;         
  description?: string;
  image_uri?: string;
  category_id: number;
  remote_id?: string;
  update_at?: string;
  is_deleted?: number;
}

export const ProductRepo = {
  getAll: (): Product[] => {
    return db.getAllSync<Product>(
      'SELECT * FROM products WHERE is_deleted = 0'
    );
  },

  getByCategory: (categoryId: number): Product[] => {
    return db.getAllSync<Product>(
      'SELECT * FROM products WHERE category_id = ? AND is_deleted = 0',
      [categoryId]
    );
  },
  getById: (id: string): Product | null => {
    const result = db.getFirstSync<Product>(
      'SELECT * FROM products WHERE id = ? AND is_deleted = 0',
      [id]
    );
    return result ?? null;
  },

  create: (product: Omit<Product, 'id' | 'update_at' | 'is_deleted'>) => {
    const id = `p${Date.now()}`; // Tạo ID duy nhất
    db.runSync(
      `INSERT INTO products (id, name, price, init, description, image_uri, category_id, is_deleted)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        id,
        product.name,
        product.price,
        product.init || 'default',
        product.description ?? '',
        product.image_uri ?? '',
        product.category_id,
      ]
    );
  },
  
  update: (product: Product) => {
    db.runSync(
      `UPDATE products
       SET name = ?, price = ?, init = ?, description = ?, image_uri = ?, 
           category_id = ?, update_at = ?
       WHERE id = ?`,
      [
        product.name,
        product.price,
        product.init,
        product.description ?? '',
        product.image_uri ?? '',
        product.category_id,
        new Date().toISOString(),
        product.id,
      ]
    );
  },

  delete: (id: string) => {
    db.runSync('UPDATE products SET is_deleted = 1 WHERE id = ?', [id]);
  },
};
