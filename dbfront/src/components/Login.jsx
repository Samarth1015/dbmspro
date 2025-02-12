"use client";
import React, { useState } from "react";
import crypto from "crypto";

import { useRouter } from "next/navigation";

const Login = () => {
  const useroute = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here

    let hashPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    try {
      let res = await fetch(`http://localhost:8000/api/login`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ email, password: hashPassword, role }),
      });
      console.log("stat", res.status);
      if (res.status === 401) {
        alert("Invalid credentials");
      } else {
        let data = await res.json();

        console.log(data);
        localStorage.setItem("token", data?.token);
        console.log(role);
        useroute.push(`/${role}`);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role:
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="radio"
                id="customer"
                name="role"
                value="customer"
                onChange={(e) => setRole(e.target.value)}
                required
                className="mr-2"
              />
              <label htmlFor="customer" className="mr-4">
                Customer
              </label>
              <input
                type="radio"
                id="staff"
                name="role"
                value="staff"
                onChange={(e) => setRole(e.target.value)}
                required
                className="mr-2"
              />
              <label htmlFor="staff">Staff</label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
