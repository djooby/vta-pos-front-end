"use client";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { UserContext } from "@/layout/context/usercontext";
import { useContext, useEffect, useState } from "react";

export default function Product() {
  const { layoutConfig } = useContext(LayoutContext);
  const { userInfo } = useContext(UserContext);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(userInfo);
  }, [layoutConfig, userInfo]);
  return <div>Product Info</div>;
}
