import React from 'react';
import { useParams } from 'react-router-dom';
import ProductForm from '../components/ProductForm';

export default function EditProduct({ onEdit, getProduct }) {
  const { sku } = useParams(); // Pega o 'sku' da URL (ex: /edit/MON-24-GAM)
  const productToEdit = getProduct(sku);

  // A função 'onSave' aqui será a função 'onEdit' vinda do App.jsx
  const handleSave = (formData) => {
    const updatedProduct = {
      ...formData,
      price: parseFloat(formData.price),
      inStock: parseInt(formData.inStock, 10),
    };
    onEdit(sku, updatedProduct);
  };

  if (!productToEdit) {
    return (
      <div className="text-center text-red-500 text-lg">
        Produto com SKU "{sku}" não encontrado.
      </div>
    );
  }

  return (
    <ProductForm 
      title="Edit Product"
      initialData={productToEdit}
      onSave={handleSave}
    />
  );
}