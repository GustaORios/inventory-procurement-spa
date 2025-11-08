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
    }
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      navigate('/inventory');
    }
  };

  const inputErrorClass = (fieldName) => 
    errors[fieldName] ? 'border-red-500' : 'border-gray-600';

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-4">
        <span className="text-sm text-gray-400">Products / {title}</span>
        <h1 className="text-3xl font-bold text-white mt-1">{title}</h1>
        <p className="text-gray-400 mt-1">
          Update the product details below. Fields marked with an asterisk are required
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow-lg">
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
                // Adicionado autofill aqui
                className={`w-full bg-input-bg border ${inputErrorClass('name')} rounded-md p-2 text-black placeholder-gray-400 focus:ring-accent focus:border-accent autofill:text-gray-900`}
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
                // CORREÇÃO: Adicionado autofill aqui também
                className="w-full bg-input-bg border border-gray-600 rounded-md p-2 text-black placeholder-gray-400 focus:ring-accent focus:border-accent autofill:text-gray-900"
              ></textarea>
              
            </div>
          </div>

          {/* Coluna 2: SKU, Categoria, Supplier, Preço, Estoque */}
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
                // Adicionado autofill aqui
                className={`w-full bg-input-bg border ${inputErrorClass('sku')} rounded-md p-2 text-black placeholder-gray-400 focus:ring-accent focus:border-accent ${initialData ? 'opacity-70 cursor-not-allowed' : ''} autofill:text-gray-900`}
              />
              {errors.sku && <span className="text-xs text-red-500 mt-1">{errors.sku}</span>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-bl-300 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-input-bg border border-gray-600 rounded-md p-2 text-black focus:ring-accent focus:border-accent"
              >
                <option value="">Select a category</option>
                <option value="Monitores">Monitores</option>
                <option value="Periféricos">Periféricos</option>
                <option value="Hardware">Hardware</option>
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
                className="w-full bg-input-bg border border-gray-600 rounded-md p-2 text-black focus:ring-accent focus:border-accent"
              >
                <option value="">Select a supplier</option>
                <option value="TechImports">TechImports</option>
                <option value="GamerGear">GamerGear</option>
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
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    // Adicionado autofill aqui
                    className="w-full bg-input-bg border border-gray-600 rounded-md p-2 pl-7 text-black placeholder-gray-400 focus:ring-accent focus:border-accent autofill:text-gray-900"
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
                  // Adicionado autofill aqui
                  className="w-full bg-input-bg border border-gray-600 rounded-md p-2 text-black placeholder-gray-400 focus:ring-accent focus:border-accent autofill:text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={() => navigate('/inventory')}
            className="px-4 py-2 rounded-md bg-gray-600 text-white font-semibold hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-accent text-white font-semibold hover:bg-opacity-90 transition-colors"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}