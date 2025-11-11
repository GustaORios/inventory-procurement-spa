import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductForm({ title, initialData, onSave }) {
  const navigate = useNavigate();
  
  // ATUALIZADO: 'supplier' trocado por 'brand'
  const defaultState = {
    name: '',
    sku: '',
    category: '', // Agora como texto
    description: '', 
    brand: '', // Novo nome do campo
    price: '',
    inStock: '',
    location: '', 
    expirationDate: '',
  };

  const [formData, setFormData] = useState(initialData || defaultState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultState);
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validações para os campos obrigatórios (Brand, Category, SKU, Price, In Stock, Location)
  const validateForm = () => {
    let newErrors = {};
    
    // Campos Obrigatórios (todos checados pelo .trim() ou verificação numérica)
    if (!formData.name.trim()) newErrors.name = "O nome é obrigatório.";
    if (!formData.sku.trim()) newErrors.sku = "O SKU é obrigatório.";
    if (!formData.category.trim()) newErrors.category = "A categoria é obrigatória.";
    if (!formData.brand.trim()) newErrors.brand = "A marca é obrigatória.";
    
    // Validação numérica e obrigatória
    const priceValue = parseFloat(formData.price);
    if (!formData.price || isNaN(priceValue) || priceValue <= 0) 
        newErrors.price = "O preço é obrigatório e deve ser maior que zero.";
        
    const stockValue = parseInt(formData.inStock);
    if (!formData.inStock || isNaN(stockValue) || stockValue < 0) 
        newErrors.inStock = "O estoque é obrigatório e deve ser um número válido (>= 0).";
        
    if (!formData.location.trim()) newErrors.location = "A localização é obrigatória.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      const action = initialData ? 'updated' : 'created';
      console.log(`Product ${action} successfully:`, formData);
      navigate('/inventory');
    } else {
        console.error("Validation failed", errors);
    }
  };

  const inputErrorClass = (fieldName) => 
    errors[fieldName] ? 'border-red-500' : 'border-gray-700';

  // Função auxiliar para renderizar o asterisco de campo obrigatório
  const RequiredAsterisk = ({ fieldName }) => {
      // Lista de campos obrigatórios
      const isRequired = ['name', 'sku', 'category', 'brand', 'price', 'inStock', 'location'].includes(fieldName);
      return isRequired ? <span className="text-red-500">*</span> : null;
  };

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
        className="bg-gray-900/50 p-8 rounded-xl shadow-2xl border border-gray-700"
      >
        
        {/* NOVO LAYOUT: Grid de 2 colunas para campos principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          {/* Product Name (Largura Total) */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Product Name <RequiredAsterisk fieldName="name" />
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full bg-gray-800 border ${inputErrorClass('name')} rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 shadow-inner`}
            />
            {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name}</span>}
          </div>

          {/* LINHA 1: SKU e Category */}
          <div>
            {/* SKU */}
            <label htmlFor="sku" className="block text-sm font-medium text-gray-300 mb-1">
              SKU <RequiredAsterisk fieldName="sku" />
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              disabled={!!initialData} 
              className={`w-full bg-gray-800 border ${inputErrorClass('sku')} rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 shadow-inner ${initialData ? 'opacity-50 cursor-not-allowed border-gray-800' : ''}`}
            />
            {errors.sku && <span className="text-xs text-red-500 mt-1">{errors.sku}</span>}
          </div>

          <div>
            {/* Category (AGORA COMO INPUT TEXT) */}
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
              Category <RequiredAsterisk fieldName="category" />
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full bg-gray-800 border ${inputErrorClass('category')} rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 shadow-inner`}
            />
            {errors.category && <span className="text-xs text-red-500 mt-1">{errors.category}</span>}
          </div>
          
          {/* LINHA 2: Price e In Stock */}
          <div>
            {/* Price */}
            <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
              Price <RequiredAsterisk fieldName="price" />
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 font-semibold">$</span>
              <input
                type="number"
                step="0.01"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full bg-gray-800 border ${inputErrorClass('price')} rounded-lg p-3 pl-8 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 shadow-inner`}
              />
            </div>
            {errors.price && <span className="text-xs text-red-500 mt-1">{errors.price}</span>}
          </div>

          <div>
            {/* In Stock */}
            <label htmlFor="inStock" className="block text-sm font-medium text-gray-300 mb-1">
              In Stock <RequiredAsterisk fieldName="inStock" />
            </label>
            <input
              type="number"
              id="inStock"
              name="inStock"
              value={formData.inStock}
              onChange={handleChange}
              className={`w-full bg-gray-800 border ${inputErrorClass('inStock')} rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 shadow-inner`}
            />
            {errors.inStock && <span className="text-xs text-red-500 mt-1">{errors.inStock}</span>}
          </div>
          
          {/* LINHA 3: Brand e Location */}
          <div>
            {/* Brand (NOVO NOME) */}
            <label htmlFor="brand" className="block text-sm font-medium text-gray-300 mb-1">
              Brand <RequiredAsterisk fieldName="brand" />
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={`w-full bg-gray-800 border ${inputErrorClass('brand')} rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 shadow-inner`}
            />
            {errors.brand && <span className="text-xs text-red-500 mt-1">{errors.brand}</span>}
          </div>

          <div>
            {/* Location (Obrigatório) */}
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
              Location <RequiredAsterisk fieldName="location" />
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full bg-gray-800 border ${inputErrorClass('location')} rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 shadow-inner`}
            />
            {errors.location && <span className="text-xs text-red-500 mt-1">{errors.location}</span>}
          </div>

          {/* LINHA 4: Expiration Date (Agora ocupa a primeira coluna) */}
          <div>
            <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-300 mb-1">
              Expiration Date
            </label>
            <input
              type="date"
              id="expirationDate"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-teal-500 focus:border-teal-500 shadow-inner"
            />
          </div>
          
          {/* Coluna vazia para alinhar a data de expiração (Não renderizada) */}
          <div></div> 

        </div>
        
        {/* DESCRIÇÃO (Abaixo do Grid Principal, Largura Total) */}
        <div className="mt-6">
            {/* Description (OPCIONAL) */}
            <div className="md:col-span-2">
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
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 shadow-inner resize-none"
              ></textarea>
            </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={() => navigate('/inventory')}
            className="px-6 py-3 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-500 transition-colors shadow-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-colors shadow-lg shadow-teal-700/50"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}