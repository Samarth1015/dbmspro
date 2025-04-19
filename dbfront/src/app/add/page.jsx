"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { WashingMachine, Plus, CreditCard, Wallet, Send } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Add() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentMode, setPaymentMode] = useState("cash");

  // Refs for GSAP animations
  const formRef = useRef(null);
  const headerRef = useRef(null);
  const servicesRef = useRef(null);
  const paymentRef = useRef(null);
  const submitRef = useRef(null);
  const serviceRefs = useRef([]);

  const services = [
    { id: 1, name: "wash", price: 10, icon: WashingMachine },
    { id: 2, name: "dryclean", price: 20, icon: WashingMachine },
    { id: 3, name: "press", price: 5, icon: WashingMachine },
    { id: 4, name: "wash and press", price: 12, icon: WashingMachine },
  ];
  const router = useRouter();
  const paymentStatuses = ["pending", "paid"];
  const paymentModes = ["cash", "card", "online"];

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setLoading(false), 1000);

    // Initial animations
    if (!loading) {
      const tl = gsap.timeline({
        defaults: {
          ease: "expo.out",
        },
      });

      tl.from(formRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
      })
        .from(
          headerRef.current,
          {
            y: -30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.5"
        )
        .from(
          servicesRef.current,
          {
            y: 30,
            opacity: 2,
            duration: 0.8,
          },
          "-=0.5"
        )
        .from(
          serviceRefs.current,
          {
            y: 20,
            opacity: 3,
            stagger: 0.1,
            duration: 0.6,
          },
          "-=0.3"
        )
        .from(
          paymentRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.3"
        )
        .from(
          submitRef.current,
          {
            scale: 0.9,
            opacity: 3,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.2"
        );
    }

    return () => clearTimeout(timer);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Animate button on submit
    gsap.to(submitRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    const orderData = {
      email,
      services: selectedServices.map((service) => ({
        service_id: service.id,
        quantity: service.quantity || 1,
      })),
      payment_status: paymentStatus,
      id: localStorage.getItem("id"),
    };

    if (paymentStatus === "paid" && paymentMode) {
      orderData.payment_mode = paymentMode;
    }

    try {
      console.log(orderData);
      const response = await fetch("http://localhost:8000/api/addorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      console.log(result);

      // Success animation
      gsap.to(formRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          alert("Order added successfully!");
          // Reset form
          setEmail("");
          setSelectedServices([]);
          setPaymentStatus("pending");
          setPaymentMode("cash");
          router.push("/staff");
          // Animate form back in
          gsap.to(formRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.5,
          });
        },
      });
    } catch (error) {
      console.error("Error adding order:", error);
      alert("Failed to add order. Please try again.");
    }
  };

  const handleServiceChange = (serviceId, quantity) => {
    // Animate quantity change
    gsap.to(serviceRefs.current[serviceId - 1], {
      scale: 1.05,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
    });

    setSelectedServices((prev) =>
      prev.find((s) => s.id === serviceId)
        ? prev.map((s) => (s.id === serviceId ? { ...s, quantity } : s))
        : [...prev, { id: serviceId, quantity }]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-bounce flex flex-col items-center">
          <WashingMachine className="w-16 h-16 text-blue-500 animate-spin" />
          <p className="mt-4 text-xl font-medium text-gray-600">
            Preparing your order form...
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Just a moment while we get everything ready
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12">
      <div
        ref={formRef}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 hover:shadow-2xl"
      >
        <div ref={headerRef}>
          <div className="flex items-center justify-center mb-2">
            <Plus className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Add New Order
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter customer email"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Select Services
            </h3>
            {services.map((service, index) => (
              <div
                key={service.id}
                ref={(el) => (serviceRefs.current[index] = el)}
                className="flex items-center justify-between mb-4 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200"
              >
                <div className="flex items-center">
                  <service.icon className="w-5 h-5 text-blue-600 mr-2" />
                  <label className="text-sm font-medium text-gray-600">
                    {service.name.charAt(0).toUpperCase() +
                      service.name.slice(1)}{" "}
                    (Rs{service.price})
                  </label>
                </div>
                <input
                  type="number"
                  min="1"
                  onChange={(e) =>
                    handleServiceChange(
                      service.id,
                      parseInt(e.target.value) || 1
                    )
                  }
                  placeholder="Qty"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            ))}
          </div>{" "}
          <div ref={paymentRef} className="space-y-4">
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
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {paymentStatus === "paid" && (
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
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            ref={submitRef}
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Add Order</span>
          </button>
        </form>
      </div>
    </div>
  );
}
