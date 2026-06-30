import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Page/Home';
import Product from './Page/Product';
import ServicePackage from './Page/ServicePackage';
import Login from './Components/Login';
import NotFound from './Page/NotFound';
import SignUp from './Components/SignUp';
import { useState, useEffect } from 'react';
import api from './config/apiConfig.js';

import ShoppingCart from './Components/ShoppingCart.jsx';
import HeaderAdmin from './Admin/Components/headerAdmin.jsx';
import Admindashboard from './Admin/Page/Admindashboard.jsx';
import AdminProducts from './Admin/Page/AdminProducts.jsx';
import AdminCategories from './Admin/Page/AdminCategories.jsx';
import AdminOrders from './Admin/Page/AdminOrders.jsx';
import AdminUsers from './Admin/Page/AdminUsers.jsx';
import { CartProvider } from './Components/CartContext.jsx';
import { ConfigProvider } from 'antd';
import { adminTheme } from './Admin/adminTheme.js';
import './Admin/Admin.css';

function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

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
    window.addEventListener('local-storage-update', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-update', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(Array.isArray(res.data) ? res.data : res.data?.products ?? []))
      .catch(err => console.error('Erro ao buscar produtos:', err));
  }, []);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const routes = (
    <Routes>
      <Route path="/" element={<Home products={products} />} />
      <Route path="/Product" element={<Product products={products} />} />
      <Route path="/ServicePackage" element={<ServicePackage />} />
      <Route path="/Login" element={<Login onLoginSuccess={() => {
        const raw = localStorage.getItem("user");
        setUser(raw ? JSON.parse(raw) : null);
      }} />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/ShoppingCart" element={<ShoppingCart />} />
      <Route path="/admin" element={<Admindashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/categories" element={<AdminCategories />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  return (
    <CartProvider>
      <div key={user?._id || 'guest'} className={isAdminRoute ? "admin-shell flex min-h-screen" : ""}>
        {isAdminRoute ? (
          <ConfigProvider theme={adminTheme}>
            <HeaderAdmin />
          </ConfigProvider>
        ) : (
          <Header products={products} />
        )}

        <main className={isAdminRoute ? "flex-1 min-w-0 overflow-x-auto" : "flex-1"}>
          {isAdminRoute ? (
            <ConfigProvider theme={adminTheme}>{routes}</ConfigProvider>
          ) : (
            routes
          )}
        </main>

        {!isAdminRoute && <Footer />}
      </div>
    </CartProvider>
  );
}

export default App;
