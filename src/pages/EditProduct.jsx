import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';


export default function EditProduct({ onEdit, getProduct }) {
    const { productId } = useParams();
    const navigate = useNavigate();
    
    const [productData, setProductData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (productId) {
            
            const product = getProduct(productId);

            if (product) {
                
                setProductData(product);
            } else {
                
                console.error(`Product with productId: ${productId} not found.`);
                navigate('/inventory'); 
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
            navigate('/inventory');
        }
    }, [productId, getProduct, navigate]); 

    if (isLoading) {
        return <div className="text-white text-center py-20">Carregando dados do produto...</div>;
    }

    if (!productData) {
        
        return <div className="text-white text-center py-20">Produto não encontrado. Redirecionando...</div>;
    }

    
    return (
        <ProductForm 
            title={`Edit Product: ${productData.name}`}
            initialData={productData}
            onSave={onEdit} 
        />
    );
}