"use client";

import ClientPos from "@/components/client/client";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import fonctions from "@/utils/fonctions";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

export default function Order() {
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

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Demo.Order[]>([]);

  const getOrders = useCallback(async () => {
    setLoading(true);
    try {
      await axios
        .post("/api/order/list", { token: userInfo.token })
        .then((res) => {
          const result = res.data;
          if (result.status === "success") {
            setLoading(false);
            setOrders(result.data);
          } else {
            toastMessage("error", result.data);
          }
        });
    } catch (e) {
      setLoading(false);
      console.log(e);
      toastMessage("error", "Erreur lors de la recuperation des commandes.");
    }
  }, [userInfo.token]);

  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const { layoutConfig } = useContext(LayoutContext);

  const onGlobalFilterChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const value = e.target.value;
    let _filters = { ...filters };
    (_filters["global"] as any).value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };

  const router = useRouter();

  useEffect(() => {
    getOrders();
    initFilters();
  }, [getOrders]);

  const actionBodyTemplate = (rowData: Demo.Order) => {
    return (
      <>
        <Button
          icon="pi pi-list"
          rounded
          className="mb-2 mr-2"
          type="button"
          tooltip="Voir detail"
          tooltipOptions={{ position: "top" }}
          onClick={() => router.push("/order/overview/" + rowData.code)}
        />

        <Button
          icon="pi pi-trash"
          severity="danger"
          rounded
          className="mb-2"
          type="button"
          tooltip="Supprimer"
          tooltipOptions={{ position: "top" }}
          // onClick={() => confirmDeleteCategory(rowData)}
        />
      </>
    );
  };

  const clientTemplate = (rowData: Demo.Order) => {
    return (
      <>
        <ClientPos client={rowData?.client as Demo.Client} />
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

  return (
    <>
      <div className="col-12">
        <Toast ref={toast} />

        <div className="card">
          <div className="flex flex-column md:flex-row md:align-items-start md:justify-content-between mb-3">
            <div className="text-900 text-xl font-semibold mb-3 md:mb-0">
              Commande
            </div>
            <div className="inline-flex align-items-center">
              <span className="hiddens p-input-icon-left flex-auto">
                <i className="pi pi-search"></i>
                <InputText
                  type={"text"}
                  value={globalFilterValue}
                  onChange={onGlobalFilterChange}
                  placeholder="Rechercher"
                  style={{ borderRadius: "2rem" }}
                  className="w-full"
                />
              </span>
            </div>
          </div>
          <DataTable
            loading={loading}
            dataKey="id_order"
            paginator
            rows={10}
            className="datatable-responsive"
            value={orders}
            emptyMessage="Aucun résultat."
            responsiveLayout="scroll"
            globalFilter={globalFilterValue}
            filters={filters}
          >
            <Column field="code" header="Code" sortable />
            <Column field="" header="Client" sortable body={clientTemplate} />
            <Column field="date" header="Date" sortable />
            <Column field="deliveryDate" header="Livraison" sortable />
            <Column
              field="total"
              header="Total"
              sortable
              body={(rowData) => priceBodyTemplate(rowData.total)}
            />

            <Column
              field="subTotal"
              header="Sous-Total"
              sortable
              body={(rowData) => priceBodyTemplate(rowData.subTotal)}
            />
            <Column
              field="discount"
              header="Discount"
              sortable
              body={(rowData) => priceBodyTemplate(rowData.discount)}
            />
            <Column field="created_by" header="Créé par" sortable />
            <Column
              header="Action"
              headerStyle={{
                minWidth: "10rem",
                maxWidth: "16rem",
                width: "10rem",
              }}
              body={actionBodyTemplate}
            />
          </DataTable>
        </div>
      </div>
    </>
  );
}
