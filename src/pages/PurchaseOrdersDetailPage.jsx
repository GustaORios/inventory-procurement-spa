import React, { use, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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
            <div className="max-w-7xl mx-auto py-10">

                <h1 className="text-3xl font-extrabold text-white mb-6">
                    Purchase Order {orderId}
                </h1>
                <h2>
                    Total {order.total}
                </h2>

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
