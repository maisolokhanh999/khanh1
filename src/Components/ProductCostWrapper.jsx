import { useParams, useNavigate } from 'react-router';
import ProductCost from './ProductCost';

const ProductCostWrapper = ({ products }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = (products || []).find(p => p.id === Number(id));

  if (!product) return <p>Loading...</p>;

  return (
    <ProductCost
      product={product}
      onBack={() => navigate(-1)}
    />
  );
};

export default ProductCostWrapper;