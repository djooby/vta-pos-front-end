"use client";

import Invoice from "@/components/orders/invoice";
import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import axios from "axios";
import { Toast } from "primereact/toast";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

export default function OrderDetail({
  params,
}: {
  params: {
    code: string;
  };
}) {
  const { userInfo } = useContext(UserContext);
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

  let emptyOrder: Demo.Order = {
    subTotal: 0,
    discount: 0,
    total: 0,
    date: "",
    code: "",
  };

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Demo.Order>(emptyOrder);

  const getOrder = useCallback(async () => {
    setLoading(true);
    try {
      await axios
        .post("/api/order/get", { token: userInfo.token, code: params.code })
        .then((res) => {
          const result = res.data;
          if (result.status === "success") {
            setLoading(false);
            setOrder(result.data);
          } else {
            toastMessage("error", result.data);
          }
        });
    } catch (e) {
      setLoading(false);
      console.log(e);
      toastMessage("error", "Erreur lors de la recuperation des commandes.");
    }
  }, [params.code, userInfo.token]);

  useEffect(() => {
    getOrder();
  }, [getOrder]);
  return (
    <div className="col-12">
      <Toast ref={toast} />

      <div className="grid">
        <div className="col-12 md:col-8">
          {order.code !== "" ? (
            <Invoice order={order as Demo.Order} type="RECU" />
          ) : (
            <div className="card">Commande introuvable</div>
          )}
        </div>
      </div>
    </div>
  );
}
