import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import api from "../config/apiConfig";
import { useCart } from "./CartContext";

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { cart, loading, increaseQuantity, decreaseQuantity, setQuantity, removeFromCart, clearCart, totalPrice } =
    useCart();

  const getId = (item) => item?.productId?._id || item?.productId || item?._id || item?.id;

  const orderItems = useMemo(
    () =>
      cart.map((item) => ({
        productId: getId(item),
        quantity: item.quantity,
      })),
    [cart]
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      return message.warning("Giỏ hàng trống");
    }

    const token = localStorage.getItem("token");

    if (!token) {
      message.warning("Vui lòng đăng nhập để thanh toán!");
      navigate("/login"); // chuyển đến trang đăng nhập
      return;
    }

    try {
      await api.post("/orders", {
        items: orderItems,
      });

      message.success("Đặt hàng thành công!");

      await clearCart();

      navigate("/");
    } catch (err) {
      if (err.response?.status === 401) {
        message.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      message.error(
        err.response?.data?.message || "Có lỗi xảy ra khi thanh toán."
      );
    }
  };
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Đang tải giỏ hàng...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">Giỏ hàng của bạn</h1>
              <p className="text-gray-500 mt-3">{cart.reduce((s, i) => s + i.quantity, 0)} sản phẩm đang chờ thanh toán</p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full bg-white border border-gray-200 px-5 py-3 shadow-sm">
              <span className="text-sm text-gray-500">Tổng giá trị</span>
              <span className="text-xl font-bold text-pink-600">{totalPrice.toLocaleString("vi-VN")}đ</span>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-400 rounded-[32px] bg-white border border-gray-200 shadow-sm p-8">
            <span className="text-6xl">🛒</span>
            <p className="text-base font-medium">Giỏ hàng đang trống</p>
            <button
              onClick={() => navigate("/product")}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-full transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1.8fr_1fr] gap-6">
            <div className="space-y-5">
              {cart.map((item) => {
                const pId = getId(item);
                const product = item.productId && typeof item.productId === "object" ? item.productId : null;

                const name = product?.name || "Sản phẩm không rõ tên";
                const image = product?.image || 'https://placehold.co/240x240?text=No+Image';
                const price = product?.price ?? 0;
                const subtotal = price * item.quantity;

                return (
                  <div
                    key={pId}
                    className="relative overflow-hidden rounded-[32px] bg-white p-6 shadow-xl border border-gray-100 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="grid grid-cols-[110px_1fr] gap-5 items-center">
                      <img
                        src={image}
                        alt={name}
                        className="h-28 w-28 rounded-3xl object-cover border border-gray-200"
                      />

                      <div className="space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                          <p className="text-sm text-gray-500">{price.toLocaleString("vi-VN")}đ / cái</p>
                        </div>
                        <div className="flex flex-wrap gap-3 items-center justify-between">
                          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 border border-gray-200">
                            <button
                              onClick={() => decreaseQuantity(pId)}
                              className="h-10 w-10 rounded-full bg-white border border-gray-200 hover:border-indigo-300 transition text-lg font-bold text-gray-700"
                            >
                              -
                            </button>
                            <span className="min-w-[42px] text-center font-semibold text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => increaseQuantity(pId)}
                              className="h-10 w-10 rounded-full bg-white border border-gray-200 hover:border-indigo-300 transition text-lg font-bold text-gray-700"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-gray-400">Thành tiền</p>
                            <p className="text-lg font-extrabold text-pink-600">{subtotal.toLocaleString("vi-VN")}đ</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(pId)}
                      className="absolute top-5 right-5 h-10 w-10 rounded-full border border-gray-200 bg-white text-gray-400 hover:text-red-500 hover:border-red-300 transition"
                      aria-label="Xóa sản phẩm"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            <aside className="sticky top-6 self-start rounded-[32px] bg-white border border-gray-100 p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tóm tắt đơn hàng</h2>
                <p className="text-sm text-gray-500 mt-2">Kiểm tra lại các thông tin trước khi thanh toán.</p>
              </div>

              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Số lượng</span>
                  <span className="font-semibold text-gray-900">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-gray-900">{totalPrice.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Vận chuyển</span>
                  <span className="font-semibold text-green-600">Miễn phí</span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">Tổng cộng</span>
                  <span className="text-3xl font-extrabold text-pink-600">{totalPrice.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full rounded-3xl bg-gradient-to-r from-pink-500 to-indigo-500 py-4 text-base font-bold text-white shadow-2xl transition hover:opacity-95"
                >
                  Thanh toán ngay
                </button>
                <button
                  onClick={clearCart}
                  className="w-full rounded-3xl border border-red-200 bg-white py-4 text-base font-bold text-red-500 transition hover:bg-red-50"
                >
                  Xóa toàn bộ giỏ hàng
                </button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;

