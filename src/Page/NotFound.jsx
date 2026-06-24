const NotFound = () => {
  return (
    <div className="container mx-auto py-8 text-center">
      <h1 className="text-6xl font-bold text-gray-500 mb-4">404</h1>
      <h2 className="text-2xl mb-4">Page Not Found</h2>
      <a href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Go Home</a>
    </div>
  );
};

export default NotFound;
