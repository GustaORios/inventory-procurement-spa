import React, { use, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DeleteIcon from "../components/DeleteIcon";

function PurchaseOrderHeader({ order }) {
    if (!order) return null;

    const steps = ["Pending", "Approved", "Transit", "Delivered"];
    const currentStepIndex = steps.indexOf(order.status);

    const statusColor = {
        Pending: "bg-yellow-500",
        Approved: "bg-blue-500",
        Transit: "bg-aqua-500",
        Delivered: "bg-green-500",
        Cancelled: "bg-red-500"
    };

    return (
        <>
            <div className="mb-6">
                <span className="text-sm text-gray-400">
                    Purchase Orders / #{order.id}
                </span>

                <h1 className="text-3xl font-extrabold text-white mt-1">
                    Purchase Order #{order.id}
                </h1>

                <p className="text-gray-400 mt-1">
                    Review details, items and delivery status.
                </p>
            </div>

            <div className="bg-gray-900/50 p-8 rounded-xl shadow-2xl border border-gray-700">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div>
                        <p className="text-gray-400 text-sm">Supplier</p>
                        <p className="text-white font-semibold">{order.supplierName}</p>
                    </div>

                    <div>
                        <p className="text-gray-400 text-sm">Total Amount</p>
                        <p className="text-white font-semibold">${order.total}</p>
                    </div>

                    <div>
                        <p className="text-gray-400 text-sm">Delivery Date</p>
                        <p className="text-white font-semibold">
                            {new Date(order.deliveryDate).toLocaleDateString()}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-400 text-sm">Created At</p>
                        <p className="text-white font-semibold">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-400 text-sm">Status</p>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[order.status]}`}
                        >
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* Status Progress */}
                <div className="mt-10">
                    <p className="text-gray-300 mb-4 font-medium">Status Progress</p>

                    <div className="relative w-full flex items-center justify-between">

                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-700 rounded-full"></div>

                        <div
                            className="absolute top-1/2 left-0 h-1 bg-teal-500 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                        ></div>

                        {steps.map((step, index) => {
                            const active = index <= currentStepIndex;

                            return (
                                <div
                                    key={step}
                                    className="relative flex flex-col items-center z-10 w-1/3"
                                >
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${active
                                            ? "border-teal-500 bg-teal-500"
                                            : "border-gray-500 bg-gray-900"
                                            }`}
                                    ></div>

                                    <span
                                        className={`mt-2 text-sm font-medium ${active ? "text-white" : "text-gray-500"
                                            }`}
                                    >
                                        {step}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </>
    );
}

export default function PurchaseOrderDetails() {
    const [products, setProducts] = useState([]);
    const [order, setOrder] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const { orderId } = useParams();

    const [allProducts, setAllProducts] = useState([]);

    const [productToAdd, setProductToAdd] = useState("");

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [orderRes, inventoryRes] = await Promise.all([
                    fetch("/purchase-orders"),
                    fetch("/products"),
                ]);

                const ordersData = await orderRes.json();
                const inventory = await inventoryRes.json();

                setAllProducts(inventory);

                const selectedOrder = ordersData.find(
                    (order) => order.id === orderId
                );

                if (selectedOrder) {
                    setOrder(selectedOrder);

                    const enriched = selectedOrder.products.map((p) => {
                        const match = inventory.find(
                            (inv) => inv.productId === p.productId
                        );
                        return {
                            ...p,
                            productName: match?.name || "Unknown",
                            brand: match?.brand || "Unknown",
                            inventoryPrice: match?.price || p.unitPrice
                        };
                    });

                    setProducts(enriched);

                } else {
                    console.warn("Order not found for ID:", orderId);
                }
            } catch (err) {
                console.error("Error loading initial data:", err);
            }
        };

        loadInitialData();
    }, [orderId]);

    const handleProductChange = (sku, field, value) => {
        const numValue = Math.max(0, Number(value));

        setProducts(currentProducts =>
            currentProducts.map(p => {
                if (p.productSku === sku) {
                    const updatedProduct = {
                        ...p,
                        [field]: numValue
                    };

                    const qty = (field === 'quantity') ? numValue : p.quantity;
                    const price = (field === 'unitPrice') ? numValue : p.unitPrice;
                    updatedProduct.subtotal = qty * price;

                    return updatedProduct;
                }
                return p;
            })
        );
    };

    const cancelOrder = async () => {
        const payload = {
            status: "Cancelled"
        };

        try {
            const res = await fetch(`/purchase-orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Error");
            }

        } catch (err) {
            console.error("Error", err);
        } finally {
            setIsSaving(false);
        };
    }

    const handleSaveChanges = async () => {
        setIsSaving(true);
        setSaveError(null);

        const newTotal = products.reduce((acc, p) => acc + (p.subtotal || 0), 0);

        const payload = {
            products: products,
            total: newTotal
        };

        try {
            const res = await fetch(`/purchase-orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Error");
            }

            const updatedOrder = await res.json();
            setOrder(updatedOrder);

        } catch (err) {
            console.error("Error", err);
            setSaveError(err.message);
        } finally {
            setIsSaving(false);
        }
    };


    const handleRemoveProduct = (sku) => {
        setProducts(currentProducts =>
            currentProducts.filter(p => p.productSku !== sku)
        );
    };

    const handleAddProduct = () => {
        if (!productToAdd) return;

        const productData = allProducts.find(p => p.productId === productToAdd);
        if (!productData) return;

        const isAlreadyInList = products.some(p => p.productSku === productData.sku);
        if (isAlreadyInList) {
            setProductToAdd("");
            return;
        }

        const newOrderItem = {
            productId: productData.productId,
            productSku: productData.sku,
            productName: productData.name,
            brand: productData.brand,
            quantity: 1,
            unitPrice: productData.price,
            subtotal: productData.price * 1
        };

        setProducts(currentProducts => [...currentProducts, newOrderItem]);

        setProductToAdd("");
    };

    const availableProducts = allProducts.filter(
        inv => !products.some(p => p.productId === inv.productId)
    );

    const totalOrder = products.reduce((acc, p) => acc + (p.subtotal || 0), 0);
    useEffect(() => {
        setOrder(o => ({ ...o, total: totalOrder }));
    }, [totalOrder]);

    console.log(products)

    return (
        <>
            <div className="max-w-7xl mx-auto py-1">
                {
                    <PurchaseOrderHeader order={order} />
                }

                <div className="flex justify-between items-center mb-6 mt-5">
                    <h2 className="text-2xl font-extrabold text-white mt-1">
                        Products
                    </h2>
                    <div className="flex justify-between items-center mb-6 mt-5 gap-4">
                        {order.status == "Pending" && (
                            <>
                                <button
                                    onClick={cancelOrder}
                                    disabled={isSaving}
                                    className="bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >Cancel Order</button>
                                <button
                                    onClick={handleSaveChanges}
                                    disabled={isSaving}
                                    className="bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? 'saving...' : 'Save'}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="bg-gray-900/50 shadow-xl rounded-xl overflow-hidden border border-gray-700">
                    <table className="min-w-full text-left">
                        <thead className="bg-gray-800 uppercase text-xs text-gray-400 font-medium tracking-wider">
                            <tr>
                                <th className="px-4 py-3">SKU</th>
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">Brand</th>
                                <th className="px-6 py-3">Qty</th>
                                <th className="px-6 py-3">Unit Price</th>
                                <th className="px-6 py-3">Sub Total</th>
                                {order.status == "Pending" && (
                                    <th className="px-4 py-3 text-center">Actions</th>
                                )}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-700">
                            {products.map((product) => (
                                <tr
                                    key={product.productSku}
                                    className="hover:bg-gray-800 transition-colors"
                                >
                                    <td className="px-4 py-4 text-gray-300 font-mono">
                                        {product.productSku}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {product.productName}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white">
                                        {product.brand}
                                    </td>

                                    {order.status == "Pending" ? (
                                        <>
                                            <td className="px-6 py-4 text-gray-300">
                                                <input
                                                    type="number"
                                                    value={product.quantity}
                                                    onChange={(e) => handleProductChange(
                                                        product.productSku,
                                                        'quantity',
                                                        e.target.value
                                                    )}
                                                    className="w-20 bg-gray-700 text-white rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                    min="0"
                                                />
                                            </td>

                                            <td className="px-6 py-4 text-gray-300">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={product.unitPrice}
                                                    onChange={(e) => handleProductChange(
                                                        product.productSku,
                                                        'unitPrice',
                                                        e.target.value
                                                    )}
                                                    className="w-24 bg-gray-700 text-white rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                    min="0"
                                                />
                                            </td>
                                        </>
                                    ) :
                                        <>
                                            <td className="px-6 py-4 font-medium text-white">
                                                {product.quantity}
                                            </td>

                                            <td className="px-6 py-4 font-medium text-white">
                                                {product.unitPrice}
                                            </td>
                                        </>
                                    }

                                    <td className="px-6 py-4 text-gray-300">
                                        ${(product.subtotal || 0).toFixed(2)}
                                    </td>

                                    {order.status == "Pending" && (
                                        <td className="px-4 py-4 text-center">
                                            <button
                                                onClick={() => handleRemoveProduct(product.productSku)}
                                                className="text-red-400 hover:text-red-300 transition-colors p-1 rounded-full hover:bg-red-900/50"
                                                title="Remove product"
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex items-center gap-4 px-4 py-4 border-t border-gray-700 bg-gray-800/50">
                        <select
                            value={productToAdd}
                            onChange={(e) => setProductToAdd(e.target.value)}
                            className="flex-1 bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            <option value="">Select a product to add</option>
                            {availableProducts.map(invProduct => (
                                <option key={invProduct.productId} value={invProduct.productId}>
                                    {invProduct.name} ({invProduct.sku})
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddProduct}
                            disabled={!productToAdd}
                            className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add product
                        </button>
                    </div>

                    <div className="flex justify-between items-center px-4 py-3 border-t border-gray-700 bg-gray-800/50 text-sm">
                        <div className="flex gap-1">
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}