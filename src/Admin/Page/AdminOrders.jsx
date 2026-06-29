import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Select, Modal, Space, message, List } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import AdminLayout from '../Components/AdminLayout.jsx';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // Lưu thông tin đơn hàng đang xem chi tiết

  // ── FETCH DANH SÁCH ĐƠN HÀNG ─────────────────────────────
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(data); // 👈
      setOrders(Array.isArray(data) ? data : data?.orders ?? []);
    } catch (error) {
      const msg = error.response?.data?.message || 'Không thể tải danh sách đơn hàng';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ── CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (PATCH) ──────────────────
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      // GỌI API: PATCH /api/orders/:id/status
      await axios.patch(`/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('Cập nhật trạng thái đơn hàng thành công');
      fetchOrders(); // Tải lại danh sách
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể cập nhật trạng thái');
    }
  };

  // ── XEM CHI TIẾT ĐƠN HÀNG (MỞ MODAL) ──────────────────────
  const openDetailModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Helper hiển thị màu sắc tương ứng với trạng thái đơn hàng
  const renderStatusTag = (status) => {
    const statusMap = {
      Pending: { color: 'warning', text: 'Chờ xử lý' },
      Processing: { color: 'processing', text: 'Đang xử lý' },
      Shipped: { color: 'purple', text: 'Đang giao' },
      Delivered: { color: 'success', text: 'Đã giao' },
      Cancelled: { color: 'error', text: 'Đã hủy' },
    };
    const current = statusMap[status] || { color: 'default', text: status };
    return <Tag color={current.color}>{current.text}</Tag>;
  };

  // ── CẤU HÌNH CÁC CỘT TRONG BẢNG ĐƠN HÀNG ──────────────────
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: '_id',
      ellipsis: true,
      render: (id) => <span className="font-mono text-xs">{id}</span>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'userId',
      key: 'customer',
      render: (userId) => userId?.name || userId?.email || 'Khách vãng lai',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      render: (price) => <span className="font-semibold text-indigo-600">{price?.toLocaleString('vi-VN')} đ</span>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => date ? new Date(date).toLocaleString('vi-VN') : '---',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 150 }}
          onChange={(value) => handleStatusChange(record._id, value)}
          options={[
            { value: "pending", label: "Chờ xử lý" },
            { value: "processing", label: "Đang xử lý" },
            { value: "shipped", label: "Đang giao" },
            { value: "delivered", label: "Đã giao" },
            { value: "cancelled", label: "Đã hủy" },
          ]}
        />
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined className="text-blue-500" />}
          onClick={() => openDetailModal(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout
      title="Quản lý đơn hàng"
      subtitle="Xem thông tin hóa đơn và cập nhật trạng thái vận chuyển"
    >
      <Table
        columns={columns}
        dataSource={orders.map((o, idx) => ({ ...o, key: o._id || o.id || idx }))}
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      {/* MODAL XEM CHI TIẾT SẢN PHẨM TRONG ĐƠN HÀNG */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?._id}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsModalOpen(false)}>
            Đóng lại
          </Button>
        ]}
        width={600}
      >
        {selectedOrder && (
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded">
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Khách hàng:</p>
                <p className="font-medium">{selectedOrder.userId?.name || 'N/A'}</p>
                <p className="text-xs text-gray-400">{selectedOrder.userId?.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Trạng thái hiện tại:</p>
                <div>{renderStatusTag(selectedOrder.status)}</div>
              </div>
            </div>

            <h4 className="font-semibold text-gray-700 mb-2">Danh sách sản phẩm mua:</h4>
            <List
              bordered
              dataSource={selectedOrder.products || []}
              renderItem={(item) => (
                <List.Item className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500">
                      Số lượng: {item.quantity}
                    </p>
                  </div>

                  <span className="font-semibold">
                    {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                  </span>
                </List.Item>
              )}
            />

            <div className="text-right mt-4">
              <span className="text-gray-500 mr-2">Tổng giá trị hóa đơn:</span>
              <span className="text-xl font-bold text-indigo-600">
                {selectedOrder.totalPrice?.toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminOrders;