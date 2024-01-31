"use client";
import { Demo } from "@/types";
import fonctions from "@/utils/fonctions";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";

export default function TransferList(props: any) {
  const [loadingButton, setLoadingButton] = useState(false);

  const router = useRouter();

  const priceBodyTemplate = (amount: string) => {
    return (
      <>
        <span className="p-column-title">Price</span>
        {fonctions.formatCurrency(amount)}
      </>
    );
  };

  const statusBodyTemplate = (rowData: Demo.Transfert) => {
    var badgeClass = "lowstock";
    if (rowData.statut === "livré") {
      badgeClass = "instock";
    } else if (rowData.statut === "Annulé") {
      badgeClass = "outofstock";
    }
    return (
      <>
        <span className="p-column-title">Status</span>
        <span className={"product-badge status-" + badgeClass}>
          {rowData.statut}
        </span>
      </>
    );
  };

  const actionBodyTemplate = (rowData: Demo.Transfert) => {
    return (
      <>
        <Button
          loading={loadingButton}
          tooltip="Facture / reçu "
          tooltipOptions={{
            position: "left",
          }}
          type="button"
          icon="pi pi-print"
          outlined
          rounded
          onClick={() => {
            setLoadingButton(true);
            router.push(
              "/enterprise/transfer/invoice/" + rowData.numero_transfert
            );
          }}
        ></Button>
      </>
    );
  };

  return (
    <DataTable
      loading={props.loading}
      // ref={dt}
      value={props.transferts}
      dataKey="id_transfert"
      paginator
      rows={10}
      className="datatable-responsive"
      globalFilter={props.globalFilterValue}
      emptyMessage="Aucun résultat."
      responsiveLayout="scroll"
      filters={props.filters}
    >
      <Column
        body={actionBodyTemplate}
        style={{ textAlign: "center" }}
      ></Column>
      <Column
        field="numero_transfert"
        header="ID"
        headerStyle={{
          minWidth: "8rem",
          maxWidth: "10rem",
          width: "8rem",
        }}
        sortable
      />
      <Column field="via" header="Via" sortable />
      <Column field="expediteur" header="Expediteur" sortable />
      <Column field="destinataire" header="Destinataire" sortable />
      <Column
        field="montant"
        header="Montant"
        body={(data) => priceBodyTemplate(data.montant)}
        sortable
      />

      <Column
        field="frais"
        header="Frais"
        body={(data) => priceBodyTemplate(data.frais)}
        sortable
      />

      <Column field="compte" header="Origine" sortable />

      <Column field="cree_par" header="Créé par" sortable />

      <Column
        field="date"
        header="Date"
        headerStyle={{
          minWidth: "8rem",
          maxWidth: "10rem",
          width: "8rem",
        }}
        sortable
      />
      <Column field="numero_confirmation" header="#Confirmation" sortable />

      <Column
        field="inventoryStatus"
        header="Status"
        body={statusBodyTemplate}
        sortable
        headerStyle={{ minWidth: "10rem" }}
      ></Column>
    </DataTable>
  );
}
