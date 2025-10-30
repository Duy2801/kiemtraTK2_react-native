import { db } from './db';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_uri: string;
  category_id: number;
}

export const ProductRepo = {
  getByCategory: (categoryId: number): Product[] => {
    return db.getAllSync<Product>(
      'SELECT * FROM products WHERE category_id = ?',
      [categoryId]
    );
  },
};
