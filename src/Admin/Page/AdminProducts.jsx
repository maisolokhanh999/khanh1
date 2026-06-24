import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = Thêm mới, có dữ liệu = Đang sửa
  const [form] = Form.useForm();

  // ── FETCH DANH SÁCH SẢN PHẨM ─────────────────────────────
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/products');
      // Xử lý linh hoạt format mảng trả về giống như file App.jsx của bạn
      setProducts(Array.isArray(data) ? data : data?.products ?? []);
    } catch (error) {
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ── MỞ MODAL (THÊM / SỬA) ──────────────────────────────────
  const openModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue(product); // Đổ dữ liệu cũ vào form khi Sửa
    } else {
      form.resetFields(); // Reset form trống khi Thêm mới
    }
    setIsModalOpen(true);
  };

  // ── XỬ LÝ SUBMIT FORM (LƯU DỮ LIỆU) ───────────────────────
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingProduct) {
        // GỌI API: PUT /api/products/:id (Cập nhật)
        const id = editingProduct._id || editingProduct.id;
        await axios.put(`/api/products/${id}`, values, config);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        // GỌI API: POST /api/products (Thêm mới)
        await axios.post('/api/products', values, config);
        message.success('Thêm sản phẩm thành công');
      }

      setIsModalOpen(false);
      fetchProducts(); // Tải lại danh sách mới
    } catch (error) {
      if (error.response) {
        message.error(error.response.data?.message || 'Thao tác thất bại');
      }
    }
  };

  // ── XỬ LÝ XÓA SẢN PHẨM ────────────────────────────────────
  const handleDelete = async (product) => {
    try {
      const id = product._id || product.id;
      const token = localStorage.getItem('token');
      // GỌI API: DELETE /api/products/:id
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Xóa sản phẩm thành công');
      fetchProducts();
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  };

  // ── CẤU HÌNH CÁC CỘT TRONG BẢNG (TABLE) ────────────────────
  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (text) => (
        <img 
          src={text || 'https://placehold.co/50'} 
          alt="product" 
          className="w-12 h-12 object-cover rounded border"
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Giá tiền',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      sorter: (a, b) => a.price - b.price,
      render: (price) => `${price?.toLocaleString('vi-VN')} đ`,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true, // Tự động thu gọn nếu chuỗi quá dài
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined className="text-blue-500" />} 
            onClick={() => openModal(record)} 
          />
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này không?"
            onConfirm={() => handleDelete(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm m-4">
      {/* Header điều khiển */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Quản lý sản phẩm</h1>
          <p className="text-sm text-gray-500">Danh sách và thông tin các sản phẩm trong hệ thống</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => openModal(null)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Thêm sản phẩm
        </Button>
      </div>

      {/* Bảng hiển thị dữ liệu */}
      <Table 
        columns={columns} 
        dataSource={products.map((p, idx) => ({ ...p, key: p._id || p.id || idx }))} 
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      {/* MODAL THÊM / SỬA (DÙNG CHUNG) */}
      <Modal
        title={editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu dữ liệu"
        cancelText="Hủy bỏ"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input placeholder="Nhập tên sản phẩm..." />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá bán (đ)"
            rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm!' }]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              min={0} 
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Nhập giá tiền..."
            />
          </Form.Item>

          <Form.Item
            name="image"
            label="Đường dẫn ảnh (URL)"
            rules={[{ required: true, message: 'Vui lòng nhập link ảnh sản phẩm!' }]}
          >
            <Input placeholder="https://example.com/image.png" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả sản phẩm"
          >
            <Input.TextArea rows={4} placeholder="Nhập thông tin mô tả chi tiết sản phẩm..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProducts;