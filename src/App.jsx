import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Page/Home';
import Product from './Page/Product';
import ServicePackage from './Page/ServicePackage';
import Login from './Components/Login';
import NotFound from './Page/NotFound';
import SignUp from './Components/SignUp';
import { useState, useEffect } from 'react';
import ProductCostWrapper from './Components/ProductCostWrapper';
import ShoppingCart from './Components/ShoppingCart.jsx';
import HeaderAdmin from './Admin/Components/headerAdmin.jsx';
import Admindashboard from './Admin/Page/Admindashboard.jsx';
import AdminProducts from './Admin/Page/AdminProducts.jsx';
import AdminCategories from './Admin/Page/AdminCategories.jsx';
import AdminOrders from './Admin/Page/AdminOrders.jsx';
import AdminUsers from './Admin/Page/AdminUsers.jsx';


// IMPORT CartProvider để kích hoạt hệ thống giỏ hàng toàn cục
import { CartProvider } from './Components/CartContext.jsx';

function App() {
  const [products, setProducts] = useState([]);

  // LƯU TRẠNG THÁI USER VÀO STATE ĐỂ ĐỒNG BỘ REALTIME TỨC THÌ
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  // Theo dõi sự thay đổi login/logout từ các tab khác hoặc các sự kiện tùy biến nếu cần
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const raw = localStorage.getItem("user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-update', handleStorageChange); // Event tự chế cho cùng 1 tab

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-update', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : data?.products ?? []))
      .catch(err => console.log(err))
  }, [])

  const isAdmin = user?.role === "admin";

  return (
    <CartProvider>
      {/* Thêm key={user?._id || 'guest'} để React tái định hình layout ngay khi user thay đổi */}
      <div key={user?._id || 'guest'} className={isAdmin ? "flex min-h-screen bg-gray-50" : ""}>
        {isAdmin ? (
          <HeaderAdmin />
        ) : (
          <Header products={products} />
        )}

        <main className={`flex-1 ${isAdmin ? "pl-64" : ""}`}>
          <Routes>
            <Route path="/" element={<Home products={products} />} />
            <Route path="/Product" element={<Product products={products} />} />
            <Route path="/ServicePackage" element={<ServicePackage />} />

            {/* Truyền hàm setUser xuống Login để cập nhật state ngay khi đăng nhập thành công */}
            <Route path="/Login" element={<Login onLoginSuccess={() => {
              const raw = localStorage.getItem("user");
              setUser(raw ? JSON.parse(raw) : null);
            }} />} />

            <Route path="/SignUp" element={<SignUp />} />
            <Route path="*" element={<NotFound />} />

            {/* Route admin booking (để khớp sidebar)
            <Route path="/admin/bookings" element={<bookingAdmin />} /> */}
            <Route path="/product/:id" element={<ProductCostWrapper products={products} />} />
            <Route path="/ShoppingCart" element={<ShoppingCart />} />
            <Route path="/admin" element={<Admindashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Routes>
        </main>

        {!isAdmin && <Footer />}
      </div>
    </CartProvider>
  );
}

export default App;