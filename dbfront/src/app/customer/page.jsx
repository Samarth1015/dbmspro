"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Customer() {
  const [orders, setOrders] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getValue = async () => {
      let id = localStorage.getItem("id");
      if (!id) {
        router.push("/signup");
        return;
      }

      try {
        let response = await fetch("http://localhost:8000/api/getcutomeritem", {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ id: id }),
        });
        const result = await response.json();
        setOrders(result.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
    getValue();
  }, [router]);

  // Loading state
  if (!orders) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading order details...</p>
      </div>
    );
  }

  // Get customer ID from the first order (assuming all orders belong to the same customer)
  const customerId = orders.length > 0 ? orders[0].customer_id : "Unknown";

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2 text-center">Order Details</h1>
        <p className="text-center text-gray-600 mb-6">
          This is the detail for customer with ID:{" "}
          <span className="font-semibold">{customerId}</span>
        </p>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Final Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.order_id}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.staff_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.order_date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      Rs{parseFloat(order.final_total).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/signup")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
}
