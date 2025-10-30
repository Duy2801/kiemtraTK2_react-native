import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { ProductRepo } from '../../../src/db/product.repo';
import { Product } from '../../../src/db/product.repo'; // đồng bộ import để tránh sai model

export default function EditProduct() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [init, setInit] = useState('');
  const [description, setDescription] = useState('');
  const [image_uri, setImageUri] = useState('');

  // 🟢 Lấy dữ liệu sản phẩm khi load trang
  useEffect(() => {
    if (id) {
      const data = ProductRepo.getById(String(id));
      if (data) {
        setProduct(data);
        setName(data.name);
        setPrice(String(data.price));
        setInit(data.init);
        setDescription(data.description ?? '');
        setImageUri(data.image_uri ?? '');
      }
    }
  }, [id]);

  // 🟢 Hàm xử lý cập nhật sản phẩm
  const handleUpdate = () => {
    if (!product) return;

    if (!name.trim() || !price.trim() || !init.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }

    const priceValue = Number(price);
    if (isNaN(priceValue) || priceValue < 0) {
      Alert.alert('Lỗi', 'Giá sản phẩm không hợp lệ.');
      return;
    }

    try {
      ProductRepo.update({
        id: String(id),
        name,
        price: priceValue,
        init,
        description,
        image_uri,
        category_id: product.category_id,
      });

      Alert.alert('Thành công', 'Đã cập nhật sản phẩm!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error('Update error:', err);
      Alert.alert('Lỗi', 'Không thể cập nhật sản phẩm.');
    }
  };

  if (!product) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16, color: '#555' }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>
        Chỉnh sửa sản phẩm
      </Text>

      <TextInput
        placeholder="Tên sản phẩm"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Giá sản phẩm"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Hãng / Nhà sản xuất"
        value={init}
        onChangeText={setInit}
        style={styles.input}
      />

      <TextInput
        placeholder="Mô tả"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <TextInput
        placeholder="Link hình ảnh (URL)"
        value={image_uri}
        onChangeText={setImageUri}
        style={styles.input}
      />

      <TouchableOpacity onPress={handleUpdate} style={styles.btn}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Cập nhật</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
};
