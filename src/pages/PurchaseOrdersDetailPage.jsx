import React, { use, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function PurchaseOrderHeader({ order }) {
    if (!order) return null;

    const steps = ["Pending", "Approved", "Transit", "Delivered"];
    const currentStepIndex = steps.indexOf(order.status);

    const statusColor = {
        Pending: "bg-yellow-500",
        Approved: "bg-blue-500",
        Transit: "bg-aqua-500",
        Delivered: "bg-green-500",
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
    const { orderId } = useParams();

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const res = await fetch("/purchase-orders");
                const data = await res.json();
                const selectedOrder = data.find(
                    (order) => order.id === Number(orderId)
                );
                if (selectedOrder) {
                    setOrder(selectedOrder);
                    setProducts(selectedOrder.products);
                } else {
                    console.warn("Order not found for ID:", orderId);
                }
            } catch (err) {
                console.error("Error loading orders:", err);
            }
        };

        loadOrders();
    }, [orderId]);


    useEffect(() => {
        const enrichProducts = async () => {
            try {
                const res = await fetch("/products");
                const inventory = await res.json();

                const enriched = products.map((p) => {
                    const match = inventory.find((inv) => inv.productId === p.productId);
                    return {
                        ...p,
                        productName: match?.name || "Unknown",
                        brand: match?.brand || "Unknown"
                    };
                });

                setProducts(enriched);
            } catch (err) {
                console.error("Error enriching products:", err);
            }
        };

        if (products.length > 0) {
            enrichProducts();
        }
    }, [products]);


    return (
        <>
            <div className="max-w-7xl mx-auto py-1">
                <PurchaseOrderHeader order={order} />

                {/* Products it */}

                <div className="mb-6 mt-5">
                    <h2 className="text-2xl font-extrabold text-white mt-1">
                        Products
                    </h2>
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
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-700">
                            {
                                products.map((product) => (
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

                                        <td className="px-6 py-4 text-gray-300">
                                            {product.quantity}
                                        </td>

                                        <td className="px-6 py-4 text-gray-300">
                                            {product.unitPrice}
                                        </td>

                                        <td className="px-6 py-4 text-gray-300">
                                            {product.subtotal}
                                        </td>

                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                    <div className="flex justify-between items-center px-4 py-3 border-t border-gray-700 bg-gray-800/50 text-sm">

                        <div className="flex gap-1">
                            <button className="text-gray-400 px-3 py-1 rounded hover:bg-gray-700 transition-colors">
                                &lt;
                            </button>

                            <span className="text-white px-3 py-1 bg-teal-600 rounded font-semibold">
                                1
                            </span>

                            <button className="text-gray-400 px-3 py-1 rounded hover:bg-gray-700 transition-colors">
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}


