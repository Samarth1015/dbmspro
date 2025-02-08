"use client";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export default function Staff() {
  useEffect(() => {
    let collect = async () => {
      let token = localStorage.getItem("token");
      console.log(token);
      try {
        let res = await fetch("http://localhost:8000/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (res.status === 401) {
          alert("Unauthorized");
          redirect("/login");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        redirect("/login");
      }
    };
    collect();
  }, []);
  return <>hiiii</>;
}
