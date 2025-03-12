"use client";
import { useEffect } from "react";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import Staffi from "@/components/Staffi";

export default function Staff() {
  return (
    <>
      <Staffi></Staffi>
    </>
  );
}
