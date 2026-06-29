import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import { useCart } from "./CartContext";

const api = axios.create({ baseURL: "/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">🛒 Giỏ hàng của bạn</h1>
            <p className="text-gray-500 mt-2">{cart.reduce((s, i) => s + i.quantity, 0)} sản phẩm trong giỏ hàng</p>
          </div>

          <div className="bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100">
            <span className="text-sm text-gray-500">Tổng giá trị:</span>
            <p className="font-bold text-pink-600 text-xl">{totalPrice.toLocaleString("vi-VN")}đ</p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-400">
            <span className="text-6xl">🛒</span>
            <p className="text-base font-medium">Giỏ hàng đang trống</p>
            <button
              onClick={() => navigate("/Product")}
              className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-full transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const pId = getId(item);
                const product = item.productId && typeof item.productId === "object" ? item.productId : null;

                const name = product?.name || "Sản phẩm không rõ tên";
                const image = product?.image;
                const price = product?.price ?? 0;

                const subtotal = price * item.quantity;

                return (
                  <div
                    key={pId}
                    className="bg-white rounded-3xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200"
                  >
                    <div className="flex flex-col md:flex-row gap-5 items-center">
                      <img
                        src={image}
                        alt={name}
                        className="w-24 h-24 object-cover rounded-2xl border border-gray-100"
                      />

                      <div className="flex-1 w-full">
                        <h3 className="font-bold text-lg text-gray-800">{name}</h3>
                        <p className="text-pink-600 text-xl font-extrabold mt-1">{price.toLocaleString("vi-VN")}đ</p>
                      </div>

                      <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1">
                        <button
                          onClick={() => decreaseQuantity(pId)}
                          className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:bg-indigo-500 hover:text-white transition font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => increaseQuantity(pId)}
                          className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:bg-indigo-500 hover:text-white transition font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right min-w-[120px]">
                        <p className="text-xs text-gray-400">Thành tiền</p>
                        <p className="text-lg font-extrabold text-red-500">{subtotal.toLocaleString("vi-VN")}đ</p>
                      </div>

                      <button
                        onClick={() => removeFromCart(pId)}
                        className="w-10 h-10 rounded-full border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 transition"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-indigo-100 sticky top-6">
                <h2 className="font-bold text-xl mb-5">Tóm tắt đơn hàng</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Số lượng</span>
                    <span className="font-semibold">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Tạm tính</span>
                    <span className="font-semibold">{totalPrice.toLocaleString("vi-VN")}đ</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">Vận chuyển</span>
                    <span className="text-green-600 font-semibold">Miễn phí</span>
                  </div>
                </div>

                <div className="border-t mt-5 pt-5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Tổng cộng</span>
                    <span className="text-3xl font-extrabold text-pink-600">{totalPrice.toLocaleString("vi-VN")}đ</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-gradient-to-r from-pink-500 to-indigo-500 hover:scale-[1.02] transition text-white font-bold rounded-2xl shadow-lg"
                  >
                    Thanh toán ngay
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full py-3 border border-red-200 text-red-500 rounded-2xl hover:bg-red-50 transition"
                  >
                    Xóa toàn bộ giỏ hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;

