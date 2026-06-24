import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from './useCart.js';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-indigo-500' : 'text-gray-600 hover:text-gray-900'
  }`;

const Header = () => {
  const navigate = useNavigate();
  const { totalQuantity } = useCart();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/Login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ── Logo ── */}
        <NavLink to="/" className="font-bold text-lg text-gray-900 tracking-tight">
          🛍 <span className="text-indigo-500">Shop</span>
        </NavLink>

        {/* ── Nav links ── */}
        <nav>
          <ul className="flex items-center gap-8">
            <li><NavLink to="/" className={navLinkClass}>Trang Chủ</NavLink></li>
            <li><NavLink to="/Product" className={navLinkClass}>Sản Phẩm</NavLink></li>
            <li><NavLink to="/ServicePackage" className={navLinkClass}>Gói Dịch Vụ</NavLink></li>
          </ul>
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-4">

          {/* Cart */}
          <button
            onClick={() => navigate('/ShoppingCart')}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m5-9l2 9" />
            </svg>
            {totalQuantity > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-indigo-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {totalQuantity > 99 ? '99+' : totalQuantity}
              </span>
            )}
          </button>

          {/* Auth */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                {(user.name || 'U')[0].toUpperCase()}
              </div>
              <div className="hidden md:flex flex-col leading-tight">
                <span className="text-xs font-semibold text-gray-800">{user.name || 'Người dùng'}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors text-left"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <NavLink
              to="/Login"
              className="px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-full transition-colors"
            >
              Đăng nhập
            </NavLink>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;