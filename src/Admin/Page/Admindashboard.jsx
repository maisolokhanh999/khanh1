import React from 'react';
import { Row, Col } from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreOutlined,
  DollarOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../Components/AdminLayout.jsx';

const statCards = [
  { key: 'products', title: 'Sản phẩm', icon: AppstoreOutlined, color: '#4f46e5', path: '/admin/products' },
  { key: 'users', title: 'Người dùng', icon: UserOutlined, color: '#0ea5e9', path: '/admin/users' },
  { key: 'orders', title: 'Đơn hàng', icon: ShoppingCartOutlined, color: '#f59e0b', path: '/admin/orders' },
  { key: 'revenue', title: 'Doanh thu', icon: DollarOutlined, color: '#10b981', path: '/admin/orders', suffix: 'đ' },
];

const quickLinks = [
  { label: 'Quản lý sản phẩm', path: '/admin/products' },
  { label: 'Quản lý đơn hàng', path: '/admin/orders' },
  { label: 'Quản lý người dùng', path: '/admin/users' },
  { label: 'Quản lý danh mục', path: '/admin/categories' },
];

const Admindashboard = ({ stats }) => {
  const navigate = useNavigate();

  const safeStats = stats ?? {
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0,
  };

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Tổng quan hoạt động và thống kê hệ thống"
    >
      <Row gutter={[20, 20]} className="mb-8">
        {statCards.map(({ key, title, icon: Icon, color, path, suffix }) => (
          <Col xs={24} sm={12} lg={6} key={key}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => navigate(path)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(path)}
              className="group cursor-pointer rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-100 hover:border-indigo-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shadow-sm"
                  style={{ backgroundColor: `${color}12`, color }}
                >
                  <Icon />
                </div>
                <ArrowRightOutlined className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
              <p className="text-3xl font-bold" style={{ color }}>
                {safeStats[key].toLocaleString('vi-VN')}{suffix ? ` ${suffix}` : ''}
              </p>
            </div>
          </Col>
        ))}
      </Row>

      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 md:p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Truy cập nhanh</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map(({ label, path }) => (
            <button
              key={path}
              type="button"
              onClick={() => navigate(path)}
              className="flex items-center justify-between rounded-xl bg-white border border-slate-100 px-4 py-3.5 text-sm font-medium text-slate-700 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-sm transition-all text-left"
            >
              <span>{label}</span>
              <ArrowRightOutlined />
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admindashboard;
