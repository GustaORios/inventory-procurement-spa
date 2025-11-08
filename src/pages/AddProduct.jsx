import React from 'react';
import ProductForm from '../components/ProductForm';

export default function AddProduct({ onAdd }) {
  
  // A função 'onSave' aqui será a função 'onAdd' vinda do App.jsx
  const handleSave = (formData) => {
    // Converte preço e estoque para números antes de salvar
    const newProduct = {
      ...formData,
      price: parseFloat(formData.price),
      inStock: parseInt(formData.inStock, 10),
    };
    onAdd(newProduct);
  };

  return (
    <ProductForm 
      title="Add Product"
      onSave={handleSave}
    />
  );
}