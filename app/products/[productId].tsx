import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { ProductRepo, Product } from '../../src/db/product.repo';

export default function ProductDetailScreen() {
  const { productId } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (productId) {
      const data = ProductRepo.getById(String(productId));
      if (data) setProduct(data);
    }
  }, [productId]);

  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Nút quay lại */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: 'absolute',
          top: 40,
          left: 20,
          zIndex: 10,
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: 8,
          borderRadius: 50,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18 }}>←</Text>
      </TouchableOpacity>

      {/* Ảnh sản phẩm (chỉ hiển thị nếu có) */}
      {product.image_uri ? (
        <Image
          source={{ uri: product.image_uri }}
          style={{ width: '100%', height: 280 }}
          resizeMode="cover"
        />
      ) : null}

      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
          {product.name}
        </Text>

        <Text style={{ color: '#007AFF', fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
          {product.price.toLocaleString()} ₫
        </Text>

        <Text style={{ fontSize: 16, color: '#444', marginBottom: 10 }}>
          <Text style={{ fontWeight: '600' }}>Thương hiệu:</Text> {product.init}
        </Text>

        <Text style={{ fontSize: 16, color: '#444', marginBottom: 10 }}>
          <Text style={{ fontWeight: '600' }}>Danh mục:</Text> {product.category_name ?? '—'}
        </Text>

        <Text style={{ fontSize: 15, color: '#555', lineHeight: 22 }}>
          {product.description}
        </Text>
      </View>
    </ScrollView>
  );
}
