import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { ProductRepo, Product } from '../../src/db/product.repo';

export default function ProductScreen() {
  const { categoryId } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (categoryId) {
      setProducts(ProductRepo.getByCategory(Number(categoryId)));
    }
  }, [categoryId]);

  const renderItem = ({ item }: { item: Product }) => (
    <View
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
        source={{ uri: item.image_uri }}
        style={{ width: '100%', height: 180, borderRadius: 12 }}
      />
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>{item.name}</Text>
      <Text style={{ color: '#777', marginVertical: 4 }}>{item.description}</Text>
      <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>
        {item.price.toLocaleString()} ₫
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5', paddingTop: 10 }}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
