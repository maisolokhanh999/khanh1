import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  DashboardOutlined,
  HomeOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: DashboardOutlined, end: true },
  { to: "/admin/products", label: "Sản phẩm", icon: AppstoreOutlined },
  { to: "/admin/categories", label: "Danh mục", icon: TagsOutlined },
  { to: "/admin/orders", label: "Đơn hàng", icon: ShoppingCartOutlined },
  { to: "/admin/users", label: "Người dùng", icon: UserOutlined },
];

const HeaderAdmin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const syncAuth = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    try {
      const raw = localStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    syncAuth();
    window.addEventListener("local-storage-update", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("local-storage-update", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("local-storage-update"));
    navigate("/Login");
  };

  return (
    <aside className="admin-sidebar relative w-[248px] shrink-0 h-screen sticky top-0 flex flex-col text-white shadow-2xl shadow-indigo-950/30">
      <div className="relative z-10 px-5 pt-7 pb-5">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/admin")}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-900/40 group-hover:scale-105 transition-transform">
            K
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-300/90 font-semibold">
              Khanh Admin
            </p>
            <p className="text-[15px] font-semibold leading-snug text-white/95">Bảng điều khiển</p>
          </div>
        </div>
      </div>

      <nav className="relative z-10 flex-1 min-h-0 px-3 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-400/80">
          Menu chính
        </p>
        <ul className="flex flex-col gap-0.5">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `admin-nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    isActive ? "admin-nav-active" : "text-indigo-200/90"
                  }`
                }
              >
                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[15px]">
                  <Icon />
                </span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="relative z-10 shrink-0 px-3 pt-3 pb-6 mt-auto border-t border-white/10 space-y-2">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="admin-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-indigo-200/90 transition-colors"
        >
          <HomeOutlined className="text-base" />
          Về trang chủ
        </button>

        <div className="rounded-2xl bg-black/20 border border-white/10 p-3.5 backdrop-blur-sm">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400/40 to-violet-500/40 flex items-center justify-center text-sm font-bold shrink-0 border border-white/15">
                {(user?.name || "A")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-white/95">{user?.name || "Admin"}</p>
                <p className="text-[11px] text-indigo-300/70 truncate">{user?.email || "admin"}</p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Đăng xuất"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-indigo-200 hover:bg-white/10 hover:text-white transition-colors"
              >
                <LogoutOutlined />
              </button>
            </div>
          ) : (
            <NavLink
              to="/Login"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/95 text-indigo-700 text-sm font-semibold hover:bg-white transition-colors shadow-sm"
            >
              <UserOutlined />
              Đăng nhập
            </NavLink>
          )}
        </div>
      </div>
    </aside>
  );
};

export default HeaderAdmin;
