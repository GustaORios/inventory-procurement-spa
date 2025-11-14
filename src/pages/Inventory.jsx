import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../UserContext";

function ConfirmationModal({ isOpen, onClose, onConfirm, productName }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-xl font-bold text-red-400 mb-4">Confirm Deletion</h2>
                <p className="text-gray-300 mb-6">
                    Are you sure you want to delete the product: <br />
                    <strong className="text-white font-semibold">"{productName}"</strong>?
                    This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500 transition-colors"
                    >
                        Delete Permanently
                    </button>
                </div>
            </div>
        </div>
    );
}

function InventoryTable({ products, selectedProductIds, setselectedProductIds, openDeleteModal }) {
    const { user } = useContext(UserContext);

    const handleSelect = (productId) => {
        setselectedProductIds(prev =>
            prev.includes(productId)
                ? prev.filter(s => s !== productId)
                : [...prev, productId]
        );
    };

    const handleSelectAll = () => {
        if (selectedProductIds.length === products.length) {
            setselectedProductIds([]);
        } else {
            setselectedProductIds(products.map(p => p.productId));
        }
    };

    const renderStatus = (inStock) => {
        const stock = parseInt(inStock, 10);
        let statusClass = 'bg-green-600';
        let statusText = 'OK';

        if (stock <= 5 && stock > 0) {
            statusClass = 'bg-yellow-500';
            statusText = 'ALERT';
        } else if (stock === 0) {
            statusClass = 'bg-red-600';
            statusText = 'CRITICAL';
        }

        return (
            <span className={`px-2 py-1 text-xs font-semibold text-white rounded-md ${statusClass}`}>
                {statusText}
            </span>
        );
    };

    return (
        <div className="bg-gray-900/50 shadow-xl rounded-xl overflow-hidden border border-gray-700">
            <table className="min-w-full text-left">
                <thead className="bg-gray-800 uppercase text-xs text-gray-400 font-medium tracking-wider">
                    <tr>
                        <th scope="col" className="px-3 py-3 w-10">
                            <input
                                type="checkbox"
                                checked={selectedProductIds.length === products.length && products.length > 0}
                                onChange={handleSelectAll}
                                className="h-4 w-4 text-teal-500 border-gray-600 rounded bg-gray-700 cursor-pointer focus:ring-teal-500"
                            />
                        </th>
                        <th scope="col" className="px-3 py-3">SKU</th>
                        <th scope="col" className="px-6 py-3">Product Name</th>
                        <th scope="col" className="px-6 py-3">Category</th>
                        <th scope="col" className="px-6 py-3">Brand</th>
                        <th scope="col" className="px-4 py-3 text-right">Price</th>
                        <th scope="col" className="px-4 py-3 text-center">Stock</th>
                        <th scope="col" className="px-6 py-3">Location</th>
                        <th scope="col" className="px-6 py-3">Exp. Date</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        {user?.role === "picker" || user?.role === "admin" && (
                            <th scope="col" className="px-6 py-3">Actions</th>
                        )}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-700">
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan="11" className="px-6 py-4 text-center text-gray-500">
                                No products listed.
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.productId} className="hover:bg-gray-800 transition-colors">

                                <td className="px-3 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedProductIds.includes(product.sku)}
                                        onChange={() => handleSelect(product.sku)}
                                        className="h-4 w-4 text-teal-500 border-gray-600 rounded bg-gray-700 cursor-pointer focus:ring-teal-500"
                                    />
                                </td>
                                <td className="px-3 py-4 text-gray-500 font-mono text-xs">{product.sku}</td>
                                <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                                <td className="px-6 py-4 text-gray-300">{product.category}</td>
                                <td className="px-6 py-4 text-gray-300">{product.brand}</td>
                                <td className="px-4 py-4 text-right text-teal-400 font-mono">
                                    ${parseFloat(product.price).toFixed(2)}
                                </td>
                                <td className="px-4 py-4 text-center text-white font-semibold">
                                    {product.inStock}
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm">{product.location}</td>
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    {product.expirationDate || 'N/A'}
                                </td>
                                <td className="px-6 py-4">{renderStatus(product.inStock)}</td>
                                {user?.role === "picker" || user?.role === "admin" && (
                                    <td className="px-6 py-4">
                                        <div className="flex gap-4 text-sm font-medium">
                                            <Link
                                                to={`/inventory/edit/${product.productId}`}
                                                title="Edit"
                                                className="text-gray-400 hover:text-blue-400 transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => openDeleteModal(product)}
                                                title="Delete"
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>)}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="flex justify-between items-center px-4 py-3 border-t border-gray-700 bg-gray-800/50 text-sm">
                <span className='text-gray-400 text-sm'>
                    Showing 1 to {products.length} of {products.length} entries
                </span>
                <div className="flex gap-1">
                    <button className="text-gray-400 px-3 py-1 rounded hover:bg-gray-700 transition-colors"> &lt; </button>
                    <span className="text-white px-3 py-1 bg-teal-600 rounded cursor-pointer font-semibold">1</span>
                    <button className="text-gray-400 px-3 py-1 rounded hover:bg-gray-700 transition-colors"> &gt; </button>
                </div>
            </div>

        </div>
    );
}

export default function Inventory({ products, handleDeleteProduct }) {
    const { user } = useContext(UserContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [selectedProductIds, setselectedProductIds] = useState([]);


    const [filterStatus, setFilterStatus] = useState('');

    const openDeleteModal = (product) => {
        setProductToDelete(product);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setProductToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (productToDelete) {
            handleDeleteProduct(productToDelete.productId);
            closeDeleteModal();
        }
    };


    const getProductStatus = (inStock) => {
        const stock = parseInt(inStock, 10);
        if (stock === 0) return 'critical';
        if (stock <= 5 && stock > 0) return 'alert';
        return 'ok';
    };


    const filteredProducts = products.filter(p => {

        const matchesSearchTerm = p.name.toLowerCase().includes(searchTerm.toLowerCase());


        const matchesStatus = filterStatus === '' || getProductStatus(p.inStock) === filterStatus;

        return matchesSearchTerm && matchesStatus;
    });

    return (
        <div className="max-w-7xl mx-auto py-10">

            <h1 className="text-3xl font-extrabold text-white mb-6">Inventory Management</h1>

            <div className="flex justify-between items-center mb-8">

                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search Product Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 w-80 shadow-inner"
                    />

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-teal-500 focus:border-teal-500 shadow-inner"
                    >
                        <option value="">Filter by Availability</option>
                        <option value="ok">OK</option>
                        <option value="alert">ALERT</option>
                        <option value="critical">CRITICAL</option>
                    </select>
                </div>

                {user?.role === "picker" || user?.role === "admin" &&(
                    <Link
                        to="/inventory/add"
                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-colors shadow-lg shadow-teal-700/50 transform hover:scale-[1.01]"
                    >
                        Add New Product +
                    </Link>
                )}
            </div>

            <InventoryTable
                products={filteredProducts}
                selectedProductIds={selectedProductIds}
                setselectedProductIds={setselectedProductIds}
                openDeleteModal={openDeleteModal}
            />

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                productName={productToDelete?.name || ''}
            />
        </div>
    );
}
