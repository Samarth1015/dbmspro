"use client";
import React, { useState } from "react";

export default function Add() {
  const [email, setEmail] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("pending"); // Default to 'pending'
  const [paymentMode, setPaymentMode] = useState("cash"); // Default to 'cash'

  const services = [
    { id: 1, name: "wash", price: 10 },
    { id: 2, name: "dryclean", price: 20 },
    { id: 3, name: "press", price: 5 },
    { id: 4, name: "wash and press", price: 12 },
  ];

  const paymentStatuses = ["pending", "paid"];
  const paymentModes = ["cash", "card", "online"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      email,
      services: selectedServices.map((service) => ({
        service_id: service.id,
        quantity: service.quantity || 1,
      })),
      payment_status: paymentStatus, // Add payment status

      id: localStorage.getItem("id"),
    };
    if (paymentStatus === "pending") {
      orderData.payment_status = paymentStatus;
    }

    // Conditionally add payment_mode only if paymentStatus is 'paid'
    if (paymentStatus === "paid" && paymentMode) {
      orderData.payment_mode = paymentMode;
    }
    console.log(orderData);

    try {
      const response = await fetch("http://localhost:8000/api/addorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      console.log(result);
      alert("Order added successfully!");
    } catch (error) {
      console.error("Error adding order:", error);
      alert("Failed to add order. Please try again.");
    }
  };

  const handleServiceChange = (serviceId, quantity) => {
    setSelectedServices((prev) =>
      prev.find((s) => s.id === serviceId)
        ? prev.map((s) => (s.id === serviceId ? { ...s, quantity } : s))
        : [...prev, { id: serviceId, quantity }]
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Add New Order
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Services List */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Select Services
            </h3>
            {services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between mb-4"
              >
                <label className="text-sm font-medium text-gray-600">
                  {service.name} (Rs{service.price})
                </label>
                <input
                  type="number"
                  min="1"
                  onChange={(e) =>
                    handleServiceChange(
                      service.id,
                      parseInt(e.target.value) || 1
                    )
                  }
                  placeholder="Quantity"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            ))}
          </div>
          <div>
            <label
              htmlFor="paymentStatus"
              className="block text-sm font-medium text-gray-700"
            >
              Payment Status
            </label>
            <select
              id="paymentStatus"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Status Dropdown */}
          {paymentStatus === "pending" ? (
            <></>
          ) : (
            <>
              {/* Payment Mode Dropdown */}
              <div>
                <label
                  htmlFor="paymentMode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Payment Mode
                </label>
                <select
                  id="paymentMode"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {paymentModes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Add Order
          </button>
        </form>
      </div>
    </div>
  );
}
