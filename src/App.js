import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './layouts/DashboardLayout';
import Products from './pages/ProductsPage';
import Suppliers from './pages/SuppliersPage';
import PurchaseOrders from './pages/PurchaseOrdersPage';
import Layout from './components/(OLD)Layout';
import Inventory from './pages/Inventory';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';

export default function App() {
  // Função para ADICIONAR um novo produto
  const handleAddProduct = (newProduct) => {
    // Em um app real, o ID seria gerado pelo backend
    const productWithId = { ...newProduct, id: newProduct.sku };
    setProducts(prevProducts => [...prevProducts, productWithId]);
  };

  // Função para EDITAR um produto existente
  const handleEditProduct = (sku, updatedProduct) => {
    setProducts(prevProducts =>
      prevProducts.map(p => (p.sku === sku ? { ...p, ...updatedProduct } : p))
    );
  };

  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          {}
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="inventory"
            element={<Inventory 
              //products={products}
               />}
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
               // getProduct={getProductBySku}
              />
            }
          />
          <Route path="suppliers" element={<Suppliers />} />
          {/*<Route path="settings" element={<Settings />}*/}

          {/* Rota Padrão (Not Found) */}
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Route>
      </Routes>

  );
}
