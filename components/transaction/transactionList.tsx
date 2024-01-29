import fonctions from "@/utils/fonctions";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export default function TransactionList(props: any) {
  const priceBodyTemplate = (amount: string) => {
    return (
      <>
        <span className="p-column-title">Price</span>
        {fonctions.formatCurrency(amount)}
      </>
    );
  };

  return (
    <DataTable
      loading={props.loading}
      dataKey="id_transaction"
      paginator
      rows={props.rows}
      className="datatable-responsive"
      value={props.transactions}
      emptyMessage="Aucun résultat."
      responsiveLayout="scroll"
      globalFilter={props.globalFilterValue}
      filters={props.filters}
    >
      <Column field="cree_par" header="Créé par" sortable />
      <Column
        field="montant"
        header="Montant"
        body={(data) => priceBodyTemplate(data.montant)}
        sortable
      />
      <Column field="compte" header="Compte" sortable />
      <Column field="type" header="Type" sortable />
      <Column field="description" header="Description" />
      <Column field="date" header="Date" sortable />
    </DataTable>
  );
}
