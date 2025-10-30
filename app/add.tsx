import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { ProductRepo } from '../src/db/product.repo';

export default function AddProduct() {
  const { categoryId } = useLocalSearchParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');
  const [image_uri, setImageUri] = useState('');

  const handleSave = () => {
    if (!name || !price || !unit || !description || !image_uri) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      ProductRepo.create({
        name,
        price: Number(price),
        unit,
        description,
        image_uri,
        category_id: Number(categoryId),
      });

      Alert.alert('Thành công', 'Đã thêm sản phẩm mới!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm.');
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Thêm sản phẩm mới</Text>

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
      <TextInput placeholder="Đơn vị" value={unit} onChangeText={setUnit} style={styles.input} />
      <TextInput
        placeholder="Mô tả"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        multiline
      />
      <TextInput
        placeholder="Link hình ảnh"
        value={image_uri}
        onChangeText={setImageUri}
        style={styles.input}
      />

      <TouchableOpacity onPress={handleSave} style={styles.btn}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Lưu sản phẩm</Text>
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
  },
  btn: {
    backgroundColor: '#34C759',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
};
