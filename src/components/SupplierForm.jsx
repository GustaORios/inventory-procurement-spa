import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SupplierForm({ title, initialData, onSave }) {
  const navigate = useNavigate();

  // Default supplier shape
  const defaultState = {
    id: '',
    name: '',
    email: '',
    role: '',
    notes: '',
    status: '',
    createdAt: '',
    updatedAt: ''
  };

  const [formData, setFormData] = useState(initialData || defaultState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        ...defaultState,
        id: (globalThis.crypto?.randomUUID?.() || String(Date.now())),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    setErrors({});
  }, [initialData]);

  // Generic change handler for controlled inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  // Minimal validation: require name and email
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "This field is required";
    if (!formData.email.trim()) newErrors.email = "This field is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit: normalize timestamps and call onSave
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.error("Validation failed", errors);
      return;
    }

    const payload = {
      ...formData,
      // Ensure ID and timestamps exist/refresh updatedAt
      id: formData.id || (globalThis.crypto?.randomUUID?.() || String(Date.now())),
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(payload);

    const action = initialData ? 'updated' : 'created';
    console.log(`Supplier ${action} successfully:`, payload);

    navigate('/suppliers');
  };

  const inputErrorClass = (field) =>
    errors[field] ? 'border-red-500' : 'border-gray-700';

  return (
    <div className="max-w-5xl mx-auto py-10">
      {/* Header */}
      <div className="mb-6">
        <span className="text-sm text-gray-400">Suppliers / {title}</span>
        <h1 className="text-3xl font-extrabold text-white mt-1">{title}</h1>
        <p className="text-gray-400 mt-1">
          Update the supplier details below. Fields marked with an asterisk are required.
        </p>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/50 p-8 rounded-xl shadow-2xl border border-gray-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left column: Name and Notes */}
          <div className="md:col-span-2 space-y-6">
            {/* Supplier Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Supplier Name <span className="text-red-500">*</span>
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

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="6"
                value={formData.notes}
                onChange={handleChange}
                spellCheck="false"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 shadow-inner resize-none"
              ></textarea>
            </div>
          </div>

          {/* Right column: Details */}
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-gray-800 border ${inputErrorClass('email')} rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 shadow-inner`}
              />
              {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email}</span>}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-teal-500 focus:border-teal-500 shadow-inner"
              >
                <option value="" className="bg-gray-900 text-gray-500">Select status</option>
                <option value="ACTIVE" className="bg-gray-900">Active</option>
                <option value="INACTIVE" className="bg-gray-900">Inactive</option>
                <option value="PENDING" className="bg-gray-900">Pending</option>
              </select>
            </div>


            {/* Role (acts like Category in your table) */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-teal-500 focus:border-teal-500 shadow-inner"
              >
                <option value="" className="bg-gray-900 text-gray-500">Select a role</option>
                <option value="picker" className="bg-gray-900">Picker</option>
                <option value="packer" className="bg-gray-900">Packer</option>
                <option value="manager" className="bg-gray-900">Manager</option>
                <option value="supplier" className="bg-gray-900">Supplier</option>
              </select>
            </div>

            {/* Readonly meta (optional display) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Created At</label>
                <input
                  type="text"
                  value={
                    formData.createdAt
                      ? new Date(formData.createdAt).toLocaleString()
                      : '—'
                  }
                  disabled
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-300 placeholder-gray-500 opacity-70 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Last Update</label>
                <input
                  type="text"
                  value={
                    formData.updatedAt
                      ? new Date(formData.updatedAt).toLocaleString()
                      : '—'
                  }
                  disabled
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-gray-300 placeholder-gray-500 opacity-70 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={() => navigate('/suppliers')}
            className="px-6 py-3 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-500 transition-colors shadow-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-colors shadow-lg shadow-teal-700/50"
          >
            Save Supplier
          </button>
        </div>
      </form>
    </div>
  );
}
