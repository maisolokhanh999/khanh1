const ServicePackage = () => {
  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-4xl font-serif font-bold mb-10 text-primary uppercase tracking-wider text-center">Các Gói Dịch Vụ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border border-outline-variant p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white">
          <h3 className="font-serif font-bold text-2xl mb-3 text-primary">Gói Cơ Bản</h3>
          <p className="text-xl font-bold text-secondary mb-4">$49/tháng</p>
          <ul className="mt-4 space-y-2 text-gray-600 font-sans">
            <li>• Hỗ trợ cơ bản</li>
            <li>• 1 tài khoản truy cập</li>
          </ul>
        </div>
        <div className="border border-outline-variant p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-primary-light">
          <h3 className="font-serif font-bold text-2xl mb-3 text-primary">Gói Cao Cấp</h3>
          <p className="text-xl font-bold text-secondary mb-4">$99/tháng</p>
          <ul className="mt-4 space-y-2 text-gray-700 font-sans">
            <li>• Hỗ trợ ưu tiên</li>
            <li>• Truy cập không giới hạn</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServicePackage;
