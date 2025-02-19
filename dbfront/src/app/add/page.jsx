"use client";
import { useState } from "react";

export default function Add() {
  let [data, setData] = useState({
    name: "",
    order_date: "",
    status: "",
    price: "",
    services: [], // Array to store multiple services
  });

  let handleData = async () => {
    if (
      !data.name ||
      !data.order_date ||
      !data.status ||
      !data.price ||
      data.services.length === 0
    ) {
      alert("Fill all fields and add at least one service");
      return;
    }
    console.log(data);
    let res = await fetch("http://localhost:8000/api/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    console.log(await res.json());
  };

  let addService = () => {
    setData({
      ...data,
      services: [...data.services, (service_name: ""), (quantity: "")],
    });
  };

  let updateService = (index, key, value) => {
    let updatedServices = [...data.services];
    updatedServices[index][key] = value;
    setData({ ...data, services: updatedServices });
  };

  return (
    <>
      <input
        onChange={(e) => setData({ ...data, name: e.target.value })}
        type="text"
        name="name"
        placeholder="Customer Name"
        className="border p-2 rounded w-full"
      />

      <input
        onChange={(e) => setData({ ...data, order_date: e.target.value })}
        type="date"
        name="order_date"
        className="border p-2 rounded w-full"
      />

      <input
        onChange={(e) => setData({ ...data, status: e.target.value })}
        type="text"
        name="status"
        placeholder="Status"
        className="border p-2 rounded w-full"
      />

      <input
        onChange={(e) => setData({ ...data, price: e.target.value })}
        type="number"
        name="price"
        placeholder="Price"
        className="border p-2 rounded w-full"
      />

      <h3 className="mt-4">Services:</h3>
      {data.services.map((service, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Service Name"
            className="border p-2 rounded w-full"
            value={service.service_name}
            onChange={(e) =>
              updateService(index, "service_name", e.target.value)
            }
          />
          <input
            type="number"
            placeholder="Quantity"
            className="border p-2 rounded w-20"
            value={service.quantity}
            onChange={(e) => updateService(index, "quantity", e.target.value)}
          />
        </div>
      ))}
      <button
        onClick={addService}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        + Add Service
      </button>

      <button
        onClick={handleData}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Submit
      </button>
    </>
  );
}
