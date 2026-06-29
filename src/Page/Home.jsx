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
    </div>
  );
};

export default Home;