"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { UserPlus, Mail, Lock, Home, User, WashingMachine } from "lucide-react";
import Link from "next/link";
import crypto from "crypto";

const SignupPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Refs for GSAP animations
  const formRef = useRef(null);
  const headerRef = useRef(null);
  const inputsRef = useRef(null);
  const buttonRef = useRef(null);
  const linkRef = useRef(null);

  useEffect(() => {
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
        inputsRef.current,
        {
          y: 30,
          opacity: 0,
        },
        "-=0.5"
      )
      .from(
        buttonRef.current,
        {
          scale: 0.9,
          opacity: 0,
          ease: "back.out(1.7)",
        },
        "-=0.3"
      )
      .from(
        linkRef.current,
        {
          y: 20,
          opacity: 0,
        },
        "-=0.2"
      );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Animate button on click
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    const hashPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    try {
      const res = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          address,
          password: hashPassword,
          role: role.toLowerCase(),
        }),
      });

      const data = await res.json();
      localStorage.setItem("id", data.id);

      // Success animation
      gsap.to(formRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          router.push(`/${role}`);
        },
      });
    } catch (err) {
      // Error animation
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.4,
        ease: "power2.inOut",
      });
      alert("User already exists");
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div
        ref={formRef}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl"
      >
        <div ref={headerRef} className="text-center">
          <WashingMachine className="mx-auto h-16 w-16 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our laundry service today
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
          ref={inputsRef}
        >
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="appearance-none block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <div className="mt-1 relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="appearance-none block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your address"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors duration-200">
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={role === "customer"}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="sr-only"
                  />
                  <div
                    className={`flex items-center ${
                      role === "customer" ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    <User className="h-5 w-5 mr-2" />
                    <span className="font-medium">Customer</span>
                  </div>
                  {role === "customer" && (
                    <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none"></div>
                  )}
                </label>

                <label className="relative flex items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors duration-200">
                  <input
                    type="radio"
                    name="role"
                    value="staff"
                    checked={role === "staff"}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="sr-only"
                  />
                  <div
                    className={`flex items-center ${
                      role === "staff" ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    <WashingMachine className="h-5 w-5 mr-2" />
                    <span className="font-medium">Staff</span>
                  </div>
                  {role === "staff" && (
                    <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none"></div>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div ref={buttonRef}>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
              </span>
              {isLoading ? (
                <div className="flex items-center">
                  <WashingMachine className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Creating account...
                </div>
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        </form>

        <div ref={linkRef} className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
