export interface Product {
    id: string;               // TEXT trong DB
    name: string;
    price: number;
    init: string;
    description?: string;
    image_uri?: string;
    category_id: number;
    category_name?: string;   // JOIN thêm từ bảng category
    remote_id?: string;
    update_at?: string;
    is_deleted?: number;      // 0 hoặc 1
  }
  
  export interface Category {
    id: number;
    name: string;
    remote_id?: string;
    update_at?: string;
  }
  