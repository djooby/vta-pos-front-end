import fonctions from "@/utils/fonctions";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function FraisList(props: any) {
  const priceBodyTemplate = (amount: string) => {
    return (
      <>
        <span className="p-column-title">Price</span>
        {fonctions.formatCurrency(amount)}
      </>
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <>
        <Button
          tooltip="Supprimer"
          tooltipOptions={{
            position: "top",
          }}
          type="button"
          icon="pi pi-times"
          outlined
          rounded
        ></Button>
      </>
    );
  };
  return (
    <DataTable
      loading={props.loading}
      value={props.frais}
      dataKey="id_frais"
      paginator
      rows={10}
      className="datatable-responsive"
      emptyMessage="Aucun résultat."
      responsiveLayout="scroll"
    >

      <Column
        field="montant"
        header="De"
        body={(data) => priceBodyTemplate(data.montant_minimum)}
        sortable
      />

      <Column
        field="montant"
        header="A"
        body={(data) => priceBodyTemplate(data.montant_maximum)}
        sortable
      />

      <Column
        field="frais"
        header="Frais"
        body={(data) => priceBodyTemplate(data.frais)}
        sortable
      />
      <Column field="compte" header="Origine" sortable />

      {/* <Column field="cree_par" header="Créé par" sortable /> */}
      <Column
        body={actionBodyTemplate}
        style={{ textAlign: "center" }}
      ></Column>
    </DataTable>
  );
}
