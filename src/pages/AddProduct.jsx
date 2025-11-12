import React from 'react';
import ProductForm from '../components/ProductForm'; 


export default function AddProduct({ onAdd }) {
 
  const handleSave = (formData) => {
    
    const newProduct = {
      ...formData,
      price: parseFloat(formData.price || 0), 
      inStock: parseInt(formData.inStock || 0, 10), 
    };
    
    onAdd(newProduct);
  };

  return (
    <ProductForm 
      title="Add New Product"
      
      onSave={handleSave}
    />
  );
}