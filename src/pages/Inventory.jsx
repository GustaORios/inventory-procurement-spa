import React from 'react';
import { Link } from 'react-router-dom';

// Dados de exemplo para começar
const INITIAL_PRODUCTS = [
  { 
    id: 'MON-24-GAM', 
    name: 'Monitor Gamer 24"', 
    sku: 'MON-24-GAM', 
    category: 'Monitores', 
    description: 'Um monitor gamer com alta taxa de atualização.', 
    supplier: 'TechImports', 
    price: 1200.50, 
    inStock: 15 
  },
  { 
    id: 'TEC-MEC-01', 
    name: 'Teclado Mecânico RGB', 
    sku: 'TEC-MEC-01', 
    category: 'Periféricos', 
    description: 'Teclado com switches blue e iluminação RGB.', 
    supplier: 'GamerGear', 
    price: 350.00, 
    inStock: 30 
  },
];
// Este componente substitui seu 'TableCompo' com estilo Tailwind
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
                  {/* Formata o preço para R$ ou $ */}
                  {product.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </td>
                <td className="px-6 py-4 text-gray-300">{product.inStock}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <Link
                      to={`/inventory/edit/${product.sku}`}
                      className="text-blue-400 hover:text-blue-300"
                      title="Edit"
                    >
                    </Link>
                    <button
                      onClick={() => alert('Função Deletar não implementada')}
                      className="text-red-500 hover:text-red-400"
                      title="Delete"
                    >
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

// Componente principal da página de Inventário
export default function Inventory() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Inventory</h1>
          <p className="text-gray-400 mt-1">Manage all products in your inventory.</p>
        </div>
        <Link
          to="/inventory/add"
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-white font-semibold hover:bg-opacity-90 transition-colors"
        >
          Add Product
        </Link>
      </div>

      <InventoryTable products={INITIAL_PRODUCTS} />
    </div>
  );
}