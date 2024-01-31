"use client";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import fonctions from "@/utils/fonctions";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export default function Products() {
  const [products, setProducts] = useState<Demo.Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const { layoutConfig } = useContext(LayoutContext);

  const [isDeleteDialog, setIsDeleteDialog] = useState(false);

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingNew, setLoadingNew] = useState(false);

  const { userInfo } = useContext(UserContext);

  const router = useRouter();

  let emptyProduct = {
    id_product: "",
    code: "",
    product: "",
    brand: "",
    image: "",
    cree_par: userInfo.fullname,
    date: fonctions.getCurrentDate(),
  };

  const [product, setProduct] = useState<Demo.Product>(emptyProduct);

  const OnInputChange = (e: any, name: any) => {
    const val = (e.target && e.target.value) || "";
    let _product: any = { ...product };
    _product[`${name}`] = val;
    setProduct(_product);
  };

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
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      "country.name": {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      balance: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      status: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
      verified: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue("");
  };

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

  const getCategories = useCallback(async () => {
    const dataToapi = {
      token: userInfo.token,
    };

    try {
      await axios.post("/api/product/list", dataToapi).then((res) => {
        const result = res.data;
        if (result.status === "success") {
          setProducts(result.data);
        } else {
          toastMessage("error", result.data);
        }
      });
    } catch (e) {
      toastMessage(
        "error",
        "Une erreur est survenue lors de la récupération des catégories."
      );
      console.log("Erreur get products: ", e);
    }

    setLoading(false);
  }, [userInfo.token]);

  const confirmDeleteCategory = (rowData: any) => {
    setProduct(rowData);
    setIsDeleteDialog(true);
  };

  const hideDeleteCategoryDialog = () => {
    setIsDeleteDialog(false);
  };

  const deleteCategory = async () => {
    setLoadingDelete(true);

    // ? processus de suppression
    const dataToApi = {
      token: userInfo.token,
      id_category: product.id_category,
    };

    try {
      await axios.post("/api/product/delete", dataToApi).then((res) => {
        const result = res.data;
        if (result.status === "success") {
          toastMessage("success", result.data);
          getCategories();
        } else {
          toastMessage("error", result.data);
        }
      });
    } catch (e) {
      console.log("Erreur delete product: ", e);
      toastMessage(
        "error",
        "Une erreur est survenue lors de la suppression de la catégorie."
      );
    }

    setIsDeleteDialog(false);
    setLoadingDelete(false);
  };

  const actionBodyTemplate = (rowData: any) => {
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
          onClick={() => confirmDeleteCategory(rowData)}
        />
      </>
    );
  };

  const deleteDialogFooter = (
    <>
      <Button
        loading={loadingDelete}
        label="Non"
        icon="pi pi-times"
        severity="secondary"
        className="p-button-text"
        text
        onClick={hideDeleteCategoryDialog}
      />
      <Button
        label="Oui"
        icon="pi pi-check"
        text
        loading={loadingDelete}
        onClick={() => deleteCategory()}
      />
    </>
  );

  const imageBodyTemplate = (rowData: Demo.Product) => {
    return rowData.image ? (
      <>
        <span className="p-column-title">Image</span>
        <img
          src={rowData.image}
          alt={rowData.image}
          className="shadow-2"
          width="100"
        />
      </>
    ) : (
      <>
        <span className="p-column-title">Image</span>
        <img
          src={`/product/placeholder.png`}
          alt={rowData.image}
          className="shadow-2"
          width="100"
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

  const statusBodyTemplate = (rowData: Demo.Product) => {
    return (
      <>
        <span className="p-column-title">Status</span>
        <span
          className={`product-badge status-${rowData.status?.toLowerCase()}`}
        >
          {rowData.status}
        </span>
      </>
    );
  };

  useEffect(() => {
    if (userInfo) {
      getCategories();
    }
    initFilters();
  }, [getCategories, layoutConfig, userInfo]);

  return (
    <div className="col-12">
      <Toast ref={toast} />

      <div className="card">
        <div className="flex flex-column md:flex-row md:align-items-start md:justify-content-between mb-3">
          <div className="text-900 text-xl font-semibold mb-3 md:mb-0">
            Articles
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
            <Tooltip target=".export-target-button" />
            <Button
              icon="pi pi-plus"
              className="mx-3 export-target-button"
              rounded
              data-pr-tooltip="Nouvel article"
              data-pr-position="top"
              onClick={() => router.push("/product/new")}
            ></Button>
          </div>
        </div>

        <DataTable
          loading={loading}
          dataKey="id_transaction"
          paginator
          rows={10}
          className="datatable-responsive"
          value={products}
          emptyMessage="Aucun résultat."
          responsiveLayout="scroll"
          globalFilter={globalFilterValue}
          filters={filters}
        >
          <Column field="cost" header="Image" body={imageBodyTemplate} />
          <Column field="code" header="Code" sortable />
          <Column field="category" header="Catégorie" sortable />
          <Column field="brand" header="Marque" sortable />
          <Column field="quantity" header="Quantité" sortable />
          <Column field="alert_quantity" header="Alerte Stock" sortable />
          <Column field="attribut" header="Attribut" />
          <Column
            field="cost"
            header="Prix d'achat"
            body={(rowData) => priceBodyTemplate(rowData.cost)}
            sortable
          />
          <Column
            field="status"
            header="Statut"
            body={statusBodyTemplate}
            sortable
          />
          <Column field="cree_par" header="Créé par" sortable />
          <Column field="date" header="Date" sortable />
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

      {/* Modal Delete Product */}
      <Dialog
        visible={isDeleteDialog}
        style={{ width: "450px" }}
        header="Confirmation"
        modal
        footer={deleteDialogFooter}
        onHide={hideDeleteCategoryDialog}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {product && (
            <span>
              Êtes-vous sûr(e) de vouloir supprimer cet article:
              <b>{" " + product.category + " "}</b>
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
