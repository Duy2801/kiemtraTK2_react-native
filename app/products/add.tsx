import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ProductRepo } from '../../src/db/product.repo';

export default function AddProduct() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');
  const [image_uri, setImageUri] = useState('');
  const [category_id, setCategoryId] = useState('');

  const handleAdd = () => {
    if (!name || !price || !unit || !description || !image_uri || !category_id) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin sản phẩm.');
      return;
    }

    try {
      ProductRepo.create({
        name,
        price: Number(price),
        unit,
        description,
        image_uri,
        category_id: Number(category_id),
      });

      Alert.alert('Thành công', 'Đã thêm sản phẩm mới!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể thêm sản phẩm.');
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>
        Thêm sản phẩm mới
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
        placeholder="Đơn vị (VD: cái, hộp...)"
        value={unit}
        onChangeText={setUnit}
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
        placeholder="Link hình ảnh"
        value={image_uri}
        onChangeText={setImageUri}
        style={styles.input}
      />

      <TextInput
        placeholder="Mã danh mục (category_id)"
        value={category_id}
        onChangeText={setCategoryId}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity onPress={handleAdd} style={styles.btn}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Thêm sản phẩm</Text>
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
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
};
