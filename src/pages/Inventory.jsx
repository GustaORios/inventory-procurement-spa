import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from "../UserContext";
import EditIcon from '../components/EditIcon';
import DeleteIcon from '../components/DeleteIcon';

// --- ConfirmationModal Component ---
// Generic reusable modal for delete confirmation. Uses Tailwind CSS for styling.
function ConfirmationModal({ isOpen, onClose, onConfirm, productName }) {
    // Basic conditional rendering: Render nothing if not open.
    if (!isOpen) return null;

    return (
        // Fixed overlay backdrop to cover the screen and center the modal.
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            {/* Modal content container with dark theme styling. */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
                {/* Title to draw attention to the destructive nature of the action. */}
                <h2 className="text-xl font-bold text-red-400 mb-4">Confirm Deletion</h2>
                {/* Dynamic confirmation message, interpolating the product name. */}
                <p className="text-gray-300 mb-6">
                    Are you sure you want to delete the product: <br />
                    <strong className="text-white font-semibold">"{productName}"</strong>?
                    This action cannot be undone.
                </p>
                {/* Action button group, aligned to the right. */}
                <div className="flex justify-end gap-4">
                    {/* Secondary action: Cancel and close the modal. */}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-500 transition-colors"
                    >
                        Cancel
                    </button>
                    {/* Primary/Destructive action: Confirm deletion. */}
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


// --- InventoryTable Component ---
// Renders the main table view of all products, handling selection and row actions.
function InventoryTable({ products, selectedProductIds, setselectedProductIds, openDeleteModal }) {
    // Fetch user context to apply role-based access control (RBAC).
    const { user } = useContext(UserContext);

    // Toggles a single product's ID in the `selectedProductIds` array.
    const handleSelect = (productId) => {
        setselectedProductIds(prev =>
            prev.includes(productId)
                ? prev.filter(s => s !== productId) // Deselect: filter out the ID
                : [...prev, productId] // Select: add the ID
        );
    };

    // Toggles selection state for ALL products currently in the table.
    const handleSelectAll = () => {
        if (selectedProductIds.length === products.length) {
            setselectedProductIds([]); // If all are selected, deselect all.
        } else {
            setselectedProductIds(products.map(p => p.productId)); // Otherwise, select all.
        }
    };

    // Determines and renders the stock status badge based on quantity thresholds.
    const renderStatus = (inStock) => {
        const stock = parseInt(inStock, 10);
        let statusClass = 'bg-green-600';
        let statusText = 'OK';

        if (stock <= 5 && stock > 0) {
            statusClass = 'bg-yellow-500';
            statusText = 'ALERT'; // Low stock warning.
        } else if (stock === 0) {
            statusClass = 'bg-red-600';
            statusText = 'CRITICAL'; // Out of stock.
        }

        return (
            <span className={`px-2 py-1 text-xs font-semibold text-white rounded-md ${statusClass}`}>
                {statusText}
            </span>
        );
    };

    return (
        // Main container with dark, elevated styling.
        <div className="bg-gray-900/50 shadow-xl rounded-xl overflow-hidden border border-gray-700">
            <table className="min-w-full text-left">
                {/* Table Header row */}
                <thead className="bg-gray-800 uppercase text-xs text-gray-400 font-medium tracking-wider">
                    <tr>
                        {/* Select All Checkbox header */}
                        <th scope="col" className="px-2 py-3 w-10">
                            <input
                                type="checkbox"
                                checked={selectedProductIds.length === products.length && products.length > 0}
                                onChange={handleSelectAll}
                                className="h-4 w-4 text-teal-500 border-gray-600 rounded bg-gray-700 cursor-pointer focus:ring-teal-500"
                            />
                        </th>
                        {/* Column definitions */}
                        <th scope="col" className="px-1 py-3">SKU</th>
                        <th scope="col" className="px-3 py-3">Product Name</th>
                        <th scope="col" className="px-3 py-3">Category</th>
                        <th scope="col" className="px-3 py-3">Brand</th>
                        <th scope="col" className="px-4 py-3">Supplier</th>
                        <th scope="col" className="px-5 py-3 text-right">Price</th>
                        <th scope="col" className="px-2 py-3 text-center">Stock</th>
                        <th scope="col" className="px-10 py-3">Location</th>
                        <th scope="col" className="px-10 py-3">Exp. Date</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        {/* Conditional rendering for Actions column based on user role */}
                        {user?.role != "supplier" && user?.role != "manager" && (
                            <th scope="col" className="px-1 py-2">Actions</th>
                        )}
                    </tr>
                </thead>

                {/* Table Body - iterating over filtered product data */}
                <tbody className="divide-y divide-gray-700">
                    {products.length === 0 ? (
                        // Fallback row for when no products match the current filters/data.
                        <tr>
                            <td colSpan="12" className="px-6 py-4 text-center text-gray-500">
                                No products listed.
                            </td>
                        </tr>
                    ) : (
                        // Map each product to a table row (<tr>)
                        products.map((product) => (
                            <tr key={product.productId} className="hover:bg-gray-800 transition-colors">

                                {/* Individual product selection checkbox */}
                                <td className="px-2 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedProductIds.includes(product.productId)}
                                        onChange={() => handleSelect(product.productId)}
                                        className="h-4 w-4 text-teal-500 border-gray-600 rounded bg-gray-700 cursor-pointer focus:ring-teal-500"
                                    />
                                </td>
                                {/* Data cells */}
                                <td className="px-1 py-4 text-gray-500 font-mono text-xs">{product.sku}</td>
                                <td className="px-3 py-4 font-medium text-white">{product.name}</td>
                                <td className="px-3 py-4 text-gray-300">{product.category}</td>
                                <td className="px-3 py-4 text-gray-300">{product.brand}</td>
                                <td className="px-4 py-4 text-gray-300">{product.supplierName || 'N/A'}</td>
                                <td className="px-1 py-4 text-right text-teal-400 font-mono">
                                    ${parseFloat(product.price).toFixed(2)}
                                </td>
                                <td className="px-1 py-4 text-center text-white font-semibold">
                                    {product.inStock}
                                </td>
                                <td className="px-6 py-4 text-gray-400 text-sm">{product.location}</td>
                                <td className="px-6 py-4 text-gray-400 text-sm">
                                    {product.expirationDate || 'N/A'}
                                </td>
                                {/* Render the status badge */}
                                <td className="px-6 py-4">{renderStatus(product.inStock)}</td>
                                {/* Actions column content (Edit/Delete buttons) */}
                                {user?.role != "supplier" && user?.role != "manager" && (
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-3 text-sm font-medium">
                                            {/* Link to the edit route */}
                                            <Link
                                                to={`/inventory/edit/${product.productId}`}
                                                title="Edit"
                                                className="text-gray-400 hover:text-blue-400 transition-colors"
                                            >
                                                <EditIcon/>
                                            </Link>
                                            {/* Button to open the deletion confirmation modal */}
                                            <button
                                                onClick={() => openDeleteModal(product)}
                                                title="Delete"
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <DeleteIcon/>
                                            </button>
                                        </div>

                                    </td>)}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Simple Pagination/Summary Footer. Note: Pagination logic is hardcoded for demonstration. */}
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

// --- Main Inventory Component ---
// The page container component that manages state and orchestration.
export default function Inventory({ products, handleDeleteProduct }) {
    // Access global user context.
    const { user } = useContext(UserContext);
    // State for filtering products by name.
    const [searchTerm, setSearchTerm] = useState('');
    // State to control visibility of the delete confirmation modal.
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State to hold the specific product object targeted for deletion.
    const [productToDelete, setProductToDelete] = useState(null);
    // State for tracking selected IDs (e.g., for future bulk delete feature).
    const [selectedProductIds, setselectedProductIds] = useState([]);
    // State for filtering by stock status (ok, alert, critical).
    const [filterStatus, setFilterStatus] = useState('');

    // Function to initiate the deletion workflow: set product and open modal.
    const openDeleteModal = (product) => {
        setProductToDelete(product);
        setIsModalOpen(true);
    };

    // Function to close the modal and clean up the state.
    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setProductToDelete(null);
    };

    // Callback executed upon confirmation inside the modal.
    const handleConfirmDelete = () => {
        if (productToDelete) {
            // Call the parent component's handler to remove the item from the data source.
            handleDeleteProduct(productToDelete.id); 
            closeDeleteModal();
        }
    };


    // Utility function to categorize stock level into a simple status string.
    const getProductStatus = (inStock) => {
        const stock = parseInt(inStock, 10);
        if (stock === 0) return 'critical';
        if (stock <= 5 && stock > 0) return 'alert';
        return 'ok';
    };


    // Core filtering logic: combines search term and status filter.
    const filteredProducts = products.filter(p => {

        // Check for substring match in the product name (case-insensitive).
        const matchesSearchTerm = p.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Check if the product's status matches the selected filter status, or if no filter is applied.
        const matchesStatus = filterStatus === '' || getProductStatus(p.inStock) === filterStatus;

        return matchesSearchTerm && matchesStatus; // Must satisfy both criteria.
    });

    return (
        // Page layout container with max-width and vertical padding.
        <div className="max-w-7xl mx-auto py-10">

            {/* Page Header */}
            <h1 className="text-3xl font-extrabold text-white mb-6">Inventory Management</h1>

            {/* Control bar: Search, Filter, and Add buttons */}
            <div className="flex justify-between items-center mb-8">

                <div className="flex gap-4 items-center">
                    {/* Controlled component for search input */}
                    <input
                        type="text"
                        placeholder="Search Product Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 w-80 shadow-inner"
                    />

                    {/* Controlled component for status filter dropdown */}
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

                    {/* Add Button - Visible only for specific user roles (RBAC) */}
                    {user?.role != "supplier" && user?.role != "manager" && (
                        <Link
                            to="/inventory/add"
                            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-colors shadow-lg shadow-teal-700/50 transform hover:scale-[1.01]"
                        >
                            Add New Product +
                        </Link>
                    )}
                </div>

            </div>

            {/* Inventory Table rendering the filtered data */}
            <InventoryTable
                products={filteredProducts}
                selectedProductIds={selectedProductIds}
                setselectedProductIds={setselectedProductIds}
                openDeleteModal={openDeleteModal}
            />

            {/* Delete Confirmation Modal component */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                productName={productToDelete?.name || ''}
            />
        </div>
    );
}
