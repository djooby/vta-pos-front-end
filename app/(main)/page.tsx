"use client";
import { UserContext } from "@/layout/context/usercontext";
import axios from "axios";
import { Toast } from "primereact/toast";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

export default function Home() {
  const { userInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  const toast = useRef<Toast | null>(null);
  const toastMessage = (status: any, message: string) => {
    var summary = status == "error" ? "Erreur!" : "Succès!";

    toast.current?.show({
      severity: status,
      summary: summary,
      detail: message,
      life: 3000,
    });
  };

  const [transactions, setTransactions] = useState([]);

  const getTransactions = useCallback(async () => {
    try {
      await axios
        .post("/api/Home/transaction", {
          token: userInfo.token,
        })
        .then((res) => {
          const result = res.data;
          if (result.status === "success") {
            setTransactions(result.result);
          } else {
            toastMessage("error", result.result);
          }
        });
    } catch (e) {
      console.log("Erreur Transactions: ", e);
      toastMessage(
        "error",
        "Une erreur est survenue lors de la recuperation des transactions"
      );
    }
    setLoading(false);
  }, [userInfo.token]);

  useEffect(() => {
    //   getTransactions();
    setLoading(false);
  }, []);

  return (
    <div>Tableau de bord</div>
    // <div className="col-12 ">
    //   <Toast ref={toast} />
    //   <div className="card">
    //     <div className="card-title mb-3">
    //       <span className="text-900 text-xl font-semibold">
    //         Dernieres Transactions
    //       </span>
    //     </div>
    //     <Divider />
    //     <div className="card-body">
    //       <TransactionList
    //         loading={loading}
    //         rows={5}
    //         transactions={transactions}
    //       />
    //     </div>
    //   </div>
    // </div>
  );
}
