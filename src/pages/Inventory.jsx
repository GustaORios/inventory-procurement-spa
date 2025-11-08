import React from 'react';
import { Link } from 'react-router-dom';

function InventoryTable({ products }) {
  return (
    <div className="bg-card shadow-lg rounded-lg overflow-hidden">
      <table className="min-w-full text-left">
        <thead className="bg-input-bg uppercase text-sm text-gray-300">
          <tr>
            <th scope="col" className="px-6 py-3">SKU</th>
            <th scope="col" className="px-6 py-3">Product Name</th>
            <th scope="col" className="px-6 py-3">Category</th>
            <th scope="col" className="px-6 py-3">Price</th>
            <th scope="col" className="px-6 py-3">In Stock</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        
        {/* CORPO DA TABELA: Aqui está a correção */}
        <tbody className="divide-y divide-gray-700">
          
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                Nenhum produto cadastrado.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.sku} className="hover:bg-gray-800">
                <td className="px-6 py-4 font-mono text-accent">{product.sku}</td>
                <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                <td className="px-6 py-4 text-gray-300">{product.category}</td>
                <td className="px-6 py-4 text-gray-300">
                  {typeof product.price === 'number' 
                    ? product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
                    : product.price
                  }
                </td>
                <td className="px-6 py-4 text-gray-300">{product.inStock}</td>
                
                {/* Coluna Actions (Estilização de Botões) */}
                <td className="px-6 py-4">
                  <div className="flex gap-2 text-sm">
                    <Link
                      to={`/inventory/edit/${product.sku}`}
                      title="Edit Product"
                      className="text-white px-2 py-1 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors text-xs font-semibold"
                    >
                      Editar
                    </Link>
                    
                    <button
                      onClick={() => alert(`Deletar produto SKU: ${product.sku}`)}
                      title="Delete Product"
                      className="text-white px-2 py-1 rounded-full bg-red-600 hover:bg-red-500 transition-colors text-xs font-semibold"
                    >
                      Deletar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
        
      </table>
    </div>
  );
}

export default function Inventory({ products }) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Inventory</h1>
          <p className="text-gray-400 mt-1">Manage all products in your inventory.</p>
        </div>
        
        {/* BOTÃO "Add Product": CORRIGIDO AQUI */}
        <Link
          to="/inventory/add"
          // Classes para combinar com o botão "Save Product"
          className="px-6 py-3 rounded-lg bg-accent text-white font-semibold hover:bg-opacity-90 transition-colors"
          // O "bg-accent" deve ser a cor teal que você está usando.
          // Ajustei o padding (px-6 py-3) e o arredondamento (rounded-lg) para ficar como na imagem.
        >
          Add Product
        </Link>
        
      </div>

      <InventoryTable products={products} />
    </div>
  );
}