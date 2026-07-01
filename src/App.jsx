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
import api from './config/apiConfig';
import { useAuth } from './context/AuthContext.jsx';

import ShoppingCart from './Components/ShoppingCart.jsx';
import HeaderAdmin from './Admin/Components/headerAdmin.jsx';
import Admindashboard from './Admin/Page/Admindashboard.jsx';
import AdminProducts from './Admin/Page/AdminProducts.jsx';
import AdminCategories from './Admin/Page/AdminCategories.jsx';
import AdminOrders from './Admin/Page/AdminOrders.jsx';
import AdminUsers from './Admin/Page/AdminUsers.jsx';
import RequireAdmin from './Components/RequireAdmin.jsx';
import { ConfigProvider } from 'antd';
import { adminTheme } from './Admin/adminTheme.js';
import './Admin/Admin.css';

function App() {
  const [products, setProducts] = useState([]);
  const { user } = useAuth();

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
      <Route path="/product" element={<Product products={products} />} />
      <Route path="/servicepackage" element={<ServicePackage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/shoppingcart" element={<ShoppingCart />} />
      <Route path="/admin" element={<RequireAdmin><Admindashboard /></RequireAdmin>} />
      <Route path="/admin/products" element={<RequireAdmin><AdminProducts /></RequireAdmin>} />
      <Route path="/admin/categories" element={<RequireAdmin><AdminCategories /></RequireAdmin>} />
      <Route path="/admin/orders" element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
      <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  return (
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
  );
}

export default App;
