"use client"; // Ensure this is a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Staffi() {
  const router = useRouter(); // Use useRouter for client-side navigation
  const [orders, setOrders] = useState([]); // State to store the fetched orders
  const [error, setError] = useState(null); // State to handle errors
  const [staffId, setStaffId] = useState(""); // State to store the staff ID

  useEffect(() => {
    // Check if staffid exists in localStorage, redirect to login if not
    const staffid = localStorage.getItem("id");
    if (!staffid) {
      router.push("/login");
      return;
    }

    setStaffId(staffid); // Store the staff ID in state
    console.log("Staff ID:", staffid);

    // Fetch data from the backend
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
        setOrders(data); // Store the fetched data in state
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch orders. Please try again.");
      }
    };

    getData();
  }, [router]); // Add router to dependency array

  // Function to redirect to the /add page
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

      {orders.length === 0 && !error ? (
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
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={order.order_id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-3 px-4 border-b">{order.order_id}</td>
                  <td className="py-3 px-4 border-b">{order.customer_id}</td>
                  <td className="py-3 px-4 border-b">{order.order_date}</td>
                  <td className="py-3 px-4 border-b">{order.final_total}</td>
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
