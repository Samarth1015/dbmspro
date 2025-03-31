"use client";
import React, { useState } from "react";
import QRCode from "react-qr-code";

const PaymentPage = () => {
  const [payment, setPayment] = useState("");
  const [amt, setAmount] = useState(0);
  // Function to generate UPI link and set payment state
  const handlePayment = (amount) => {
    let upiLink = `upi://pay?pa=jenilparmar94091@okaxis&pn=Jenil&am=${amount}&cu=INR`;
    setPayment(upiLink);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {payment ? (
        <div className="flex flex-col items-center gap-4 p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-lg font-bold">Scan to Pay</h2>

          <QRCode
            title="Scan for Payment"
            bgColor="#fff"
            fgColor="#000"
            value={payment}
            size={250}
          />
          <p className="text-sm text-gray-600">
            UPI Link:{" "}
            <a href={payment} className="text-blue-500 underline">
              Click to Pay
            </a>
          </p>
          <button
            onClick={() => setPayment("")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            Done Payment
          </button>
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter the Amount"
            className="bg-black text-white py-4 px-20 rounded-2xl my-5 placeholder:text-white"
            required
            onChange={(e) => setAmount(parseInt(e.target.value))}
          />
          <button
            onClick={() => handlePayment(amt)}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg"
          >
            Pay karo pese 
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentPage;
