import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/DashboardLayout';
import Inventory from './pages/Inventory';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Suppliers from './pages/SuppliersPage';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';

const STORAGE_KEY = 'inventory_products';


const getInitialState = () => {
  const savedProducts = localStorage.getItem(STORAGE_KEY);
  if (savedProducts) {
    return JSON.parse(savedProducts);
  }
  return INITIAL_PRODUCTS;
};

export default function App() {
  const [products, setProducts] = useState(getInitialState); 

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]); 

  const handleAddProduct = (newProduct) => {
    const productWithId = { ...newProduct, id: newProduct.sku };
    setProducts(prevProducts => [productWithId, ...prevProducts]);
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.sku === updatedProduct.sku ? updatedProduct : p))
    );
  };
  
  const handleDeleteProduct = (skuToDelete) => {
    setProducts(prevProducts =>
      prevProducts.filter(p => p.sku !== skuToDelete)
    );
  };
  
  const getProductBySku = (sku) => {
    return products.find(p => p.sku === sku);
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />

        <Route
          path="inventory"
          element={
            <Inventory 
              products={products} 
              handleDeleteProduct={handleDeleteProduct} 
            />
          }
        />

        <Route
          path="inventory/add"
          element={<AddProduct onAdd={handleAddProduct} />}
        />

        <Route
          path="inventory/edit/:sku"
          element={
            <EditProduct
              onEdit={handleEditProduct}
              getProduct={getProductBySku}
            />
          }
        />

        <Route
          path="suppliers"
          element={
            <RoleProtectedRoute allowedRoles={["admin", "manager"]}>
              <Suppliers />
            </RoleProtectedRoute>
          }
        />
        <Route path="*" element={<div>Page not found</div>} />
      </Route>
    </Routes>
  );
}