import React from 'react';
import ProductForm from '../components/ProductForm'; // Ajuste o caminho se necessário

// Exporta e declara o componente APENAS UMA VEZ
export default function AddProduct({ onAdd }) {
  
  // Esta função irá pre-processar os dados do formulário
  // e chamar o onAdd (função de atualização no App.jsx)
  const handleSave = (formData) => {
    // 💡 IMPORTANTE: Converte preço e estoque para números antes de salvar
    const newProduct = {
      ...formData,
      price: parseFloat(formData.price || 0), // Use 0 se estiver vazio
      inStock: parseInt(formData.inStock || 0, 10), // Use 0 se estiver vazio
    };
    
    // Chama a função onAdd (vindo do App.jsx) com o novo produto formatado
    onAdd(newProduct);
  };

  return (
    <ProductForm 
      title="Add New Product"
      // Passa a função handleSave (com a conversão de tipos) para o ProductForm
      onSave={handleSave}
    />
  );
}