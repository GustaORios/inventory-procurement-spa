import React from 'react';
import ProductForm from '../components/ProductForm';


export default function AddProduct({ onAdd }) {

  // This function cleans up and prepares the data submitted by the form.
  // The key job here is ensuring our numbers are actually numbers before we save them.
  const handleSave = (formData) => {

    // Create the final product object.
    const newProduct = {
      ...formData, // Take all the text/string fields as they are
      // Crucially, convert the price string to a proper float. Use '0' if the field was empty
      price: parseFloat(formData.price || 0),
      // Convert the stock quantity string to an integer (base 10). Again, default to 0
      inStock: parseInt(formData.inStock || 0, 10),
    };

    // Now that the data is clean, pass it up to the parent component 
    onAdd(newProduct);
  };

  return (
    // We just render the reusable form component here
    <ProductForm
      title="Add New Product" // Give it the right title for this page

      onSave={handleSave} // Tell the form what to do when the user hits 'Save'
    />
  );
}