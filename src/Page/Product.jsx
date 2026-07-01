import { useState, useEffect, useRef } from 'react';
import ProductCost from '../Components/ProductCost.jsx';

const Product = ({ products = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productRef = useRef(null);
  const itemsPerPage = 8;

  useEffect(() => {
    if (!productRef.current) return;
    const timer = setTimeout(() => {
      const y = productRef.current.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedCategory, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, search]);

  const categories = [...new Set(products.map((p) => p.categoryId?.name).filter(Boolean))];

  const filtered = products.filter((item) => {
    const matchCat = selectedCategory ? item.categoryId?.name === selectedCategory : true;
    const matchSearch = (item.name || item.title || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [selectedProduct]);

  const pagedProducts = filtered.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);
  const displayedCount = pagedProducts.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pt-4">
      <div className="page-container py-10 sm:py-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedCategory
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-500'
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-500'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2.5 gap-2 w-full lg:w-80 shadow-sm focus-within:border-indigo-400 focus-within:shadow-md transition-all">
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
              <button type="button" onClick={() => setSearch('')} className="text-gray-300 hover:text-gray-500 text-xs">
                ✕
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-[24px] border border-dashed border-gray-200 bg-white shadow-sm">
            <span className="text-5xl mb-3">🔍</span>
            <p className="text-base font-medium text-gray-700">Không tìm thấy sản phẩm nào</p>
            <p className="text-sm text-gray-400 mt-1">Hãy thử xóa bộ lọc hoặc tìm kiếm từ khóa khác.</p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory(null);
              }}
              className="mt-4 text-sm font-semibold text-indigo-500 hover:text-indigo-600"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <>
            <div
              ref={productRef}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 justify-items-center"
            >
              {pagedProducts.map((item) => {
                const discount = Number(item.discountPercentage || 0);

                return (
                  <div
                    key={item._id || item.id}
                    onClick={() => setSelectedProduct(item)}
                    className="group bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative overflow-hidden h-56 bg-gray-100">
                      <img
                        src={item.image || 'https://placehold.co/300x300?text=No+Image'}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {discount > 0 && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                          -{discount}%
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    <div className="p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400 mb-2">
                        {item.categoryId?.name || 'Chưa phân loại'}
                      </p>
                      <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-3 leading-snug min-h-[2.6rem]">
                        {item.name || item.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-indigo-600 font-bold text-lg">
                          ${item.price?.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400 group-hover:text-indigo-500 transition-colors font-medium">
                          Xem chi tiết →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-500">
                Hiển thị {displayedCount} trên {filtered.length} sản phẩm
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={safePage === 1}
                  className="rounded-full border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 w-9 rounded-full text-sm font-semibold transition-all ${safePage === page
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-500'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={safePage === totalPages}
                  className="rounded-full border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-auto p-4 pt-24"
          onClick={() => setSelectedProduct(null)}
        >
          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <ProductCost
              key={selectedProduct._id || selectedProduct.id}
              product={selectedProduct}
              onBack={() => setSelectedProduct(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;