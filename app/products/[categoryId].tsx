import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ProductRepo, Product } from '../../src/db/product.repo';

export default function ProductScreen() {
  const { categoryId } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const loadData = () => {
    if (!categoryId) return;
    const data = ProductRepo.getByCategory(Number(categoryId));
    setProducts(data);
    setFiltered(data);
  };

  useEffect(() => {
    loadData();
  }, [categoryId]);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text.trim() === '') {
      setFiltered(products);
    } else {
      const filteredData = products.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFiltered(filteredData);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa sản phẩm này không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          ProductRepo.delete(id); // ✅ dùng delete thay vì remove
          loadData();
        },
      },
    ]);
  };

  const handleAdd = () => {
    router.push({
      pathname: '/products/add',
      params: { categoryId: String(categoryId) },
    });
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: `/products/${item.id}`,
          params: { categoryId: String(categoryId) },
        })
      }
      style={{
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 16,
        padding: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <Image
        source={{
          uri:
            item.image_uri && item.image_uri !== ''
              ? item.image_uri
              : 'https://via.placeholder.com/300x200?text=No+Image',
        }}
        style={{ width: '100%', height: 180, borderRadius: 12 }}
      />
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>{item.name}</Text>
      {item.description ? (
        <Text style={{ color: '#777', marginVertical: 4 }}>{item.description}</Text>
      ) : null}
      <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>
        {item.price.toLocaleString()} ₫
      </Text>
      <Text style={{ color: '#555', marginTop: 2 }}>Hãng: {item.init}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/products/edit/${item.id}`,
              params: { categoryId: String(categoryId) },
            })
          }
          style={{
            backgroundColor: '#007AFF',
            paddingVertical: 6,
            paddingHorizontal: 14,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff' }}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDelete(item.id!)}
          style={{
            backgroundColor: '#FF3B30',
            paddingVertical: 6,
            paddingHorizontal: 14,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff' }}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5', paddingTop: 10 }}>
      {/* Ô tìm kiếm */}
      <View
        style={{
          backgroundColor: '#fff',
          margin: 16,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 2,
        }}
      >
        <TextInput
          placeholder="Tìm sản phẩm..."
          value={search}
          onChangeText={handleSearch}
          style={{
            flex: 1,
            paddingVertical: 10,
            fontSize: 16,
          }}
        />
      </View>

      {/* Nút thêm sản phẩm */}
      <TouchableOpacity
        onPress={handleAdd}
        style={{
          backgroundColor: '#34C759',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
          marginHorizontal: 16,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>+ Thêm sản phẩm</Text>
      </TouchableOpacity>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id!}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#666' }}>
            Không tìm thấy sản phẩm
          </Text>
        }
      />
    </View>
  );
}
