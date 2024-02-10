"use client";

import Invoice from "@/components/order/invoice";
import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import fonctions from "@/utils/fonctions";
import axios from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
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

  const getPayments = useCallback(
    async (id_order: any) => {
      setLoadingPayments(true);
      try {
        await axios
          .post("/api/payment/get", {
            token: userInfo.token,
            id_order: id_order,
          })
          .then((res) => {
            const result = res.data;
            if (result.status === "success") {
              setLoadingPayments(false);
              setPayments(result.data.payments);
              result.data.avance > 0 && setAvance(result.data.avance);

              if (order.total) {
                const balance = order.total - result.data.avance;
                setBalance(balance);
              }
            } else {
              toastMessage("error", result.data);
            }
          });
      } catch (e) {
        setLoadingPayments(false);
        console.log(e);
        toastMessage("error", "Erreur lors de la recuperation des paiements.");
      }
    },
    [order.total, userInfo.token]
  );

  const getOrder = useCallback(async () => {
    setLoading(true);
    try {
      await axios
        .post("/api/order/get", {
          token: userInfo.token,
          code: params.code,
        })
        .then((res) => {
          const result = res.data;
          if (result.status === "success") {
            setLoading(false);
            setOrder(result.data);
            getPayments(result.data.id_order);
          } else {
            toastMessage("error", result.data);
          }
        });
    } catch (e) {
      setLoading(false);
      console.log(e);
      toastMessage(
        "error",
        "Erreur lors de la recuperation des infos de la commande."
      );
    }
  }, [getPayments, params.code, userInfo.token]);

  const [loadingPayments, setLoadingPayments] = useState<boolean>(false);
  const [payments, setPayments] = useState<Demo.Payment[]>([]);

  useEffect(() => {
    if (userInfo) {
      getOrder();
    }
  }, [getOrder, userInfo]);

  const actionList = ["Traiement en cours", "Pret", "Delivré"];

  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  let emptyPayment: Demo.Payment = {
    id_order: (order.id_order as unknown) as number,
    amount: 0,
    date: fonctions.getCurrentDate().toString(),
  };
  const [payment, setPayment] = useState<Demo.Payment>(emptyPayment);

  const [isPaymentVisible, setIsPaymentVisible] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const onCancelPayment = () => {
    setPayment(emptyPayment);
    setIsPaymentVisible(false);
  };

  const onSavePayment = async () => {
    setSubmitted(true);
    const dataApi = {
      token: userInfo.token,
      payment: payment,
    };

    payment.id_order = (order.id_order as unknown) as number;

    if (payment.amount > 0) {
      if (payment.amount <= balance) {
        try {
          await axios.post("/api/payment/add", dataApi).then((res) => {
            const result = res.data;
            if (result.status === "success") {
              toastMessage("success", result.data);
              onCancelPayment();
              getPayments(order.id_order);
              getOrder();
            } else {
              toastMessage("error", result.data);
            }
          });
        } catch (e) {
          console.log(e);
          toastMessage("error", "Erreur lors de l'enregistrement du paiement.");
        }
      } else {
        toastMessage("error", "Montant supérieur au solde de la commande");
      }
    }
  };

  const footerPayment = (
    <>
      <Button
        label="Enregistrer"
        icon="pi pi-check"
        onClick={onSavePayment}
        text
      />
    </>
  );

  const [avance, setAvance] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);

  return (
    <>
      <Toast ref={toast} />

      <div className="col-12">
        <div className="grid">
          <div className="col-12 md:col-8">
            {order.code !== "" ? (
              <Invoice
                order={order as Demo.Order}
                type="RECU"
                avance={avance}
                balance={balance}
              />
            ) : (
              <div className="card">Commande introuvable</div>
            )}
          </div>

          <div className="col-12 md:col-4">
            <div className="card flex justify-content-between">
              <Button
                label="Ajouter Paiement"
                outlined
                onClick={() => setIsPaymentVisible(true)}
              />
              <Dropdown
                value={selectedAction}
                options={actionList}
                placeholder="Action"
                onChange={(e) => setSelectedAction(e.value)}
              />
            </div>
            <div className="card mt-5">
              <h5>Historique de paiement</h5>
              <DataTable
                loading={loadingPayments}
                value={payments}
                className="datatable-responsive"
                dataKey="id_payment"
                emptyMessage="Aucun paiement."
              >
                <Column field="date" header="Date" sortable />
                <Column field="amount" header="Amount" sortable />
                <Column field="created_by" header="Par" sortable />
              </DataTable>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        header="Ajouter paiement"
        visible={isPaymentVisible}
        onHide={onCancelPayment}
        footer={footerPayment}
        position="top"
        style={{ width: "450px" }}
      >
        <div className="grid formgrid p-fluid mt-2">
          <div className="field mb-4 col-12">
            <label htmlFor="amount">Montant</label>
            <InputNumber
              id="amount"
              value={payment.amount}
              placeholder="Entrer le montant"
              onValueChange={(e) =>
                e.value && setPayment({ ...payment, amount: e.value as number })
              }
              className={classNames({
                "p-invalid": submitted && !payment.amount,
              })}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
