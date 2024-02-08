"use client";

import { Demo } from "@/types";
import { Toast } from "primereact/toast";
import React, { useRef } from "react";

interface OrderProductsProps {
  orderProducts: Demo.OrderProduct[];
}

const OrderProducts: React.FC<OrderProductsProps> = ({ orderProducts }) => {
  const toast = useRef<Toast | null>(null);

  const toastMessage = (status: any, message: string) => {
    const summary = status == "error" ? "Erreur!" : "Succès!";

    toast.current?.show({
      severity: status,
      summary: summary,
      detail: message,
      life: 3000,
    });
  };

  return (
    <div>
      <div className="card">
        <h5>Article selectionné</h5>
      </div>
    </div>
  );
};

export default OrderProducts;
