import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductForm({ title, initialData, onSave }) {
  const navigate = useNavigate();
  
  const defaultState = {
    name: '',
    sku: '',
    category: '',
    description: 'A high-definition 24-inch monitor with vibrant colors and a sleek, modern design.\nPerfect for both professional and gaming setups.', 
    supplier: '',
    price: '',
    inStock: '',
  };

  const [formData, setFormData] = useState(initialData || defaultState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultState);
    }
    setErrors({}); // Limpa erros ao mudar o modo (Create/Edit)
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "This field is required";
    if (!formData.sku.trim()) newErrors.sku = "This field is required";
    // Adicionar mais validações aqui conforme necessário
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      // Aqui você poderia mostrar um modal de sucesso ao invés de alert
      const action = initialData ? 'updated' : 'created';
      console.log(`Product ${action} successfully:`, formData);
      navigate('/inventory');
    } else {
        console.error("Validation failed", errors);
    }
  };

  const inputErrorClass = (fieldName) => 
    errors[fieldName] ? 'border-red-500' : 'border-gray-700'; // Ajustado de gray-600 para gray-700

  return (
    <div className="max-w-5xl mx-auto py-10">
      {/* Cabeçalho */}
      <div className="mb-6">
        <span className="text-sm text-gray-400">Products / {title}</span>
        <h1 className="text-3xl font-extrabold text-white mt-1">{title}</h1>
        <p className="text-gray-400 mt-1">
          Update the product details below. Fields marked with an asterisk are required.
        </p>
      </div>

      {/* Formulário: Card Dark Mode Profissional */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-gray-900/50 p-8 rounded-xl shadow-2xl border border-gray-700" // Aplicado o estilo de card
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Coluna 1: Nome e Descrição */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                // Estilo de input profissional Dark Mode (bg-gray-800, text-white, focus:teal)
                className={`w-full bg-gray-800 border ${inputErrorClass('name')} rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 shadow-inner`}
              />
              {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name}</span>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="6"
                value={formData.description}
                onChange={handleChange}
                spellCheck="false"
                // Estilo de input profissional Dark Mode
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 shadow-inner resize-none"
              ></textarea>
            </div>
          </div>

          {/* Coluna 2: Detalhes */}
          <div className="space-y-6">
            {/* SKU */}
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-300 mb-1">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                disabled={!!initialData} 
                // Estilo de input profissional Dark Mode (ajustado para campo desabilitado)
                className={`w-full bg-gray-800 border ${inputErrorClass('sku')} rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 shadow-inner ${initialData ? 'opacity-50 cursor-not-allowed border-gray-800' : ''}`}
              />
              {errors.sku && <span className="text-xs text-red-500 mt-1">{errors.sku}</span>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                // Estilo de select profissional Dark Mode
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-teal-500 focus:border-teal-500 shadow-inner"
              >
                <option value="" disabled className="bg-gray-900 text-gray-500">Select a category</option>
                <option value="Monitores" className="bg-gray-900">Monitores</option>
                <option value="Periféricos" className="bg-gray-900">Periféricos</option>
                <option value="Hardware" className="bg-gray-900">Hardware</option>
              </select>
            </div>

            {/* Supplier */}
            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-300 mb-1">
                Supplier
              </label>
              <select
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                // Estilo de select profissional Dark Mode
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-teal-500 focus:border-teal-500 shadow-inner"
              >
                <option value="" disabled className="bg-gray-900 text-gray-500">Select a supplier</option>
                <option value="TechImports" className="bg-gray-900">TechImports</option>
                <option value="GamerGear" className="bg-gray-900">GamerGear</option>
              </select>
            </div>

            {/* Price & In Stock (lado a lado) */}
            <div className="flex gap-4">
              {/* Price */}
              <div className="flex-1">
                <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
                  Price
                </label>
                <div className="relative">
                  {/* Símbolo $ estilizado */}
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 font-semibold">$</span>
                  <input
                    type="number"
                    step="0.01"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    // Estilo de input profissional Dark Mode (com padding extra para o $)
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 pl-8 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 shadow-inner"
                  />
                </div>
              </div>
              
              {/* In Stock */}
              <div className="flex-1">
                <label htmlFor="inStock" className="block text-sm font-medium text-gray-300 mb-1">
                  In Stock
                </label>
                <input
                  type="number"
                  id="inStock"
                  name="inStock"
                  value={formData.inStock}
                  onChange={handleChange}
                  // Estilo de input profissional Dark Mode
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botões: Estilo consistente com o Inventory.jsx */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={() => navigate('/inventory')}
            // Botão Secundário (Cinza Escuro)
            className="px-6 py-3 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-500 transition-colors shadow-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            // Botão Primário (Teal)
            className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-colors shadow-lg shadow-teal-700/50"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}