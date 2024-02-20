"use client";

import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import fonctions from "@/utils/fonctions";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import React, { useContext, useRef, useState } from "react";
import DialogDiscount from "../pos/dialogDiscount";
import DialogInvoice from "../pos/dialogProforma";

interface OrderProps {
  orderProducts: Demo.OrderProduct[];
  order: Demo.Order | null;
  client: Demo.Client;
  remove: (orderProduct: Demo.OrderProduct) => void;
  onDiscount: (discount: number) => void;
}

const Order: React.FC<OrderProps> = ({
  orderProducts,
  order,
  client,
  remove,
  onDiscount,
}) => {
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

  const headerTemplate = (options: any) => {
    const className = `${options.className} justify-content-space-between`;

    return (
      <div className={className}>
        <div className="flex align-items-center gap-2">
          <span className="font-bold">Panier</span>
        </div>
        <Button
          label="Discount"
          icon="pi pi-percentage"
          text
          severity="info"
          onClick={() => setVisibleDiscountDialog(true)}
        />
      </div>
    );
  };

  const footerTemplate = (options: any) => {
    const className = `${options.className} flex align-items-center justify-content-between`;

    return (
      <div className={className}>
        <ul className="list-none py-0 pr-0 pl-0 md:pl-5 mt-6 mx-0 mb-0 flex-auto">
          <li className="flex justify-content-between mb-4">
            <span className="text-xl text-900 font-semibold">Subtotal</span>
            <span className="text-xl text-900">
              {fonctions.formatCurrency(order?.subTotal)}
            </span>
          </li>
          <li className="flex justify-content-between mb-4">
            <span className="text-xl text-900 font-semibold">Discount</span>
            <span className="text-xl text-900">
              {fonctions.formatCurrency(order?.discount)}
            </span>
          </li>

          <li className="flex justify-content-between border-top-1 surface-border mb-4 pt-4">
            <span className="text-xl text-900 font-bold text-3xl">Total</span>
            <span className="text-xl text-900 font-bold text-3xl">
              {fonctions.formatCurrency(order?.total)}
            </span>
          </li>
          <li className="flex justify-content-end">
            <Button
              className="mr-3"
              label="Proforma"
              icon="pi pi-file-pdf"
              outlined
              disabled={orderProducts.length === 0 || !client.id_client}
              onClick={() => {
                handleInvoice("PROFORMA");
                console.log(order);
              }}
            ></Button>

            <Button
              loading={loading}
              label="Enregistrer"
              icon="pi pi-save"
              disabled={orderProducts.length === 0 || !client.id_client}
              onClick={() => saveOrder()}
            ></Button>
          </li>
        </ul>
      </div>
    );
  };

  const imageBodyTemplate = (rowData: Demo.Product) => {
    return rowData.image ? (
      <>
        <span className="p-column-title">Image</span>
        <img
          src={rowData.image}
          alt={rowData.image}
          className="shadow-2"
          width="50"
        />
      </>
    ) : (
      <>
        <span className="p-column-title">Image</span>
        <img
          src={`/product/placeholder.png`}
          alt={rowData.image}
          className="shadow-2"
          width="50"
        />
      </>
    );
  };

  const priceBodyTemplate = (price: any) => {
    return (
      <>
        <span className="p-column-title">Prix</span>
        {fonctions.formatCurrency(price)}
      </>
    );
  };

  const actionOrderBodyTemplate = (rowData: Demo.OrderProduct) => {
    return (
      <>
        <Button
          icon="pi pi-trash"
          severity="danger"
          rounded
          className="mb-2"
          type="button"
          tooltip="Supprimer"
          tooltipOptions={{ position: "top" }}
          onClick={() => remove(rowData)}
        />
      </>
    );
  };

  const [visibleDiscountDialog, setVisibleDiscountDialog] = useState<boolean>(
    false
  );

  const handleConfirmDiscount = (discount: number) => {
    setVisibleDiscountDialog(false);
    if (discount > 0) {
      if ((order?.total && discount > order?.total) || !order?.total) {
        toastMessage(
          "error",
          "Discount ne peut pas etre ajouté dans un panier vide!"
        );
      } else {
        onDiscount(discount);
        toastMessage("success", "Discount ajouté avec succès!");
      }
    }
  };

  const handleCancelDiscount = () => {
    setVisibleDiscountDialog(false);
  };

  //! =================INVOICE =====================

  const [visibleInvoice, setVisibleInvoice] = useState(false);
  const [typeInvoice, setTypeInvoice] = useState<string>("");

  const handleInvoice = (type: string) => {
    setTypeInvoice(type);
    setVisibleInvoice(true);
  };

  const handleCancelInvoice = () => {
    setVisibleInvoice(false);
  };
  // !================SAVE ORDER=====================

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const saveOrder = async () => {
    setLoading(true);
    const dataApi = {
      order: order,
      token: userInfo.token,
    };

    console.log(dataApi);

    try {
      await axios.post("/api/order/add", dataApi).then((res) => {
        const result = res.data;
        if (result.status === "success") {
          toastMessage("success", "Commande enregistrée avec succès!");
          router.push("/order/overview/" + order?.code);
        } else {
          setLoading(false);
          toastMessage("error", result.data);
        }
      });
    } catch (e) {
      setLoading(false);

      console.log(e);
      toastMessage("error", "Erreur lors de l'enregistrement de la commande.");
    }
  };

  return (
    <>
      <Toast ref={toast} />

      <Panel
        headerTemplate={headerTemplate}
        footerTemplate={footerTemplate}
        toggleable
      >
        <DataTable
          dataKey="id_order_product"
          rows={10}
          className="datatable-responsive"
          value={orderProducts}
          emptyMessage="Aucun article."
          responsiveLayout="scroll"
        >
          <Column field="cost" header="Image" body={imageBodyTemplate} />
          <Column field="category" header="Category" sortable />
          <Column field="code" header="Code" sortable />
          <Column field="quantity" header="Qte" sortable />
          <Column
            field="price"
            header="Prix Unitaire"
            sortable
            body={(rowData) => priceBodyTemplate(rowData.price)}
          />
          <Column
            field="total"
            header="Total"
            body={(rowData) => priceBodyTemplate(rowData.total)}
            sortable
          />

          <Column
            header="Action"
            headerStyle={{
              minWidth: "7rem",
              maxWidth: "12rem",
              width: "10rem",
            }}
            body={actionOrderBodyTemplate}
          />
        </DataTable>
      </Panel>

      <DialogDiscount
        visible={visibleDiscountDialog}
        onCancel={handleCancelDiscount}
        onConfirm={handleConfirmDiscount}
        value={order?.discount as number}
        title="Ajouter discount"
      />

      <DialogInvoice
        order={order as Demo.Order}
        visible={visibleInvoice}
        type={typeInvoice}
        onCancel={handleCancelInvoice}
      />
    </>
  );
};

export default Order;
