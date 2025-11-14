import React from "react";
import SupplierForm from "../components/SupplierForm"; // Adjust the path if necessary

// Export and declare the component ONLY ONCE
export default function AddSupplier({ onAdd }) {
  // Normalize payload and delegate saving to the parent via onAdd
  const handleSave = (formData) => {
    const newSupplier = {
      ...formData,
      id: formData.id ?? (globalThis.crypto?.randomUUID?.() || String(Date.now())),
      createdAt: formData.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAdd(newSupplier); // parent (App.jsx) decides how to persist (e.g., localStorage)
  };

  return (
    <SupplierForm
      title="Add Supplier"
      onSave={handleSave}
    />
  );
}
