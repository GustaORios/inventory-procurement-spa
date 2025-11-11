import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Componente da Tabela de Inventário
function InventoryTable({ products }) {
    // Estado para rastrear os SKUs selecionados
    const [selectedSkus, setSelectedSkus] = useState([]);
    
    // Função para adicionar/remover SKU da seleção
    const handleSelect = (sku) => {
        setSelectedSkus(prev => 
            prev.includes(sku) 
                ? prev.filter(s => s !== sku)
                : [...prev, sku]
        );
    };
    
    // Função para selecionar/desselecionar TODOS
    const handleSelectAll = () => {
        if (selectedSkus.length === products.length) {
            setSelectedSkus([]);
        } else {
            setSelectedSkus(products.map(p => p.sku));
        }
    };
    
    // Renderiza a célula de Status (OK, ALERT, CRITICAL)
    const renderStatus = (inStock) => {
        let statusClass = 'bg-green-600';
        let statusText = 'OK';
        
        if (inStock <= 5 && inStock > 0) {
            statusClass = 'bg-yellow-500';
            statusText = 'ALERT';
        } else if (inStock === 0) {
            statusClass = 'bg-red-600';
            statusText = 'CRITICAL';
        }

        return (
            // Estilo de badge
            <span className={`px-2 py-1 text-xs font-semibold text-white rounded-md ${statusClass}`}>
                {statusText}
            </span>
        );
    };

    const handleDelete = (sku) => {
        // Ação de Deletar (Substituir por um modal real)
        console.log(`Abrindo modal para deletar produto SKU: ${sku}`);
    };

    return (
        // Contêiner da tabela com estilo profissional dark mode
        <div className="bg-gray-900/50 shadow-xl rounded-xl overflow-hidden border border-gray-700">
            <table className="min-w-full text-left">
                {/* Cabeçalho da Tabela */}
                <thead className="bg-gray-800 uppercase text-xs text-gray-400 font-medium tracking-wider">
                    <tr>
                        <th scope="col" className="px-3 py-3 w-10">
                            {/* Checkbox Master */}
                            <input 
                                type="checkbox"
                                checked={selectedSkus.length === products.length && products.length > 0}
                                onChange={handleSelectAll}
                                className="h-4 w-4 text-teal-500 border-gray-600 rounded bg-gray-700 cursor-pointer focus:ring-teal-500"
                            />
                        </th>
                        {/* NOVO: Coluna SKU */}
                        <th scope="col" className="px-3 py-3">SKU</th>
                        <th scope="col" className="px-6 py-3">Product Name</th>
                        <th scope="col" className="px-6 py-3">Category</th>
                        
                        <th scope="col" className="px-4 py-3 text-right">Price</th>
                        <th scope="col" className="px-4 py-3 text-center">Stock</th>
                        <th scope="col" className="px-6 py-3">Exp. Date</th>

                        <th scope="col" className="px-6 py-3">Last Update</th> 
                        <th scope="col" className="px-6 py-3">Status</th>      
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-700">
                    {products.length === 0 ? (
                        <tr>
                            {/* Ajuste do colSpan para 10 colunas (1 checkbox + 9 headers) */}
                            <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                                Nenhum produto cadastrado.
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.sku} className="hover:bg-gray-800 transition-colors">
                                
                                {/* Coluna Checkbox */}
                                <td className="px-3 py-4">
                                    <input 
                                        type="checkbox"
                                        checked={selectedSkus.includes(product.sku)}
                                        onChange={() => handleSelect(product.sku)}
                                        className="h-4 w-4 text-teal-500 border-gray-600 rounded bg-gray-700 cursor-pointer focus:ring-teal-500"
                                    />
                                </td>

                                {/* NOVO: Exibir o SKU */}
                                <td className="px-3 py-4 text-gray-500 font-mono text-xs">{product.sku}</td>
                                
                                <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                                <td className="px-6 py-4 text-gray-300">{product.category}</td>

                                {/* Dados Financeiros e de Estoque */}
                                <td className="px-4 py-4 text-right text-teal-400 font-mono">
                                    ${parseFloat(product.price).toFixed(2)}
                                </td>
                                <td className="px-4 py-4 text-center text-white font-semibold">
                                    {product.inStock}
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    {product.expirationDate || 'N/A'}
                                </td>
                                
                                {/* Dados Mockados */}
                                <td className="px-6 py-4 text-gray-400 text-sm">23/11/2025 - 14:30</td> 
                                <td className="px-6 py-4">{renderStatus(product.inStock)}</td>
                                
                                {/* Coluna Actions (Texto discreto) */}
                                <td className="px-6 py-4">
                                    <div className="flex gap-4 text-sm font-medium">
                                        
                                        {/* Link EDITAR */}
                                        <Link
                                            to={`/inventory/edit/${product.sku}`}
                                            title="Edit"
                                            className="text-gray-400 hover:text-blue-400 transition-colors"
                                        >
                                            Edit
                                        </Link>
                                        
                                        {/* Botão DELETAR */}
                                        <button
                                            onClick={() => handleDelete(product.sku)}
                                            title="Delete"
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            
            {/* Paginação profissional */}
            <div className="flex justify-between items-center px-4 py-3 border-t border-gray-700 bg-gray-800/50 text-sm">
                <span className='text-gray-400 text-sm'>
                    Showing 1 to {products.length} of {products.length} entries
                </span>
                <div className="flex gap-1">
                    <button className="text-gray-400 px-3 py-1 rounded hover:bg-gray-700 transition-colors"> &lt; </button>
                    <span className="text-white px-3 py-1 bg-teal-600 rounded cursor-pointer font-semibold">1</span>
                    <button className="text-gray-400 px-3 py-1 rounded hover:bg-gray-700 transition-colors"> &gt; </button>
                </div>
            </div>

        </div>
    );
}


// --- Componente principal da página de Inventário ---
export default function Inventory({ products }) {
    // Estado para a busca e filtro (simulados)
    const [searchTerm, setSearchTerm] = useState('');
    
    // Simples filtragem
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto py-10">
            
            <h1 className="text-3xl font-extrabold text-white mb-6">Inventory Management</h1>
            
            {/* Barra de Ferramentas (Search, Filter, Add Button) */}
            <div className="flex justify-between items-center mb-8">
                
                {/* Search e Filter (inputs maiores e alinhados) */}
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="🔍 Search Product Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        // Estilo profissional
                        className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 w-80 shadow-inner"
                    />
                    <select
                        // Estilo profissional
                        className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-teal-500 focus:border-teal-500 shadow-inner"
                    >
                        <option value="">Filter by Availability</option>
                        <option value="ok">OK</option>
                        <option value="alert">ALERT</option>
                        <option value="critical">CRITICAL</option>
                    </select>
                </div>
                
                {/* Botão Add New Product + (Estilo Teal) */}
                <Link
                    to="/inventory/add"
                    // Botão estilo profissional que você pediu
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-colors shadow-lg shadow-teal-700/50 transform hover:scale-[1.01]"
                >
                    Add New Product +
                </Link>
            </div>

            <InventoryTable products={filteredProducts} />
        </div>
    );
}