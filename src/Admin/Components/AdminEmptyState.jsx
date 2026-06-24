import { Button } from "antd";

const AdminEmptyState = ({
  icon: Icon,
  title = "Chưa có dữ liệu",
  description = "Bắt đầu bằng cách thêm mục đầu tiên vào hệ thống.",
  actionLabel,
  actionIcon: ActionIcon,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 scale-150 bg-indigo-200/30 rounded-full blur-2xl" />
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-100 flex items-center justify-center shadow-lg shadow-indigo-100">
          {Icon && <Icon className="text-4xl text-indigo-500" />}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <Button
          type="primary"
          size="large"
          icon={ActionIcon ? <ActionIcon /> : undefined}
          onClick={onAction}
          className="h-11 px-8 font-semibold"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default AdminEmptyState;
