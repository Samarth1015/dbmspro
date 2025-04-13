"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";

const PaymentPage = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅ moved outside useEffect
  const orderId = searchParams.get("orderId"); // ✅ safe to use here

  const amt = parseInt(params.amt); // dynamic segment
  const [payment, setPayment] = useState("");
  const [amount, setAmount] = useState(amt || 0); // form input

  const handlePayment = (value) => {
    const upiLink = `upi://pay?pa=jenilparmar94091@okaxis&pn=Jenil&am=${value}&cu=INR`;
    setPayment(upiLink);
  };

  const handleDone = async () => {
    console.log("Payment completed for order:", orderId);
    let res = await fetch(`http://localhost:8000/api/updateamt/${orderId}`, {
      method: "PUT",
    });
    const data = await res.json();
    if (res.status === 200) {
      console.log("Payment updated successfully:", data);
      router.back();
    } else {
      console.error("Error updating payment:", data);
    }
    // ✅ optional: redirect or API call
    // router.push("/thank-you");
  };

  useEffect(() => {
    if (amt) {
      handlePayment(amt);
    }
  }, [amt]);

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
            onClick={handleDone}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            Done Payment
          </button>
        </div>
      ) : (
        <>
          <input
            type="number"
            placeholder="Enter the Amount"
            className="bg-black text-white py-4 px-20 rounded-2xl my-5 placeholder:text-white"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
          />
          <button
            onClick={() => handlePayment(amount)}
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
