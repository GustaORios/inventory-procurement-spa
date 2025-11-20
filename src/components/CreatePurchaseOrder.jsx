import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatePurchaseOrder({ title = "Create New Purchase Order" }) {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [errors, setErrors] = useState({});
  const didFetch = useRef(false);

  const defaultState = {
    supplierId: '',
    supplierName: '',
    deliveryDate: '',
  };

  const [formData, setFormData] = useState(defaultState);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    fetch('http://localhost:3000/suppliers')
      .then((response) => response.json())
      .then((data) => {
        setSuppliers(data);

        const onlySuppliers = data.filter(supplier => supplier.role === "supplier");

        setSuppliers(onlySuppliers);

      })
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
      });
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    if (name === 'supplierId' && value) {
      const selectedSupplier = suppliers.find(s => s.id === value);
      if (selectedSupplier) {
        newFormData.supplierName = selectedSupplier.name;
      } else {
        newFormData.supplierName = '';
      }
    }

    setFormData(newFormData);

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.supplierId.trim()) newErrors.supplierId = "Supplier is required.";
    if (!formData.deliveryDate.trim()) newErrors.deliveryDate = "Delivery date is required.";

    const today = new Date().toISOString().split('T')[0];
    if (formData.deliveryDate.trim() && formData.deliveryDate < today) {
      newErrors.deliveryDate = "Delivery date cannot be in the past.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function generateUniqueId() {
    return Date.now().toString();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.error("Validation failed", errors);
      return;
    }

    const finalData = {
      supplierId: formData.supplierId,
      supplierName: formData.supplierName,
      deliveryDate: formData.deliveryDate,

      id: generateUniqueId(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Pending',
      products: [],
      total: 0,
    };

    await fetch('http://localhost:3000/purchase-orders', { method: 'POST', body: JSON.stringify(finalData) });
    navigate(`/purchase-order/${finalData.id}`);
  };

  const inputErrorClass = (fieldName) =>
    errors[fieldName] ? 'border-red-500' : 'border-gray-700';

  const RequiredAsterisk = ({ fieldName }) => {
    const isRequired = ['supplierId', 'deliveryDate'].includes(fieldName);
    return isRequired ? <span className="text-red-500">*</span> : null;
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="mb-6">
        <span className="text-sm text-gray-400">Purchase Orders / {title}</span>
        <h1 className="text-3xl font-extrabold text-white mt-1">{title}</h1>
        <p className="text-gray-400 mt-1">
          Select the supplier and delivery date to create a new order.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/50 p-8 rounded-xl shadow-2xl border border-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

          <div>
            <label htmlFor="supplierId" className="block text-sm font-medium text-gray-300 mb-1">
              Supplier <RequiredAsterisk fieldName="supplierId" />
            </label>
            <select
              id="supplierId"
              name="supplierId"
              value={formData.supplierId}
              onChange={handleChange}
              className={`w-full bg-gray-800 border ${inputErrorClass('supplierId')} rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 shadow-inner`}
            >
              <option value="">Select a Supplier</option>
              {
                suppliers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))
              }
            </select>
            {errors.supplierId && <span className="text-xs text-red-500 mt-1">{errors.supplierId}</span>}
          </div>

          <div>
            <label htmlFor="supplierName" className="block text-sm font-medium text-gray-300 mb-1">
              Supplier Name
            </label>
            <input
              type="text"
              id="supplierName"
              name="supplierName"
              value={formData.supplierName}
              readOnly
              className={`w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-gray-400 cursor-not-allowed shadow-inner`}
            />
          </div>

          <div>
            <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-300 mb-1">
              Delivery Date <RequiredAsterisk fieldName="deliveryDate" />
            </label>
            <input
              type="date"
              id="deliveryDate"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              className={`w-full bg-gray-800 border ${inputErrorClass('deliveryDate')} rounded-lg p-3 text-white focus:ring-teal-500 focus:border-teal-500 shadow-inner`}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.deliveryDate && <span className="text-xs text-red-500 mt-1">{errors.deliveryDate}</span>}
          </div>

        </div>

        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={() => navigate('/purchase-orders')}
            className="px-6 py-3 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-500 transition-colors shadow-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-colors shadow-lg shadow-teal-700/50"
          >
            Create Purchase Order
          </button>
        </div>
      </form>
    </div>
  );
}