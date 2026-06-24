import Product from './Product';
import ServicePackage from './ServicePackage';

const Home = ({ products }) => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Products ────────────────────────────────────────── */}
      <section id="products" className="max-w-6xl mx-auto px-6 py-16">
        <Product products={products} />
      </section>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6">
        <hr className="border-gray-100" />
      </div>

      {/* ── Service Packages ────────────────────────────────── */}
      <section id="services" className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Gói dịch vụ</h2>
          <p className="text-sm text-gray-400 mt-1">Chọn gói phù hợp với nhu cầu của bạn</p>
        </div>
        <ServicePackage />
      </section>

      {/* ── Footer CTA ──────────────────────────────────────── */}
      <section className="bg-indigo-50 border-t border-indigo-100">
        <div className="max-w-6xl mx-auto px-6 py-14 flex flex-col items-center text-center gap-4">
          <h3 className="text-xl font-bold text-gray-900">Bắt đầu mua sắm ngay hôm nay</h3>
          <p className="text-sm text-gray-400 max-w-sm">
            Đăng ký tài khoản để nhận ưu đãi độc quyền và theo dõi đơn hàng của bạn.
          </p>
          <a
            href="/signup"
            className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-full transition-colors"
          >
            Đăng ký miễn phí
          </a>
        </div>
      </section>

    </div>
  );
};

export default Home;