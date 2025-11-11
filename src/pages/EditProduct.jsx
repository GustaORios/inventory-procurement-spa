import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// O caminho deve ser ajustado para onde o seu ProductForm.js realmente reside.
// Assumindo que está em '../components/ProductForm'
import ProductForm from '../components/ProductForm';

// Componente para a página de Edição de Produto
export default function EditProduct({ onEdit, getProduct }) {
    
    // Obtém o parâmetro 'sku' do URL
    const { sku } = useParams();
    const navigate = useNavigate();
    
    // Estado para armazenar os dados do produto a ser editado
    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (sku) {
            // Usa a função passada pelo App.js para encontrar o produto
            const product = getProduct(sku);
            
            if (product) {
                // Produto encontrado, define os dados no estado local
                setProductData(product);
            } else {
                // Produto não encontrado (ex: SKU inválido), redireciona
                console.error(`Product with SKU: ${sku} not found.`);
                navigate('/inventory'); 
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
            navigate('/inventory');
        }
    }, [sku, getProduct, navigate]); // Dependências: sku, função getProduct, e navigate

    if (isLoading) {
        return <div className="text-white text-center py-20">Carregando dados do produto...</div>;
    }

    if (!productData) {
        // Exibe uma mensagem se o produto não for encontrado
        return <div className="text-white text-center py-20">Produto não encontrado. Redirecionando...</div>;
    }

    // Renderiza o formulário e passa os dados atuais e a função de edição
    return (
        <ProductForm 
            title={`Edit Product: ${productData.name}`}
            initialData={productData}
            onSave={onEdit} // onEdit é a função handleEditProduct do App.js
        />
    );
}