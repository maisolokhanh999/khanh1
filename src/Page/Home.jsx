import Product from './Product';
import ServicePackage from './ServicePackage';

const Home = ({ products }) => {
  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      <div className="page-container">
        {/* ── Products ────────────────────────────────────────── */}
        <section id="products" className="py-16">
          <Product products={products} />
        </section>

        {/* ── Service Packages ────────────────────────────────── */}
        <section id="services" className="py-16">
          <ServicePackage />
        </section>
      </div>
    </div>
  );
};

export default Home;