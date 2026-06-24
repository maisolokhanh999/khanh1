import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null = Thêm mới, có dữ liệu = Đang sửa
  const [form] = Form.useForm();

  // ── FETCH DANH SÁCH DANH MỤC ─────────────────────────────
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/categories');
      setCategories(Array.isArray(data) ? data : data?.categories ?? []);
    } catch (error) {
      message.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ── MỞ MODAL (THÊM / SỬA) ──────────────────────────────────
  const openModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      form.setFieldsValue(category);
    } else {
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  // ── XỬ LÝ SUBMIT FORM (LƯU DỮ LIỆU) ───────────────────────
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingCategory) {
        // GỌI API: PUT /api/categories/:id
        const id = editingCategory._id || editingCategory.id;
        await axios.put(`/api/categories/${id}`, values, config);
        message.success('Cập nhật danh mục thành công');
      } else {
        // GỌI API: POST /api/categories
        await axios.post('/api/categories', values, config);
        message.success('Thêm danh mục thành công');
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      if (error.response) {
        message.error(error.response.data?.message || 'Thao tác thất bại');
      }
    }
  };

  // ── XỬ LÝ XÓA DANH MỤC ────────────────────────────────────
  const handleDelete = async (category) => {
    try {
      const id = category._id || category.id;
      const token = localStorage.getItem('token');
      // GỌI API: DELETE /api/categories/:id
      await axios.delete(`/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Xóa danh mục thành công');
      fetchCategories();
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể xóa danh mục');
    }
  };

  // ── CẤU HÌNH CÁC CỘT TRONG BẢNG (TABLE) ────────────────────
  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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
            title="Xóa danh mục"
            description="Bạn có chắc chắn muốn xóa danh mục này không?"
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
          <h1 className="text-xl font-bold text-gray-800">Quản lý danh mục</h1>
          <p className="text-sm text-gray-500">Phân loại sản phẩm/dịch vụ của hệ thống</p>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => openModal(null)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Thêm danh mục
        </Button>
      </div>

      {/* Bảng hiển thị dữ liệu */}
      <Table 
        columns={columns} 
        dataSource={categories.map((c, idx) => ({ ...c, key: c._id || c.id || idx }))} 
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      {/* MODAL THÊM / SỬA */}
      <Modal
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
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
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
          >
            <Input placeholder="Ví dụ: Thiết bị điện tử, Đồ gia dụng..." />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả danh mục"
          >
            <Input.TextArea rows={4} placeholder="Nhập mô tả ngắn gọn về danh mục này..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategories;