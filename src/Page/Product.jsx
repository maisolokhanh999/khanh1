import { useState, useEffect, useRef } from 'react';
import ProductCost from '../Components/ProductCost.jsx';

const Product = ({ products = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState('');
  const productRef = useRef(null);

  // Scroll khi đổi category
  useEffect(() => {
    if (!productRef.current) return;
    const timer = setTimeout(() => {
      const y = productRef.current.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  // Danh sách category không trùng, không null
  const categories = [...new Set(products.map(p => p.categoryId?.name).filter(Boolean))];

  // Lọc sản phẩm
  const filtered = products.filter(item => {
    const matchCat = selectedCategory ? item.categoryId?.name === selectedCategory : true;
    const matchSearch = (item.name || item.title || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Hiện trang chi tiết
  if (selectedProduct) {
    return (
      <ProductCost
        key={selectedProduct._id || selectedProduct.id}
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm</h1>
          <p className="text-gray-400 text-sm">
            {filtered.length} sản phẩm{selectedCategory ? ` trong "${selectedCategory}"` : ''}
          </p>
        </div>

        {/* ── Filter + Search ── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                !selectedCategory
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-500'
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-500'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 gap-2 w-full md:w-64 focus-within:border-indigo-400 transition-colors">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="bg-transparent outline-none flex-1 text-sm text-gray-700 placeholder:text-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-300 hover:text-gray-500 text-xs">✕</button>
            )}
          </div>
        </div>

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400 gap-3">
            <span className="text-5xl">🔍</span>
            <p className="text-sm">Không tìm thấy sản phẩm nào</p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory(null); }}
              className="text-xs text-indigo-500 hover:underline"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div
            ref={productRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filtered.map((item) => (
              <div
                key={item._id || item.id}
                onClick={() => setSelectedProduct(item)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 cursor-pointer group transition-all duration-200"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-52 bg-gray-100">
                  <img
                    src={item.thumbnail}
                    alt={item.name || item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.discountPercentage > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      -{item.discountPercentage}%
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-xs text-indigo-400 mb-1 font-medium">
                    {item.categoryId?.name || 'Chưa phân loại'}
                  </p>
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-3 leading-snug">
                    {item.name || item.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-500 font-bold text-lg">
                      ${item.price?.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-300 group-hover:text-indigo-400 transition-colors font-medium">
                      Xem →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;