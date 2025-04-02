"use client";
import { useEffect, useState } from "react";

export default function Update({ params }) {
  const [id, setId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentMode, setPaymentMode] = useState("cash");

  const paymentStatuses = ["pending", "paid"];
  const paymentModes = ["cash", "card", "online"];

  useEffect(() => {
    let getId = async () => {
      let resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getId();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    let getdata = async () => {
      try {
        let response = await fetch(`http://localhost:8000/api/staff/${id}`, {
          method: "GET",
        });
        let result = await response.json();
        setData(result[0]);
        // Set initial payment status and mode from API response
        setPaymentStatus(result[0].payment_status);
        setPaymentMode(result[0].payment_mode || "cash");
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    getdata();
  }, [id]);

  const handleQuantityChange = (index, newQuantity) => {
    let updatedInner = [...data.inner];
    updatedInner[index].quantity = newQuantity;
    setData({ ...data, inner: updatedInner });
  };

  const handleSave = async () => {
    const updatedData = {
      ...data,
      payment_status: paymentStatus,
      ...(paymentStatus === "paid" && { payment_mode: paymentMode }), // Only include payment_mode if status is 'paid'
    };

    try {
      let response = await fetch(`http://localhost:8000/api/staff/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      let result = await response.json();
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating data: ", error);
      alert("Failed to update data.");
    }
  };

  if (loading)
    return <div className="text-center text-gray-500 mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Details</h1>

      {data && (
        <>
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Order ID:</span> {data.order_id}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Customer ID:</span>{" "}
              {data.customer_id}
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Services
          </h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                  <th className="py-3 px-6 text-left">Service ID</th>
                  <th className="py-3 px-6 text-left">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {data.inner.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 text-gray-700">
                      {item.service_id}
                    </td>
                    <td className="py-4 px-6">
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(index, e.target.value)
                        }
                        className="w-16 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Status Dropdown m */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="mb-4">
              <label
                htmlFor="paymentStatus"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Payment Status
              </label>
              <select
                id="paymentStatus"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Mode Dropdown - Shown only if status is 'paid' */}
            {paymentStatus === "paid" && (
              <div>
                <label
                  htmlFor="paymentMode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Payment Mode
                </label>
                <select
                  id="paymentMode"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {paymentModes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Save Changes
          </button>
        </>
      )}
    </div>
  );
}
