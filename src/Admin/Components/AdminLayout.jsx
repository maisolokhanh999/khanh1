import { useLocation } from "react-router-dom";

const pageMeta = {
  "/admin": { label: "Dashboard" },
  "/admin/products": { label: "Sản phẩm" },
  "/admin/categories": { label: "Danh mục" },
  "/admin/orders": { label: "Đơn hàng" },
  "/admin/users": { label: "Người dùng" },
};

const AdminLayout = ({ title, subtitle, action, children }) => {
  const { pathname } = useLocation();
  const crumb = pageMeta[pathname]?.label || "Admin";

  return (
    <div className="relative min-h-full p-6 md:p-8">
      <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 bg-indigo-200/25 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-10 w-64 h-64 bg-violet-100/40 rounded-full blur-3xl" />

      <div className="relative z-10">
        <p className="text-xs font-medium text-indigo-500/80 mb-3 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400" />
          Admin / {crumb}
        </p>

        <div className="mb-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <h1 className="admin-page-title text-3xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>

        <div className="admin-content-card rounded-2xl overflow-hidden">
          <div className="p-5 md:p-7">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
