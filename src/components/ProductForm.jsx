import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// This is the core reusable form for both creating and editing products.
export default function ProductForm({ title, initialData, onSave }) {
  // Hook for navigation after saving/cancelling.
  const navigate = useNavigate();

  // Defines the structure and initial empty values for the product data.
  const defaultState = {
    productId: '',
    name: '',
    sku: '',
    category: '',
    description: '',
    brand: '',
    price: '',
    inStock: '',
    location: '',
    expirationDate: '',
    supplierName: '',
  };

  // formData holds the current state of the form inputs.
  // It initializes with existing data (for edit) or defaults (for add).
  const [formData, setFormData] = useState(initialData || defaultState);
  // Stores the list of suppliers fetched from the backend.
  const [suppliers, setSuppliers] = useState([]);
  // Stores validation messages for form fields.
  const [errors, setErrors] = useState({});

  // useEffect to reset the form data whenever `initialData` changes (e.g., switching from one edit item to another).
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultState);
    }
    // Always clear errors on reset/load.
    setErrors({});
  }, [initialData]);

  // Generic handler for all form inputs. Updates state based on input `name`.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear any specific error message as the user starts typing again.
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Function to check all required fields and number formats.
  const validateForm = () => {
    let newErrors = {};

    // Basic checks for required text fields.
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required.";
    if (!formData.category.trim()) newErrors.category = "Category is required.";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required.";

    // Validation for Price: must be a number > 0.
    const priceValue = parseFloat(formData.price);
    if (!formData.price || isNaN(priceValue) || priceValue <= 0)
      newErrors.price = "Price is required and must be greater than zero.";

    // Validation for Stock: must be a number >= 0.
    const stockValue = parseInt(formData.inStock);
    if (!formData.inStock || isNaN(stockValue) || stockValue < 0)
      newErrors.inStock = "Stock is required and must be a valid number";

    if (!formData.location.trim()) newErrors.location = "Location is required.";

    // Update the error state and return true if no errors were found.
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Simple client-side ID generation for new products (not ideal for real backends).
  function generateId() {
    return `id_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  // Handles form submission after the user clicks 'Save'.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // If this is a new product (no existing ID), generate one.
      if (!formData.productId) formData.productId = generateId();

      // Call the external save handler function passed via props.
      onSave(formData);

      const action = initialData ? 'updated' : 'created';
      console.log(`Product ${action} successfully:`, formData);

      // Redirect back to the inventory list after successful save.
      navigate('/inventory');
    } else {
      console.error("Validation failed", errors);
    }
  };

  // Helper for conditional Tailwind class to show a red border on errors.
  const inputErrorClass = (fieldName) =>
    errors[fieldName] ? 'border-red-500' : 'border-gray-700';

  // Component to display the required asterisk next to mandatory fields.
  const RequiredAsterisk = ({ fieldName }) => {
    const isRequired = ['name', 'sku', 'category', 'brand', 'price', 'inStock', 'location'].includes(fieldName);
    return isRequired ? <span className="text-red-500">*</span> : null;
  };

  // Ref to prevent the supplier fetch from running multiple times in development mode.
  const didFetch = useRef(false);

  // Fetch the supplier list from an endpoint.
  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    // Simple fetch request for supplier data.
    fetch('/suppliers')
      .then((response) => response.json())
      .then((data) => {
        setSuppliers(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
      });
  }, []);


  // --- JSX Rendering ---
  return (
    <div className="max-w-5xl mx-auto py-10">
      {/* Page Header */}
      <div className="mb-6">
        <span className="text-sm text-gray-400">Products / {title}</span>
        <h1 className="text-3xl font-extrabold text-white mt-1">{title}</h1>
        <p className="text-gray-400 mt-1">
          Update the product details below. Fields marked with an asterisk are required.
        </p>
      </div>

      {/* Product Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/50 p-8 rounded-xl shadow-2xl border border-gray-700"
      >

        {/* Form fields structured in a 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

          {/* Full-width field: Product Name */}
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

          {/* SKU field: Disabled if initialData is present (prevents changing SKU on edit). */}
          <div>
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

          {/* Category field */}
          <div>
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

          {/* Price field with dollar sign prefix */}
          <div>
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

          {/* In Stock quantity field */}
          <div>
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

          {/* Brand field */}
          <div>
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

          {/* Location field */}
          <div>
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

          {/* Expiration Date field (optional) */}
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

          {/* Supplier dropdown (populated from fetch) */}
          <div>
            <label htmlFor="supplierName" className="block text-sm font-medium text-gray-300 mb-1">
              Supplier
            </label>
            <select
              id="supplierName"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              className={`w-full bg-gray-800 border ${inputErrorClass('supplier')} rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 shadow-inner`}
            >
              <option value="">Select a Supplier</option>
              {
                // Map the fetched suppliers to options in the dropdown.
                suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)
              }
            </select>
            {errors.supplierName && <span className="text-xs text-red-500 mt-1">{errors.supplierName}</span>}
          </div>

        </div>

        {/* Description field (full width) */}
        <div className="mt-6">
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

        {/* Form Actions (Cancel/Save) */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={() => navigate('/inventory')} // Navigates away without saving.
            className="px-6 py-3 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-500 transition-colors shadow-md"
          >
            Cancel
          </button>
          <button
            type="submit" // Triggers handleSubmit.
            className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-colors shadow-lg shadow-teal-700/50"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}