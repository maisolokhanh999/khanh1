import React from 'react';
import { Card, Statistic, Row, Col, Button } from 'antd';
import { ShoppingCartOutlined, UserOutlined, AppstoreOutlined, DollarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Admindashboard = ({ stats }) => {
  const navigate = useNavigate();

  const safeStats = stats ?? {
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0,
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sản phẩm"
              value={safeStats.products}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng"
              value={safeStats.users}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn hàng"
              value={safeStats.orders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={safeStats.revenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix="đ"
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 16 }}>
        <Card>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button type="primary" onClick={() => navigate('/admin/products')}>
              Quản lý sản phẩm
            </Button>
            <Button onClick={() => navigate('/admin/orders')}>
              Quản lý đơn hàng
            </Button>
            <Button onClick={() => navigate('/admin/users')}>
              Quản lý người dùng
            </Button>
            <Button onClick={() => navigate('/admin/categories')}>
              Quản lý danh mục
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Admindashboard;

