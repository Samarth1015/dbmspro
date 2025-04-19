"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddOrder() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    services: [],
    paymentStatus: "pending", // Can be "pending" or "completed"
    paymentMode: "",
  });

  useEffect(() => {
    // Check for user authentication
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== "staff") {
      router.push("/dashboard");
      return;
    }

    setUser(userData);
    fetchServices();
  }, [router]);

  // Simulating fetching services from backend
  const fetchServices = async () => {
    try {
      setLoading(true);

      // Fetch services from the backend
      const response = await fetch("http://localhost:8000/api/services", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setServices(data);
      } else {
        // Fallback to mock data if no services returned
        setServices([
          { id: 101, name: "Wash & Iron", price: 150 },
          { id: 102, name: "Dry Cleaning", price: 100 },
          { id: 103, name: "Ironing Only", price: 80 },
          { id: 104, name: "Stain Removal", price: 200 },
          { id: 105, name: "Fabric Softening", price: 50 },
        ]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching services:", error);

      // Fallback to mock data
      setServices([
        { id: 101, name: "Wash & Iron", price: 150 },
        { id: 102, name: "Dry Cleaning", price: 100 },
        { id: 103, name: "Ironing Only", price: 80 },
        { id: 104, name: "Stain Removal", price: 200 },
        { id: 105, name: "Fabric Softening", price: 50 },
      ]);

      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (serviceId, quantity) => {
    const parsedQuantity = parseInt(quantity);

    if (parsedQuantity <= 0) {
      // Remove service if quantity is zero or negative
      setFormData((prev) => ({
        ...prev,
        services: prev.services.filter((s) => s.serviceId !== serviceId),
      }));
      return;
    }

    // Check if service already exists in formData
    const serviceExists = formData.services.some(
      (s) => s.serviceId === serviceId
    );

    if (serviceExists) {
      // Update quantity for existing service
      setFormData((prev) => ({
        ...prev,
        services: prev.services.map((s) =>
          s.serviceId === serviceId ? { ...s, quantity: parsedQuantity } : s
        ),
      }));
    } else {
      // Add new service
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, { serviceId, quantity: parsedQuantity }],
      }));
    }
  };

  const calculateTotal = () => {
    let total = 0;

    formData.services.forEach((formService) => {
      const service = services.find((s) => s.id === formService.serviceId);
      if (service) {
        total += service.price * formService.quantity;
      }
    });

    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.services.length === 0) {
      setErrorMessage("Please select at least one service");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (formData.paymentStatus === "completed" && !formData.paymentMode) {
      setErrorMessage("Please select a payment method");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare data for API
      const orderData = {
        email: formData.email,
        services: formData.services.map((s) => ({
          service_id: s.serviceId,
          quantity: s.quantity,
        })),
        id: user.id, // staff_id
        payment_status: formData.paymentStatus,
        payment_mode: formData.paymentMode,
      };

      console.log("Submitting order:", orderData);

      // Send the order data to the backend
      const response = await fetch("http://localhost:8000/api/addorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (!response.ok) {
        let errorMessage = "Failed to create order";
        try {
          // Try to parse error message from response
          const errorData = JSON.parse(responseText);
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If parsing fails, use the response text as the error message
          if (responseText) {
            errorMessage = responseText;
          }
        }
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Error parsing response JSON:", e);
        result = { order_id: "Unknown" };
      }

      console.log("Order created:", result);

      setIsSubmitting(false);
      setSuccessMessage(
        `Order created successfully! Order ID: ${result.order_id || "Unknown"}`
      );

      // Reset form
      setFormData({
        email: "",
        services: [],
        paymentStatus: "pending",
        paymentMode: "",
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error creating order:", error);
      setIsSubmitting(false);
      setErrorMessage(`Failed to create order: ${error.message}`);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Add New Order
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <div className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
                Back to Dashboard
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* Success & Error Messages */}
          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
              {errorMessage}
            </div>
          )}

          {/* Order Form */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Order Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Enter customer details and services.
              </p>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Customer Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Customer Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="customer@example.com"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Enter the customer&apos;s email address.
                    </p>
                  </div>

                  {/* Services */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Services
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Service
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {services.map((service) => {
                            const selectedService = formData.services.find(
                              (s) => s.serviceId === service.id
                            );
                            const quantity = selectedService
                              ? selectedService.quantity
                              : 0;

                            return (
                              <tr key={service.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {service.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ₹{service.price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <input
                                    type="number"
                                    min="0"
                                    value={quantity}
                                    onChange={(e) =>
                                      handleServiceChange(
                                        service.id,
                                        e.target.value
                                      )
                                    }
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-20 sm:text-sm border-gray-300 rounded-md"
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ₹{service.price * quantity}
                                </td>
                              </tr>
                            );
                          })}
                          <tr className="bg-gray-50">
                            <td
                              colSpan="3"
                              className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right"
                            >
                              Total:
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              ₹{calculateTotal()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Payment Status
                    </h4>
                    <div className="mt-2 space-y-4">
                      <div className="flex items-center">
                        <input
                          id="pending"
                          name="paymentStatus"
                          type="radio"
                          value="pending"
                          checked={formData.paymentStatus === "pending"}
                          onChange={handleInputChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label
                          htmlFor="pending"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          Payment Pending
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="completed"
                          name="paymentStatus"
                          type="radio"
                          value="completed"
                          checked={formData.paymentStatus === "completed"}
                          onChange={handleInputChange}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <label
                          htmlFor="completed"
                          className="ml-3 block text-sm font-medium text-gray-700"
                        >
                          Payment Completed
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Payment Mode (only show if payment is completed) */}
                  {formData.paymentStatus === "completed" && (
                    <div>
                      <label
                        htmlFor="paymentMode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Payment Method
                      </label>
                      <select
                        id="paymentMode"
                        name="paymentMode"
                        required
                        value={formData.paymentMode}
                        onChange={handleInputChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="">Select a payment method</option>
                        <option value="cash">Cash</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="debit_card">Debit Card</option>
                        <option value="upi">UPI</option>
                        <option value="wallet">Digital Wallet</option>
                      </select>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                        ${
                          isSubmitting
                            ? "bg-gray-400"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating Order...
                        </>
                      ) : (
                        "Create Order"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
