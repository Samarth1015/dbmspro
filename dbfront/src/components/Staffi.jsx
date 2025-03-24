"use client"; // Ensure this is a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Staffi() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [staffId, setStaffId] = useState("");

  useEffect(() => {
    const staffid = localStorage.getItem("id");
    if (!staffid) {
      router.push("/login");
      return;
    }

    setStaffId(staffid);
    console.log("Staff ID:", staffid);

    const getData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/getstaffdata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ staff_id: staffid }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Fetched data:", data);
        setOrders(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch orders. Please try again.");
      }
    };

    getData();
  }, [router]);

  // Delete order function
  const handleDelete = async (orderId) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch("http://localhost:8000/api/deletestafforder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      // Remove the deleted order from state
      setOrders(orders.filter((order) => order.order_id !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
      setError("Failed to delete order. Please try again.");
    }
  };

  // Update order function (redirect to update page)
  const handleUpdate = (orderId) => {
    router.push(`/staff/update/${orderId}`);
  };

  const redirectTo = () => {
    router.push("/add");
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
        Staff Orders
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Orders for Staff ID: {staffId || "Loading..."}
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {orders?.length === 0 && !error ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Customer ID</th>
                <th className="py-3 px-4 text-left">Order Date</th>
                <th className="py-3 px-4 text-left">Final Total</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order, index) => (
                <tr
                  key={order.order_id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-3 px-4 border-b">{order.order_id}</td>
                  <td className="py-3 px-4 border-b">{order.customer_id}</td>
                  <td className="py-3 px-4 border-b">{order.order_date}</td>
                  <td className="py-3 px-4 border-b">{order.final_total}</td>
                  <td className="py-3 px-4 border-b">
                    <button
                      onClick={() => handleUpdate(order.order_id)}
                      className="mr-2 py-1 px-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(order.order_id)}
                      className="py-1 px-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={redirectTo}
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Data
        </button>
      </div>
    </div>
  );
}
