import { NavLink, useNavigate } from "react-router-dom";

// Cập nhật lại class active cho phù hợp với menu dọc (thêm padding, bo góc, full width)
const navLinkClass = ({ isActive }) =>
  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors w-full ${
    isActive 
      ? "bg-indigo-50 text-indigo-600 font-semibold" 
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
  }`;

const HeaderAdmin = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isLoggedIn = !!localStorage.getItem("token");

 const handleLogout = (e) => {
     e.preventDefault();
     localStorage.removeItem("token");
     localStorage.removeItem("user");
     window.dispatchEvent(new Event("local-storage-update")); 
     navigate("/Login");
   };

  return (
    // Chuyển thành thanh điều hướng dọc (Sidebar), cố định bên trái màn hình
    <aside className="fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-100 shadow-sm flex flex-col justify-between p-6">
      <div>
        {/* Logo */}
        <div
          className="text-xl font-bold text-indigo-600 cursor-pointer mb-8 text-center md:text-left"
          onClick={() => navigate("/admin")}
        >
          ADMIN PANEL
        </div>

        {/* Menu Admin - Chuyển flex-row thành flex-col */}
        <nav>
          <ul className="flex flex-col gap-2">
            <li>
              <NavLink to="/admin" className={navLinkClass} end>
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/products" className={navLinkClass}>
                Sản phẩm
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/services" className={navLinkClass}>
                Dịch vụ
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/orders" className={navLinkClass}>
                Đơn hàng
              </NavLink>
            </li>

            <li>
              <NavLink to="/admin/bookings" className={navLinkClass}>
                Đặt lịch
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* User - Đưa xuống góc dưới cùng của Sidebar */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        {isLoggedIn ? (
          <>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm shrink-0">
              {(user.name || "A")[0].toUpperCase()}
            </div>

            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="text-sm font-semibold text-gray-800 truncate">
                {user.name || "Admin"}
              </span>

              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-red-500 text-left mt-0.5"
              >
                Đăng xuất
              </button>
            </div>
          </>
        ) : (
          <NavLink
            to="/Login"
            className="w-full text-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg"
          >
            Đăng nhập
          </NavLink>
        )}
      </div>
    </aside>
  );
};

export default HeaderAdmin;