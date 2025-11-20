import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';


export default function EditProduct({ onEdit, getProduct }) {
    // Grabs the product ID from the URL like /edit/123
    const { productId } = useParams();
    // Hook to programmatically change the URL/route 
    const navigate = useNavigate();

    // State to hold the fetched product data which will populate the form fields.
    const [productData, setProductData] = useState(null);
    // State to manage the loading status while we wait for data.
    const [isLoading, setIsLoading] = useState(true);

    // useEffect runs once on component mount (due to dependencies) to fetch the product.
    useEffect(() => {
        // Ensure we actually have an ID from the URL.
        if (productId) {

            // Use the passed-in function (getProduct) to retrieve the item data.
            const product = getProduct(productId);

            if (product) {

                // If found, set the data to state, so it can be passed to the form.
                setProductData(product);
            } else {

                // If the product ID is invalid or not found, log an error and redirect the user.
                console.error(`Product with productId: ${productId} not found.`);
                navigate('/inventory');
            }
            // Data retrieval attempt finished, so set loading to false.
            setIsLoading(false);
        } else {
            // If there's no product ID in the URL at all, stop loading and redirect immediately.
            setIsLoading(false);
            navigate('/inventory');
        }
        // Dependencies: make sure to re-run if the ID changes (shouldn't happen on this page) or if the dependencies change.
    }, [productId, getProduct, navigate]);

    // Show a loading message while the data fetch is in progress.
    if (isLoading) {
        return <div className="text-white text-center py-20">Loading product data...</div>;
    }

    // Handle the case where loading is done, but no product data was found (though the useEffect usually handles the redirect).
    if (!productData) {

        return <div className="text-white text-center py-20">Product not found. Redirecting...</div>;
    }

    // Finally, render the ProductForm, passing the fetched data to pre-fill it.
    return (
        <ProductForm
            // Dynamic title shows the name of the product being edited.
            title={`Edit Product: ${productData.name}`}
            //crucial prop: it tells the form what values to start with.
            initialData={productData}
            // The callback for when the user submits changes. This calls the parent's update logic.
            onSave={onEdit}
        />
    );
}