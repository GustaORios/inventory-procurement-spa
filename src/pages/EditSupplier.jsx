// EditSupplier.jsx
import { useParams } from "react-router-dom";
import SupplierForm from "../components/SupplierForm";

export default function EditSupplier({ suppliers, onUpdate }) {
    const { id } = useParams();
    const existing = suppliers.find(s => s.id === id);

    const handleSave = (formData) => {
        onUpdate(formData); 
    };

    return (
        <SupplierForm
            title="Edit Supplier"
            initialData={existing}
            onSave={handleSave}
        />
    );
}
