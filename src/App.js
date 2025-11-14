import React, { useState, useEffect } from 'react'; // 👈 IMPORTAR useEffect
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './layouts/DashboardLayout';
import Inventory from './pages/Inventory';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Suppliers from './pages/SuppliersPage';
import AddSupplier from './pages/AddSuplier';
import Settings from './pages/Settings';
import EditSupplier from './pages/EditSupplier';





// Chave que usaremos para salvar no localStorage
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
    // Converte a string JSON de volta para um array de objetos
    return JSON.parse(savedProducts);
  }
  // Se não houver nada salvo, retorna os produtos iniciais
  return INITIAL_PRODUCTS;
};

export default function App() {
  // 1. Inicializa o estado lendo do localStorage
  const [products, setProducts] = useState(getInitialState);
  const [suppliers, setSuppliers] = useState([]);

  // 2. Sincroniza o estado com o localStorage sempre que 'products' mudar
  useEffect(() => {
    // Converte o array de objetos para uma string JSON
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]); // O array de dependências garante que isso rode apenas quando 'products' for alterado

  // Função para ADICIONAR um novo produto
  const handleAddProduct = (newProduct) => {
    // Use o SKU como ID simples para a persistência
    const productWithId = { ...newProduct, id: newProduct.sku };
    setProducts(prevProducts => [...prevProducts, productWithId]);
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


  // Função para EDITAR um produto existente
  const handleEditProduct = (sku, updatedProduct) => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.sku === sku ? { ...p, ...updatedProduct } : p))
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







  // Função para ENCONTRAR um produto pelo SKU (necessário para a tela de edição)
  const getProductBySku = (sku) => {
    return products.find(p => p.sku === sku);
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />

        <Route
          path="inventory"
          element={<Inventory products={products} />}
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

        <Route path="suppliers" element={<Suppliers />} />

        <Route
          path="suppliers/add"
          element={<AddSupplier onAdd={handleAddSupplier} />}

        />

        <Route
          path="/suppliers/edit/:id"
          element={
            <EditSupplier
              suppliers={suppliers}
              onUpdate={handleUpdateSupplier}
            />
          }
        />



        <Route path="settings" element={<Settings />} />


        <Route path="*" element={<div>Página não encontrada</div>} />
      </Route>
    </Routes>
  );
}
