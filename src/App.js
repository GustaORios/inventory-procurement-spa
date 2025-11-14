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

const STORAGE_KEY = 'inventory_products';

// Dados de exemplo, usados SOMENTE se não houver nada no localStorage
const INITIAL_PRODUCTS = [
  {
    id: 'MON-24-GAM',
    name: 'Monitor Gamer 24"',
    sku: 'MON-24-GAM',
    category: 'Monitores',
    description: 'Um monitor gamer com alta taxa de atualização.',
    supplier: 'TechImports',
    price: 1200.50,
    inStock: 15
  },
  {
    id: 'TEC-MEC-01',
    name: 'Teclado Mecânico RGB',
    sku: 'TEC-MEC-01',
    category: 'Periféricos',
    description: 'Teclado com switches blue e iluminação RGB.',
    supplier: 'GamerGear',
    price: 350.00,
    inStock: 30
  },
];

// Função que LÊ os dados do localStorage (Usada para inicialização Lenta)
const getInitialState = () => {
  const savedProducts = localStorage.getItem(STORAGE_KEY);
  if (savedProducts) {
    return JSON.parse(savedProducts);
  }
  return INITIAL_PRODUCTS;
};

export default function App() {
  // 1. Inicializa o estado lendo do localStorage
  const [products, setProducts] = useState(getInitialState);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (newProduct) => {
    const productWithId = { ...newProduct, id: newProduct.productId };
    setProducts(prevProducts => [productWithId, ...prevProducts]);
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.productId === updatedProduct.productId ? updatedProduct : p))
    );
  };

  const handleAddSupplier = async (newSupplier) => {
    try {
      const res = await fetch("/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSupplier)
      });

      if (!res.ok) throw new Error("No se pudo agregar el supplier");

      const savedSupplier = await res.json(); // json-server regresa el objeto creado

      // Actualizar el estado local (opcional pero recomendado)
      setSuppliers(prev => [...prev, savedSupplier]);

    } catch (err) {
      console.error(err);
      alert("Error agregando supplier");
    }
  };

  const handleDeleteProduct = (productIdToDelete) => {
    setProducts(prevProducts =>
      prevProducts.filter(p => p.productId !== productIdToDelete)
    );
  };

  ///////////////////////////////////////prueba
  const handleUpdateSupplier = async (updatedSupplier) => {
    try {
      const res = await fetch(`/suppliers/${updatedSupplier.id}`, {
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
        const res = await fetch("/suppliers");
        const data = await res.json();
        setSuppliers(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadSuppliers();
  }, []);

  // Função para ENCONTRAR um produto pelo SKU (necessário para a tela de edição
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

        {/*
        <Route path="dashboard" element={
          <RoleProtectedRoute allowedRoles={["manager", "admin"]}>
            <Dashboard />
          </RoleProtectedRoute >
        }
        />*/}


        <Route
          path="inventory"
          index
          element={
            <RoleProtectedRoute allowedRoles={["picker", "manager", "admin"]}>
              <Inventory
                products={products}
                handleDeleteProduct={handleDeleteProduct}
              />
            </RoleProtectedRoute>

          }
        />

        <Route
          path="inventory/add"
          element={
            <RoleProtectedRoute allowedRoles={["picker", "admin"]}>
              <AddProduct onAdd={handleAddProduct} />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="inventory/edit/:productId"
          element={
            <RoleProtectedRoute allowedRoles={["picker", "admin"]}>
              <EditProduct
                onEdit={handleEditProduct}
                getProduct={getProductBySku}
              />
            </RoleProtectedRoute>
          }
        />

        <Route path="suppliers" element={
          <RoleProtectedRoute allowedRoles={["manager", "admin"]}>
            <Suppliers />
          </RoleProtectedRoute>
        } />

        <Route
          path="suppliers/add"
          element={
            <RoleProtectedRoute allowedRoles={["manager", "admin"]}>
              <AddSupplier onAdd={handleAddSupplier} />
            </RoleProtectedRoute>
          }

        />

        <Route
          path="/suppliers/edit/:id"
          element={
            <RoleProtectedRoute allowedRoles={["manager", "admin"]}>
              <EditSupplier
                suppliers={suppliers}
                onUpdate={handleUpdateSupplier}
              />
            </RoleProtectedRoute>
          }
        />

        <Route path="settings" element={<Settings />} />

        <Route path="*" element={<div>Página não encontrada</div>} />
      </Route>
    </Routes>
  );
}