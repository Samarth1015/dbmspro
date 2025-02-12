"use client";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import Staffi from "@/components/Staffi";

export default function Staff() {
  useEffect(() => {
    let collect = async () => {
      let token = localStorage.getItem("token");

      console.log(token);
      try {
        let res = await fetch("http://localhost:8000/api/staff", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 401) {
          alert("Unauthorized");
          redirect("/login");
        }
        console.log(await res.json());
      } catch (error) {
        console.error("Token verification failed:", error);
        redirect("/login");
      }
    };
    collect();
  }, []);
  return (
    <>
      <Staffi></Staffi>
    </>
  );
}
