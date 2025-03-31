"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode.react";

export default function Customer() {
  const [orders, setOrders] = useState(null);
  const [payment, setPayment] = useState("");
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
        console.log("API response", result);
        setOrders(result.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
    getValue();
  }, [router]);

  // Function to handle payment
  const handlePayment = (orderId, amount) => {
    let link = `upi://pay?pa=jenilparmar94091@okaxis&pn=Jenil&am=${amount}&cu=INR`;
    setPayment(link);
  };

  // Loading state
  if (!orders) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading order details...</p>
      </div>
    );
  }

  // Get customer ID from the first order
  const customerId = orders.length > 0 ? orders[0].customer_id : "Unknown";

  // Render QR Code if payment link exists
  if (payment !== "") {
    return (
      <div className="flex flex-col items-center gap-4 p-4 border rounded-xl shadow-lg">
        <h2 className="text-lg font-bold">Scan to Pay</h2>
        <QRCode value={payment} size={200} />
        <p className="text-sm">UPI Link: {payment}</p>
        <button
          onClick={() => setPayment("")}
          className="bg-blue-400 py-2 px-4 w-fit self-center rounded-xl"
        >
          Done Payment
        </button>
      </div>
    );
  }

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
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
                      Rs {parseFloat(order.final_total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={
                          order.status === "paid"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.status === "pending" && (
                        <button
                          onClick={() =>
                            handlePayment(
                              order.order_id,
                              parseFloat(order.final_total).toFixed(2)
                            )
                          }
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Pay Now
                        </button>
                      )}
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
