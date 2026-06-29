import { useState, } from 'react';
import { useNavigate } from "react-router-dom";
import { useCart } from './useCart';
import { message } from 'antd';

const ProductCost = ({ product, onBack }) => {
  const navigate = useNavigate();
  const name = product.name || product.title || '';
  const stock = product.quantity ?? product.stock ?? 0;
  const price = product.price ?? 0;
  const img = product.image || product.thumbnail || '';
  
  // SỬA: Nếu hết hàng (stock = 0) thì số lượng mặc định phải là 0
  const [quantity, setQuantity] = useState(stock > 0 ? 1 : 0);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    message.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
    navigate("/login");
    return;
  }

  if (stock <= 0 || quantity < 1) {
    message.error("Sản phẩm đã hết hàng hoặc số lượng không hợp lệ!");
    return;
  }

  addToCart(product, quantity);
  message.success(`Đã thêm ${quantity} "${name}" vào giỏ hàng!`);
};

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        <button
          onClick={onBack}
          className="mb-12 inline-flex items-center px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 font-semibold"
        >
          ← Quay lại
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="lg:flex">
            {/* IMAGE */}
            <div className="lg:w-1/2 lg:p-12 p-8 flex flex-col items-center justify-center bg-gray-50">
              <img
                src={img}
                alt={name}
                // SỬA: Tăng chiều cao h-52 lên h-96 để ảnh chi tiết hiển thị đẹp hơn, sửa group-hover thành hover
                className="w-full h-96 object-contain hover:scale-105 transition duration-300"
                loading="lazy"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = 'https://picsum.photos/400/400';
                }}
              />
            </div>

            {/* INFO */}
            <div className="lg:w-1/2 lg:p-12 p-8">
              <h1 className="text-4xl font-bold mb-6 text-primary">{name}</h1>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">{product.description || "Chưa có mô tả cho sản phẩm này."}</p>

              <div className="mb-10">
                <div className="space-y-4 mb-8">
                  <p className="text-5xl font-bold text-primary">
                    {price.toLocaleString('vi-VN')}đ
                  </p>
                  <div className="flex items-center space-x-4">
                    <span className="text-xl text-gray-700 font-semibold">
                      {stock > 0 ? (
                        <>Còn <span className="text-primary font-bold">{stock}</span> sản phẩm</>
                      ) : (
                        <span className="text-red-500 font-bold">Hết hàng</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* QUANTITY */}
                {stock > 0 && (
                  <div className="space-y-4">
                    <label className="block text-xl font-semibold mb-3">Số lượng:</label>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        disabled={stock === 0}
                        className="w-14 h-14 bg-gray-200 rounded-xl hover:bg-gray-300 disabled:opacity-50 transition-colors font-bold text-lg"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        disabled={stock === 0}
                        onChange={e => {
                          const val = parseInt(e.target.value) || 1;
                          setQuantity(Math.min(stock, Math.max(1, val)));
                        }}
                        className="w-24 text-center p-3 text-2xl font-bold border-2 border-outline-variant rounded-xl focus:border-primary focus:outline-none disabled:bg-gray-100"
                        min="1"
                        max={stock}
                      />
                      <button
                        onClick={() => setQuantity(q => Math.min(stock, q + 1))}
                        disabled={stock === 0}
                        className="w-14 h-14 bg-gray-200 rounded-xl hover:bg-gray-300 disabled:opacity-50 transition-colors font-bold text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className="w-full py-5 px-8 bg-gradient-to-r from-primary to-secondary text-white text-xl font-bold rounded-2xl shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:from-gray-400 disabled:to-gray-400 disabled:transform-none disabled:cursor-not-allowed"
              >
                {stock === 0 ? 'Hết hàng' : '🛒 Thêm vào giỏ hàng'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCost;