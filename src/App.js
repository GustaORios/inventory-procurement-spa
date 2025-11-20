import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Inventory from './pages/Inventory';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Suppliers from './pages/SuppliersPage';
import AddSupplier from './pages/AddSuplier';
import Settings from './pages/Settings';
import EditSupplier from './pages/EditSupplier';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import PurchaseOrders from './pages/PurchaseOrdersPage';
import PurchaseOrdersDetail from './pages/PurchaseOrdersDetailPage';
import CreatePurchaseOrder from './components/CreatePurchaseOrder';


export default function App() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/products");
        if (!res.ok) throw new Error("Theres no producst to show");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadProducts();
  }, []);


  const handleAddProduct = async (newProduct) => {
    try {
      const productToSave = {
        ...newProduct,
        productId: newProduct.productId || newProduct.sku || crypto.randomUUID?.() || String(Date.now()),
      };

      const res = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productToSave),
      });

      if (!res.ok) throw new Error("there is no product to show");

      const savedProduct = await res.json();

      setProducts(prev => [...prev, savedProduct]);
    } catch (err) {
      console.error(err);
    }
  };



  const handleEditProduct = async (updatedProduct) => {
    try {
      const res = await fetch(`http://localhost:3000/products/${updatedProduct.id}`, {
        method: "PUT",      // o PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok) throw new Error("we couldn't update the product");

      const savedProduct = await res.json();

      setProducts(prev =>
        prev.map(p =>
          p.id === savedProduct.id ? savedProduct : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };



  const handleAddSupplier = async (newSupplier) => {
    try {
      const res = await fetch("http://localhost:3000/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSupplier)
      });

      if (!res.ok) throw new Error("something whent wrong");

      const savedSupplier = await res.json();

      setSuppliers(prev => [...prev, savedSupplier]);

    } catch (err) {
      console.error(err);
    }
  };


  const handleDeleteProduct = async (idToDelete) => {
    try {
      const res = await fetch(`http://localhost:3000/products/${idToDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("something went wrong");

      setProducts(prev =>
        prev.filter(p => p.id !== idToDelete)
      );
    } catch (err) {
      console.error(err);
    }
  };




  ///////////////////////////////////////prueba
  const handleUpdateSupplier = async (updatedSupplier) => {
    try {
      const res = await fetch(`http://localhost:3000/suppliers/${updatedSupplier.id}`, {
        method: "PUT", // o PATCH, según tu json-server
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSupplier),
      });

      if (!res.ok) throw new Error("No se pudo actualizar el supplier");

      const savedSupplier = await res.json();

      // Actualizar estado local
      setSuppliers((prev) =>
        prev.map((s) => (s.id === savedSupplier.id ? savedSupplier : s))
      );
    } catch (err) {
      console.error(err);
      alert("Error actualizando supplier");
    }
  };
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const res = await fetch("http://localhost:3000/suppliers");
        const data = await res.json();
        setSuppliers(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadSuppliers();
  }, []);


  const getProductBySku = (productId) => {
    return products.find(p => p.productId === productId);
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

        <Route
          path="inventory"
          index
          element={
            <RoleProtectedRoute allowedRoles={["manager", "picker", "admin"]}>
              <Inventory products={products} handleDeleteProduct={handleDeleteProduct} />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="inventory/add"
          element={
            <RoleProtectedRoute allowedRoles={["manager", "picker", "admin"]}>
              <AddProduct onAdd={handleAddProduct} />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="inventory/edit/:productId"
          element={
            <RoleProtectedRoute allowedRoles={["manager", "picker", "admin"]}>
              <EditProduct onEdit={handleEditProduct} getProduct={getProductBySku} />
            </RoleProtectedRoute>
          }
        />


        <Route
          path="suppliers"
          element={
            <RoleProtectedRoute allowedRoles={["manager", "admin"]}>
              <Suppliers />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="suppliers/add"
          element={
            <RoleProtectedRoute allowedRoles={["manager", "admin"]}>
              <AddSupplier onAdd={handleAddSupplier} />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="suppliers/edit/:id"
          element={
            <RoleProtectedRoute allowedRoles={["manager", "admin"]}>
              <EditSupplier suppliers={suppliers} onUpdate={handleUpdateSupplier} />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="purchase-orders"
          element={
            <RoleProtectedRoute allowedRoles={["manager", "supplier", "admin", "picker"]}>
              <PurchaseOrders />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="purchase-order/:orderId"
          element={
            <RoleProtectedRoute allowedRoles={["manager", "supplier", "admin", "picker"]}>
              <PurchaseOrdersDetail />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="purchase-order/add"
          element={
            <RoleProtectedRoute allowedRoles={["manager", "admin"]}>
              <CreatePurchaseOrder />
            </RoleProtectedRoute>
          }
        />

        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<div>404 - Not found</div>} />
      </Route>
    </Routes>

  );
}