import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import EditIcon from "../components/EditIcon";
import DeleteIcon from "../components/DeleteIcon";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);



  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    fetch('/suppliers')
      .then((response) => response.json())
      .then((data) => {
        setSuppliers(data);
      })
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
      });
  }, []);

  // filter
  const filteredSuppliers = suppliers.filter((sup) => {
    const term = searchTerm.toLowerCase();
    const matchesText =
      sup.name?.toLowerCase().includes(term) ||
      sup.email?.toLowerCase().includes(term) ||
      sup.role?.toLowerCase().includes(term);

    const status = (sup.status || "").toLowerCase();
    const matchesStatus = !statusFilter || status === statusFilter;





    return matchesText && matchesStatus;
  });

  function ConfirmationModal({ isOpen, onClose, onConfirm, supplierName }) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-sm border border-gray-700">
          <h2 className="text-xl font-bold text-red-400 mb-4">Confirm Delete</h2>

          <p className="text-gray-300 mb-6">
            Delete supplier: <strong className="text-white">"{supplierName}"</strong>?
            <br />This action cannot be undone.
          </p>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }


  async function handleDeleteSupplier(id) {
    try {
      const res = await fetch(`/suppliers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete not completed");

      setSuppliers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete not completed");
    }
  }

  // /color status
  const renderStatus = (status) => {
    if (status === "ACTIVE") return "bg-green-600 text-white";
    if (status === "PENDING") return "bg-yellow-500 text-black";
    if (status === "INACTIVE") return "bg-red-600 text-white";
    return "";
  };




  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Suppliers</h1>

      {/* Search + Filter + Add */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search by name, email or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500 w-80 shadow-inner"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-teal-500 focus:border-teal-500 shadow-inner"
        >
          <option value="">Filter by Availability</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>


        <Link
          to="/suppliers/add"
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-colors shadow-lg shadow-teal-700/50 transform hover:scale-[1.01]"
        >
          Add New Supplier +
        </Link>
      </div>

      <div className="bg-gray-900/50 shadow-xl rounded-xl overflow-hidden border border-gray-700 mt-[30px]">

        <table className="min-w-full text-left">
          <thead className="bg-gray-800 uppercase text-xs text-gray-400 font-medium tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-3">Supplier Name</th>
              <th scope="col" className="px-6 py-3">Category</th>
              <th scope="col" className="px-6 py-3">Contact</th>
              <th scope="col" className="px-6 py-3">Last Update</th>
              <th scope="col" className="px-6 py-3">Availability</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No suppliers found.
                </td>
              </tr>
            ) : (
              filteredSuppliers.map((sup) => (
                <tr key={sup.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{sup.name || "—"}</td>
                  <td className="px-6 py-4 text-gray-300">{sup.role || "—"}</td>
                  <td className="px-6 py-4 text-gray-300">{sup.email || "—"}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {sup.updatedAt
                      ? new Date(sup.updatedAt).toLocaleDateString("en-CA", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }) +
                      " - " +
                      new Date(sup.updatedAt).toLocaleTimeString("en-CA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={` inline-block w-fit px-3 py-1 rounded-md text-sm font-semibold text-white ${renderStatus(sup.status)}`}>
                      {sup.status || "—"}

                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-4 text-sm font-medium">
                      <Link
                        to={`/suppliers/edit/${sup.id}`}
                        title="Edit"
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <EditIcon/>
                      </Link>
                      <button
                        onClick={() => {
                          setSupplierToDelete(sup);
                          setIsModalOpen(true);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <DeleteIcon/>
                      </button>


                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supplierName={supplierToDelete?.name || ""}
        onConfirm={() => {
          handleDeleteSupplier(supplierToDelete.id);
          setIsModalOpen(false);
          setSupplierToDelete(null);
        }}
      />

    </div>



  );
}
