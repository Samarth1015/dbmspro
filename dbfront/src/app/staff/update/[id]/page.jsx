"use client";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import {
  ClipboardEdit,
  WashingMachine,
  Save,
  CreditCard,
  Wallet,
  Package2,
  Iron,
  Shirt,
} from "lucide-react";

export default function Update({ params }) {
  const [id, setId] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [allServices, setAllServices] = useState([]);

  // Services data
  const services = [
    { id: 1, name: "Wash", price: 10, icon: WashingMachine },
    { id: 2, name: "Dryclean", price: 20, icon: Shirt },
    { id: 3, name: "Press", price: 5, icon: Iron },
    { id: 4, name: "Wash and Press", price: 12, icon: WashingMachine },
  ];

  // Refs for GSAP animations
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const orderDetailsRef = useRef(null);
  const servicesRef = useRef(null);
  const paymentRef = useRef(null);
  const buttonRef = useRef(null);
  const serviceRowRefs = useRef([]);

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
        setPaymentStatus(result[0].payment_status);
        setPaymentMode(result[0].payment_mode || "cash");

        // Initialize all services with existing order data
        initializeAllServices(result[0].inner);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    getdata();
  }, [id]);

  useEffect(() => {
    if (!loading && data) {
      // Initial animations
      const tl = gsap.timeline({
        defaults: {
          ease: "expo.out",
          duration: 0.8,
        },
      });

      tl.from(headerRef.current, {
        y: -50,
        opacity: 0,
      })
        .from(
          orderDetailsRef.current,
          {
            y: 30,
            opacity: 0,
          },
          "-=0.5"
        )
        .from(
          servicesRef.current,
          {
            y: 30,
            opacity: 0,
          },
          "-=0.5"
        )
        .from(
          serviceRowRefs.current,
          {
            y: 20,
            opacity: 0,
            stagger: 0.1,
          },
          "-=0.3"
        )
        .from(
          paymentRef.current,
          {
            y: 30,
            opacity: 0,
          },
          "-=0.2"
        )
        .from(
          buttonRef.current,
          {
            scale: 0.9,
            opacity: 3,
            ease: "back.out(1.7)",
          },
          "-=0.2"
        );
    }
  }, [loading]);

  // Initialize all services array with quantities from order
  const initializeAllServices = (orderItems) => {
    const servicesWithQuantity = services.map((service) => {
      const orderItem = orderItems.find(
        (item) => parseInt(item.service_id) === service.id
      );
      return {
        ...service,
        quantity: orderItem ? orderItem.quantity.toString() : "0",
        inOrder: !!orderItem,
      };
    });
    setAllServices(servicesWithQuantity);
  };

  // Get service details by ID
  const getServiceById = (serviceId) => {
    return (
      services.find((service) => service.id === parseInt(serviceId)) || {
        name: "Unknown Service",
        price: 0,
        icon: WashingMachine,
      }
    );
  };

  // Handle quantity change for any service
  const handleServiceQuantityChange = (serviceId, newQuantity) => {
    // Update the allServices state
    setAllServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? {
              ...service,
              quantity: newQuantity,
              inOrder: parseInt(newQuantity) > 0,
            }
          : service
      )
    );
  };

  // Prepare data for saving to backend
  const prepareDataForSave = () => {
    // Filter services with quantity > 0 and format for backend
    const updatedInner = allServices
      .filter((service) => parseInt(service.quantity) > 0)
      .map((service) => ({
        service_id: service.id.toString(),
        quantity: service.quantity,
      }));

    return {
      ...data,
      inner: updatedInner,
      payment_status: paymentStatus,
      ...(paymentStatus === "paid" && { payment_mode: paymentMode }),
    };
  };

  const handleSave = async () => {
    // Animate button click
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    const updatedData = prepareDataForSave();

    console.log(updatedData);
    try {
      let response = await fetch(`http://localhost:8000/api/staff/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      let result = await response.json();

      // Success animation
      gsap.to(containerRef.current, {
        y: -20,
        opacity: 0.8,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          alert("Order updated successfully!");
        },
      });
    } catch (error) {
      console.error("Error updating data: ", error);
      alert("Failed to update data.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-bounce flex flex-col items-center">
          <WashingMachine className="w-16 h-16 text-blue-500 animate-spin" />
          <p className="mt-4 text-xl font-medium text-gray-600">
            Loading order details...
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div ref={containerRef} className="max-w-4xl mx-auto">
        <div ref={headerRef} className="text-center mb-8">
          <ClipboardEdit className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Update Order</h1>
          <p className="text-gray-600 mt-2">Make changes to order #{id}</p>
        </div>

        {data && (
          <>
            <div
              ref={orderDetailsRef}
              className="bg-white p-6 rounded-2xl shadow-xl mb-8 transform transition-all duration-300 hover:shadow-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Package2 className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {data.order_id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Customer ID</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {data.customer_id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={servicesRef}
              className="bg-white p-6 rounded-2xl shadow-xl mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <WashingMachine className="w-5 h-5 mr-2 text-blue-600" />
                Services
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-50 text-left">
                      <th className="py-3 px-6 text-sm font-medium text-gray-700">
                        Service
                      </th>
                      <th className="py-3 px-6 text-sm font-medium text-gray-700">
                        Price
                      </th>
                      <th className="py-3 px-6 text-sm font-medium text-gray-700 rounded-tr-lg">
                        Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allServices.map((service, index) => {
                      const ServiceIcon = service.icon || WashingMachine;
                      return (
                        <tr
                          key={index}
                          ref={(el) => (serviceRowRefs.current[index] = el)}
                          className={`border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 ${
                            parseInt(service.quantity) > 0
                              ? "bg-blue-50/30"
                              : ""
                          }`}
                        >
                          <td className="py-4 px-6 text-gray-700">
                            <div className="flex items-center space-x-2">
                              <ServiceIcon className="w-5 h-5 text-blue-500" />
                              <span>{service.name}</span>
                              <span className="text-xs text-gray-500">
                                ({service.id})
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-700">
                            ${service.price.toFixed(2)}
                          </td>
                          <td className="py-4 px-6">
                            <input
                              type="number"
                              min="0"
                              value={service.quantity}
                              onChange={(e) =>
                                handleServiceQuantityChange(
                                  service.id,
                                  e.target.value
                                )
                              }
                              className={`w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                parseInt(service.quantity) > 0
                                  ? "border-blue-500"
                                  : "border-gray-300"
                              }`}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-blue-50">
                      <td
                        className="py-3 px-6 font-medium text-gray-700"
                        colSpan="2"
                      >
                        Total
                      </td>
                      <td className="py-3 px-6 font-medium text-gray-700">
                        $
                        {allServices
                          .reduce((total, service) => {
                            return (
                              total +
                              service.price * parseInt(service.quantity || "0")
                            );
                          }, 0)
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div
              ref={paymentRef}
              className="bg-white p-6 rounded-2xl shadow-xl mb-8"
            >
              <div className="space-y-6">
                <div>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Payment Mode
                    </label>
                    <select
                      id="paymentMode"
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
            </div>

            <div className="text-center">
              <button
                ref={buttonRef}
                onClick={handleSave}
                className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 mx-auto"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
