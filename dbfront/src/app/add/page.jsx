"use client";
import { useState } from "react";

export default function Add() {
  let [data, setData] = useState({
    customer_id: "",
    order_date: "",
    status: "",
    price: "",
    quantity: "",
  });
  let handleData = async () => {
    if (
      !data.customer_id ||
      !data.order_date ||
      !data.status ||
      !data.price ||
      !data.quantity
    ) {
      alert("Fill all fields");
      return;
    }
    console.log(data);
    await fetch("http://localhost:8000/api/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };
  return (
    <>
      <input
        onChange={(e) => {
          setData({ ...data, [e.target.name]: e.target.value });
        }}
        type="text"
        name="customer_id"
        placeholder="Customer ID"
        className="border p-2 rounded w-full"
      />

      <input
        onChange={(e) => {
          setData({ ...data, [e.target.name]: e.target.value });
        }}
        type="date"
        name="order_date"
        className="border p-2 rounded w-full"
      />

      <input
        onChange={(e) => {
          setData({ ...data, [e.target.name]: e.target.value });
        }}
        type="text"
        name="status"
        placeholder="Status"
        className="border p-2 rounded w-full"
      />

      <input
        onChange={(e) => {
          setData({ ...data, [e.target.name]: e.target.value });
        }}
        type="number"
        name="price"
        placeholder="Price"
        className="border p-2 rounded w-full"
      />

      <input
        onChange={(e) => {
          setData({ ...data, [e.target.name]: e.target.value });
        }}
        type="number"
        name="quantity"
        placeholder="Quantity"
        className="border p-2 rounded w-full"
      />
      <button onClick={handleData}>submit</button>
    </>
  );
}
