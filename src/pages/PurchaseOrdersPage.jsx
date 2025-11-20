import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function PurchaseOrders() {
  const { user } = useContext(UserContext);
  const [orders, setPurchaseOrders] = useState([]);
  const [supplierOrders, setSupplierOrders] = useState([]);

    useEffect(() => {
      if(user.role === 'supplier'){
        const filtered = orders.filter(p => p.supplierId === user.supplierId);
        setSupplierOrders(filtered);
      } else {
        setSupplierOrders(orders);
      }
    }, [orders, user.supplierId]);


  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetch("http://localhost:3000/purchase-orders");
        const data = await res.json();
        setPurchaseOrders(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadOrders();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredOrders = supplierOrders.filter((order) => {

    const matchesSearch = String(order.id)
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "" || order.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });


  const renderStatusBadge = (status) => {
    const base = "px-3 py-1 text-xs font-semibold rounded-lg text-white";

    const colors = {
      Pending: "bg-yellow-500",
      Approved: "bg-blue-500",
      Transit: "bg-aqua-500",
      Delivered: "bg-green-500",
      Cancelled: "bg-red-500"
    };

    return <span className={`${base} ${colors[status] || "bg-gray-600"}`}>{status}</span>;
  };

  const ViewIcon = (props) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    );
  };

  return (
    <>
      <div className="max-w-7xl mx-auto py-10">

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-white mb-6">
          Purchase Orders
        </h1>

        <div className="flex items-center mb-8">
          <div className="flex gap-4">

            <input
              type="text"
              placeholder="Search Purchase Order..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 
                         focus:ring-teal-500 focus:border-teal-500 w-80 shadow-inner"
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white 
                         focus:ring-teal-500 focus:border-teal-500 shadow-inner"
            >
              <option value="">Filter by Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="ordered">Ordered</option>
              <option value="delivered">Delivered</option>
            </select>
            {user?.role != "supplier" && user?.role != "picker" &&(
              <Link
                to="/purchase-order/add"
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold
                         hover:bg-teal-500 transition-colors shadow-lg shadow-teal-700/50 transform hover:scale-[1.01]"
              >
                Create Purchase Order +
              </Link>
            )}
          </div>

        </div>

        {/* Table */}
        <div className="bg-gray-900/50 shadow-xl rounded-xl overflow-hidden border border-gray-700">
          <table className="min-w-full text-left">
            <thead className="bg-gray-800 uppercase text-xs text-gray-400 font-medium tracking-wider">
              <tr>
                <th className="px-4 py-3">PO Number</th>
                <th className="px-6 py-3">Supplier</th>
                <th className="px-6 py-3">Qty Ordered</th>
                <th className="px-6 py-3">Total Amount</th>
                <th className="px-6 py-3">Delivery Date</th>
                <th className="px-6 py-3">Created Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-1 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    No purchase orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-4 text-gray-300 font-mono">
                      {order.id}
                    </td>

                    <td className="px-6 py-4 font-medium text-white">
                      {order.supplierName}
                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      {order.products.length}
                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      {order.total}
                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      {order.deliveryDate}
                    </td>

                    <td className="px-6 py-4 text-gray-400">
                      {order.createdAt}
                    </td>

                    <td className="px-6 py-4">
                      {renderStatusBadge(order.status)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-4 text-sm font-medium">
                        <Link
                          to={`/purchase-order/${order.id}`}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <ViewIcon className="search-icon" style={{ width: '20px', height: '20px' }} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Footer */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-700 bg-gray-800/50 text-sm">
            <span className="text-gray-400">
              Showing {filteredOrders.length} of {orders.length} entries
            </span>

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
