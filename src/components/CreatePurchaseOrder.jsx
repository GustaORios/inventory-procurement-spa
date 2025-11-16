import { useState } from "react";

export default function CreatePurchaseOrder({ onCreate }) {
    const [form, setForm] = useState({
        supplier: "",
        product: "",
        quantity: 0,
        unitPrice: 0,
        status: "Pending",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newOrder = {
            ...form,
            id: Date.now(),
            total: form.quantity * form.unitPrice,
        };
        onCreate(newOrder);
    };

    return (
        <div className="p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Create Purchase Order</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                    name="supplier"
                    placeholder="Supplier"
                    className="w-full p-3 rounded bg-gray-800"
                    value={form.supplier}
                    onChange={handleChange}
                />

                <input
                    name="product"
                    placeholder="Product"
                    className="w-full p-3 rounded bg-gray-800"
                    value={form.product}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    className="w-full p-3 rounded bg-gray-800"
                    value={form.quantity}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="unitPrice"
                    placeholder="Unit Price"
                    className="w-full p-3 rounded bg-gray-800"
                    value={form.unitPrice}
                    onChange={handleChange}
                />

                <button className="bg-cyan-500 p-3 rounded text-black font-bold w-full">Create</button>
            </form>
        </div>
    );
}