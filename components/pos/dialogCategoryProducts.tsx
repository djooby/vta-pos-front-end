"use client";
import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import axios from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

interface DialogCategoryProductsProps {
  visible: boolean;
  title: string;
  onConfirm: (product: Demo.Product) => void;
  onCancel: () => void;
  data: Demo.Category | null;
}

const DialogCategoryProducts: React.FC<DialogCategoryProductsProps> = (
  props
) => {
  const [products, setProducts] = useState<Demo.Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const { userInfo } = useContext(UserContext);

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

  const getCategoryProducts = useCallback(
    async (id_category: string) => {
      setLoadingProducts(true);
      const dataToapi = {
        token: userInfo.token,
        id_category: id_category,
      };

      try {
        await axios.post("/api/category/products", dataToapi).then((res) => {
          const result = res.data;
          if (result.status === "success") {
            setProducts(result.data.products);
          } else {
            toastMessage("error", result.data);
          }
        });
      } catch (e) {
        toastMessage(
          "error",
          "Une erreur est survenue lors de la récupération des articles."
        );
        console.log("Erreur get categories: ", e);
      }

      setLoadingProducts(false);
    },
    [userInfo.token]
  );

  useEffect(() => {
    if (props.data) {
      getCategoryProducts(props.data.id_category);
    }
  }, [getCategoryProducts, props.data]);

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

  const statusBodyTemplate = (rowData: Demo.Product) => {
    var qte = rowData.quantity && rowData.quantity?.toString();
    var alerte = rowData.alert_quantity && rowData.alert_quantity?.toString();
    var status = "INSTOCK";

    if (qte !== 0 && qte != undefined && alerte != 0 && alerte != undefined) {
      if (parseInt(qte) > 0 && parseInt(qte) <= parseInt(alerte)) {
        status = "LOWSTOCK";
      } else if (parseInt(qte) === 0) {
        status = "OUTOFSTOCK";
      }
    }

    return (
      <>
        <span className="p-column-title">Status</span>
        <span className={`product-badge status-${status?.toLowerCase()}`}>
          {status}
        </span>
      </>
    );
  };

  const actionBodyTemplate = (rowData: Demo.Product) => {
    return (
      <>
        <Button
          icon="pi pi-check"
          severity="success"
          rounded
          className="mb-2"
          type="button"
          tooltip="Selectionner"
          tooltipOptions={{ position: "top" }}
          onClick={() => props.onConfirm(rowData)}
        />
      </>
    );
  };

  return (
    <Dialog
      position="top"
      visible={props.visible}
      header={props.title + ": " + props.data?.category_name}
      onHide={props.onCancel}
      className="max-h-screen"
      style={{ width: "100vw" }}
    >
      <DataTable
        loading={loadingProducts}
        dataKey="id_product"
        paginator
        rows={10}
        className="datatable-responsive"
        value={products}
        emptyMessage="Aucun résultat."
        responsiveLayout="scroll"
      >
        <Column field="cost" header="Image" body={imageBodyTemplate} />

        <Column field="code" header="Code" sortable />
        <Column field="size" header="Taille" sortable />
        <Column field="color" header="Couleur" sortable />
        <Column field="type" header="Type" sortable />
        <Column
          field="status"
          header="Statut"
          body={statusBodyTemplate}
          sortable
        />
        <Column
          header="Action"
          headerStyle={{
            minWidth: "7rem",
            maxWidth: "12rem",
            width: "10rem",
          }}
          body={actionBodyTemplate}
        />
      </DataTable>
    </Dialog>
  );
};

export default DialogCategoryProducts;
