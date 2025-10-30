import { db } from "./db";

export interface Category {
  id: number;
  name: string;
  remote_id?: string;
  update_at?: string;
}

export const CategoryRepo = {
  getAll: (): Category[] => {
    return db.getAllSync<Category>('SELECT * FROM cart_categories');
  },
};
