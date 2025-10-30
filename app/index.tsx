import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { initDb } from '../src/db/db';
import { CategoryRepo, Category } from '../src/db/category.repo';

export default function CategoryScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    initDb();
    setCategories(CategoryRepo.getAll());
  }, []);

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      onPress={() => router.push(`/products/${item.id}`)}
      style={{
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 4,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5', paddingTop: 20 }}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
