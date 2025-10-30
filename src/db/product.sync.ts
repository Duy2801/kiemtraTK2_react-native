// ===============================
// ⚙️ Cấu hình API
// ===============================
const MOCKAPI_BASE_URL = 'https://6832adf5c3f2222a8cb30fd1.mockapi.io';
const PRODUCTS_ENDPOINT = `${MOCKAPI_BASE_URL}/products`;

// ===============================
// 🧩 Kiểu dữ liệu
// ===============================
export interface ApiProduct {
  id: string;
  name: string;
  price: number;
  init: string;
  description?: string;
  image_uri?: string;
  category_id: number;
  is_deleted: number;
  update_at?: string;
}

// ===============================
// 🌐 API Functions
// ===============================

// 🧠 Lấy tất cả sản phẩm từ API
export async function fetchProductsFromAPI(): Promise<ApiProduct[]> {
  try {
    const response = await fetch(PRODUCTS_ENDPOINT);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Error fetching products from API:', error);
    throw error;
  }
}

// ➕ Thêm sản phẩm lên API
export async function addProductToAPI(product: ApiProduct): Promise<ApiProduct> {
  try {
    const response = await fetch(PRODUCTS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Error adding product to API:', error);
    throw error;
  }
}

// 🔁 Cập nhật sản phẩm trên API
export async function updateProductOnAPI(id: string, product: Partial<ApiProduct>): Promise<ApiProduct> {
  try {
    const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Error updating product on API:', error);
    throw error;
  }
}

// ❌ Xóa sản phẩm trên API
export async function deleteProductFromAPI(id: string): Promise<void> {
  try {
    const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  } catch (error) {
    console.error('❌ Error deleting product from API:', error);
    throw error;
  }
}

// ===============================
// 🔄 Đồng bộ DỮ LIỆU
// ===============================

// 🡳 Đồng bộ từ API xuống Local
export async function syncFromAPI() {
  try {
    const apiProducts = await fetchProductsFromAPI();
    const { initDb } = require('./db');
    const database = await initDb();

    await database.runAsync('DELETE FROM products');

    for (const p of apiProducts) {
      await database.runAsync(
        `INSERT INTO products (id, name, price, init, description, image_uri, category_id, is_deleted, update_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id,
          p.name,
          p.price,
          p.init,
          p.description ?? '',
          p.image_uri ?? '',
          p.category_id,
          p.is_deleted ?? 0,
          p.update_at ?? new Date().toISOString(),
        ]
      );
    }

    return {
      success: true,
      message: `✅ Đã đồng bộ ${apiProducts.length} sản phẩm từ server`,
      count: apiProducts.length,
    };
  } catch (error) {
    console.error('❌ Lỗi đồng bộ từ API:', error);
    return { success: false, message: `❌ Lỗi đồng bộ: ${error}`, count: 0 };
  }
}

// 🡱 Đồng bộ từ Local lên API
export async function syncToAPI() {
  try {
    const { ProductRepo } = require('./product.repo');
    const localProducts = await ProductRepo.getAll();

    // Xóa toàn bộ sản phẩm cũ trên server
    const apiProducts = await fetchProductsFromAPI();
    for (const api of apiProducts) {
      await deleteProductFromAPI(api.id);
    }

    // Đẩy toàn bộ sản phẩm local lên API
    for (const p of localProducts) {
      await addProductToAPI({
        id: p.id ?? `p${Date.now()}`,
        name: p.name,
        price: p.price,
        init: p.init,
        description: p.description,
        image_uri: p.image_uri,
        category_id: p.category_id,
        is_deleted: p.is_deleted ?? 0,
        update_at: p.update_at ?? new Date().toISOString(),
      });
    }

    return {
      success: true,
      message: `✅ Đã đẩy ${localProducts.length} sản phẩm lên server`,
      count: localProducts.length,
    };
  } catch (error) {
    console.error('❌ Lỗi đồng bộ lên API:', error);
    return { success: false, message: `❌ Lỗi đồng bộ: ${error}`, count: 0 };
  }
}

// 🔁 Đồng bộ hai chiều
export async function syncBidirectional() {
  try {
    const { ProductRepo } = require('./product.repo');
    const { initDb } = require('./db');

    const localProducts = await ProductRepo.getAll();
    const apiProducts = await fetchProductsFromAPI();

    const localMap = new Map(localProducts.map(p => [p.id, p]));
    const apiMap = new Map(apiProducts.map(p => [p.id, p]));

    const db = await initDb();
    let uploaded = 0;
    let downloaded = 0;

    // 🡱 Upload local mới lên server
    for (const lp of localProducts) {
      if (!apiMap.has(lp.id)) {
        await addProductToAPI({
          id: lp.id ?? `p${Date.now()}`,
          name: lp.name,
          price: lp.price,
          init: lp.init,
          description: lp.description,
          image_uri: lp.image_uri,
          category_id: lp.category_id,
          is_deleted: lp.is_deleted ?? 0,
          update_at: lp.update_at ?? new Date().toISOString(),
        });
        uploaded++;
      }
    }

    // 🡳 Download API mới về local
    for (const ap of apiProducts) {
      if (!localMap.has(ap.id)) {
        await db.runAsync(
          `INSERT INTO products (id, name, price, init, description, image_uri, category_id, is_deleted, update_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            ap.id,
            ap.name,
            ap.price,
            ap.init,
            ap.description ?? '',
            ap.image_uri ?? '',
            ap.category_id,
            ap.is_deleted ?? 0,
            ap.update_at ?? new Date().toISOString(),
          ]
        );
        downloaded++;
      }
    }

    return {
      success: true,
      message: `🔁 Đã đồng bộ ${uploaded} sản phẩm lên và ${downloaded} sản phẩm xuống.`,
      uploaded,
      downloaded,
    };
  } catch (error) {
    console.error('❌ Lỗi đồng bộ hai chiều:', error);
    return { success: false, message: `❌ Lỗi đồng bộ: ${error}`, uploaded: 0, downloaded: 0 };
  }
}
