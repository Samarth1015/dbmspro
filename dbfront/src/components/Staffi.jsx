"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  ClipboardList,
  Search,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  WashingMachine,
} from "lucide-react";

export default function Staffi() {
  const router = useRouter();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState(null);
  const [staffId, setStaffId] = useState("");
  const [showPending, setShowPending] = useState(false);
  const [showPaid, setShowPaid] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  // Refs for GSAP animations
  const headerRef = useRef(null);
  const controlsRef = useRef(null);
  const tableRef = useRef(null);
  const rowRefs = useRef([]);

  useEffect(() => {
    // Initial animations with smoother easing
    const tl = gsap.timeline({
      defaults: {
        ease: "expo.out",
      },
    });

    tl.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 1.2,
    })
      .from(
        controlsRef.current,
        {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "back.out(1.7)",
        },
        "-=0.8"
      )
      .from(
        tableRef.current,
        {
          y: 100,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
        },
        "-=0.7"
      );

    // Animate rows when data changes
    if (orders?.length > 0) {
      gsap.from(rowRefs.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      });
    }
  }, [orders]);

  useEffect(() => {
    const staffid = localStorage.getItem("id");
    if (!staffid) {
      router.push("/login");
      return;
    }

    setStaffId(staffid);

    const getData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/getstaffdata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ staff_id: staffid }),
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        console.log("API response:", data);
        if (data === null) {
          setOrders([]);
        } else {
          setOrders(data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch orders. Please try again.");
      }
    };

    getData();
  }, [router]);

  const handleDelete = async (orderId) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`http://localhost:8000/api/staff/${orderId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      // Enhanced delete animation
      const rowElement = rowRefs.current[orderId];
      if (rowElement) {
        gsap.to(rowElement, {
          height: 0,
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            setOrders(orders.filter((order) => order.order_id !== orderId));
          },
        });
      }
    } catch (err) {
      console.error("Error deleting order:", err);
      setError("Failed to delete order. Please try again.");
    }
  };

  const handleUpdate = (orderId) => {
    router.push(`/staff/update/${orderId}`);
  };

  const redirectTo = () => {
    router.push("/add");
  };

  const toggleSort = () => {
    setSortAsc(!sortAsc);
    // Enhanced sort animation
    gsap.from(rowRefs.current, {
      scale: 0.97,
      opacity: 0.5,
      duration: 0.5,
      stagger: 0.03,
      ease: "back.out(1.7)",
    });
  };

  if (orders === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-bounce flex flex-col items-center">
          <WashingMachine className="w-16 h-16 text-blue-500 animate-spin" />
          <p className="mt-4 text-xl font-medium text-gray-600">
            Loading your laundry dashboard...
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Please wait while we fetch your orders
          </p>
        </div>
      </div>
    );
  }

  // Show "Add New Order" button when orders array is empty
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-lg">
        <ClipboardList className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg">
          No orders found. Add a new order to get started.
        </p>
        <div className="mt-8 text-center">
          <button
            onClick={redirectTo}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Order
          </button>
        </div>
      </div>
    );
  }

  const filteredOrders = orders
    .filter((order) => {
      const isPending = !showPending || order.status === "pending";
      const isPaid = !showPaid || order.status === "paid";
      const matchesSearch =
        order.order_id.toString().includes(searchQuery) ||
        order.customer_id.toString().includes(searchQuery);
      return isPending && isPaid && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.order_date);
      const dateB = new Date(b.order_date);
      return sortAsc ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-blue-50 to-white">
      <div ref={headerRef} className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <ClipboardList className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            Staff Dashboard
          </h2>
          <p className="text-gray-600">
            Staff ID:{" "}
            <span className="font-semibold text-blue-600">
              {staffId || "Loading..."}
            </span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-fade-in">
            {error}
          </div>
        )}

        <div
          ref={controlsRef}
          className="bg-white p-6 rounded-xl shadow-lg mb-6"
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID or Customer ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-200"
              />
            </div>

            <div className="flex gap-4 items-center">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={showPending}
                  onChange={() => setShowPending(!showPending)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-200"
                />
                <span className="ml-2 text-gray-700">Pending Only</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={showPaid}
                  onChange={() => setShowPaid(!showPaid)}
                  className="form-checkbox h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-200"
                />
                <span className="ml-2 text-gray-700">Paid Only</span>
              </label>

              <button
                onClick={toggleSort}
                className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    sortAsc ? "" : "rotate-180"
                  } transition-transform duration-200`}
                />
                {sortAsc ? "Oldest First" : "Newest First"}
              </button>
            </div>
          </div>
        </div>

        {filteredOrders?.length === 0 && !error ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <ClipboardList className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No orders to display...</p>
          </div>
        ) : (
          <div
            ref={tableRef}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <th className="py-4 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Customer ID
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Order Date
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Final Total
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders?.map((order, index) => (
                    <tr
                      key={order.order_id}
                      ref={(el) => (rowRefs.current[order.order_id] = el)}
                      className="hover:bg-blue-50 transition-all duration-200"
                    >
                      <td className="py-4 px-6 border-b">{order.order_id}</td>
                      <td className="py-4 px-6 border-b">
                        {order.customer_id}
                      </td>
                      <td className="py-4 px-6 border-b">
                        {new Date(order.order_date).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 border-b font-medium">
                        Rs {parseFloat(order.final_total).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 border-b">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 border-b">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(order.order_id)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                            title="Update Order"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(order.order_id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete Order"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={redirectTo}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Order
          </button>
        </div>
      </div>
    </div>
  );
}
