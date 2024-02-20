"use client";
import DialogNewClient from "@/components/client/dialogNewClient";
import DialogNewSubscription from "@/components/subscription/dialogNewSubscription";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import axios from "axios";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

export default function Internet() {
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
  const [isVisibleDialogClient, setIsVisibleDialogClient] = useState(false);
  const handleCancelNewClientDialog = () => {
    setIsVisibleDialogClient(false);
  };
  const handeleConfirmNewClient = (newClient: Demo.Client) => {
    setClient(newClient);
  };

  const [isVisibleDialogSubs, setIsVisibleDialogSubs] = useState(false);
  const handleCancelDialogNewSubs = () => {
    setIsVisibleDialogSubs(false);
  };

  const handeleConfirmNewSubs = (newSubs: Demo.Subscription) => {
    setIsVisibleDialogSubs(false);
    getSubscriptions();
  };

  const { userInfo } = useContext(UserContext);

  const [clients, setClients] = useState<Demo.Client[]>([]);
  const [subscriptions, setSubscriptions] = useState<Demo.Subscription[]>([]);
  const [client, setClient] = useState<Demo.Client>();
  const [loading, setLoading] = useState(false);
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

  const getSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      await axios
        .post("/api/subscription/list", { token: userInfo.token })
        .then((res) => {
          const result = res.data;
          if (result.status === "success") {
            setSubscriptions(result.data);
          } else {
            toastMessage("error", result.data);
          }
        });
    } catch (e) {
      console.log(e);
      toastMessage(
        "error",
        "Une erreur est survenue lors de la recuperation des abonnements"
      );
    }
    setLoading(false);
  }, [userInfo.token]);

  useEffect(() => {
    getSubscriptions();
    initFilters();
  }, [getSubscriptions]);

  return (
    <div className="grid">
      <div className="col-12 card">
        <div className="flex justify-content-between">
          <Button
            label="Ajouter client"
            icon="pi pi-user-plus"
            className="mr-4"
            outlined
            onClick={() => setIsVisibleDialogClient(true)}
          />
          <Button
            label="Ajouter abonnement"
            icon="pi pi-plus"
            outlined
            onClick={() => setIsVisibleDialogSubs(true)}
          />
        </div>
      </div>

      <div className="col-12 card">
        <div className="flex flex-column md:flex-row md:align-items-start md:justify-content-between mb-3">
          <div className="text-900 text-xl font-semibold mb-3 md:mb-0">
            Abonnements
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
          dataKey="id_subscription"
          paginator
          rows={10}
          className="datatable-responsive"
          value={subscriptions}
          emptyMessage="Aucun abonnement trouvé."
          responsiveLayout="scroll"
          globalFilter={globalFilterValue}
          filters={filters}
          editMode="row"
        >
          <Column field="client" header="Client" />
          <Column field="client" header="Date Debut" />
          <Column field="client" header="Date Fin" />
          <Column field="client" header="Date Prix" />
          <Column field="client" header="Statut" />
          <Column field="client" header="Cree par" />
        </DataTable>
      </div>
      <DialogNewClient
        visible={isVisibleDialogClient}
        onCancel={handleCancelNewClientDialog}
        title="Ajouter client"
        onConfirm={handeleConfirmNewClient}
      />

      <DialogNewSubscription
        visible={isVisibleDialogSubs}
        onCancel={handleCancelDialogNewSubs}
        title="Ajouter abonnement"
        onConfirm={handeleConfirmNewSubs}
      />
    </div>
  );
}
