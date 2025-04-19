"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { WashingMachine as Washing } from "lucide-react";

export default function Customer() {
  const [orders, setOrders] = useState(null);
  const router = useRouter();
  const headerRef = useRef(null);
  const tableRef = useRef(null);
  const rowRefs = useRef([]);

  useEffect(() => {
    // Initial animations
    gsap.from(headerRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(tableRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: "power3.out",
    });

    // Stagger animation for table rows
    if (orders) {
      gsap.from(rowRefs.current, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
    }
  }, [orders]);

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
        console.log("Api response", result);
        if (result.data === null) {
          setOrders([]);
        } else {
          setOrders(result.data);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
    getValue();
  }, [router]);

  const handlePayment = (orderId, amount) => {
    console.log(`Initiating payment for order: ${orderId}`);
  };

  console.log("Orders:", orders);
  if (orders === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-bounce flex flex-col items-center">
          <Washing className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="mt-4 text-lg font-medium text-gray-600">
            Loading your laundry details...
          </p>
        </div>
      </div>
    );
  }

  // **Show "No Orders" message with an "Add Order" button**
  if (orders.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-center p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-20 h-20 text-gray-400 mb-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3h18v18H3z" />
          <path d="M9 9h6v6H9z" />
          <path d="M3 15h6v6H3z" />
          <path d="M15 3h6v6h-6z" />
        </svg>
        <h2 className="text-2xl font-semibold text-gray-700">
          No Orders Found
        </h2>
        <p className="text-gray-500 mt-2">
          You haven't placed any orders yet. Start by adding a new order!
        </p>
      </div>
    );
  }

  const customerId = orders.length > 0 ? orders[0].customer_id : "Unknown";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-5xl mx-auto px-4" ref={headerRef}>
        <div className="text-center mb-8">
          <Washing className="w-16 h-16 mx-auto text-blue-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Your Laundry Orders
          </h1>
          <p className="text-gray-600">
            Customer ID:{" "}
            <span className="font-semibold text-blue-600">{customerId}</span>
          </p>
        </div>

        <div
          className="bg-white shadow-xl rounded-2xl overflow-hidden"
          ref={tableRef}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-500">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Staff ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Final Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    ref={(el) => (rowRefs.current[index] = el)}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{order.order_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.staff_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.order_date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      Rs{parseFloat(order.final_total || "0").toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 rounded-full ${
                          order.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.status === "pending" &&
                      parseFloat(order.final_total || "0") > 0 ? (
                        <button
                          onClick={() =>
                            router.push(
                              `/temp/${order.final_total}?orderId=${order.order_id}`
                            )
                          }
                          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transform hover:scale-105 transition-all duration-200"
                        >
                          Pay Now
                        </button>
                      ) : order.status === "pending" ? (
                        <span className="text-gray-500">Amount not set</span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/signup")}
            className="bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-900 transform hover:scale-105 transition-all duration-200"
          >
            Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
}
