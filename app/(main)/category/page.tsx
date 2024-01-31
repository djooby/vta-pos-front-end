"use client";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import fonctions from "@/utils/fonctions";
import axios from "axios";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { classNames } from "primereact/utils";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export default function Canceled() {
  const [categories, setCategories] = useState<Demo.Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const { layoutConfig } = useContext(LayoutContext);
  const dt = useRef<DataTable<any>>(null);

  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [isNewDialog, setIsNewDialog] = useState(false);

  const [submittedNewCategory, setSubmittedNewCategory] = useState(false);

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingNew, setLoadingNew] = useState(false);

  const { userInfo } = useContext(UserContext);

  let emptyCategory = {
    id_category: "",
    category_name: "",
    cree_par: userInfo.fullname,
    date: fonctions.getCurrentDate(),
  };

  const [category, setCategory] = useState<Demo.Category>(emptyCategory);

  const add_new = () => {
    setCategory(emptyCategory);
    setIsNewDialog(true);
  };

  const OnInputChange = (e: any, name: any) => {
    const val = (e.target && e.target.value) || "";
    let _category: any = { ...category };
    _category[`${name}`] = val;
    setCategory(_category);
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
      await axios.post("/api/category/list", dataToapi).then((res) => {
        const result = res.data;
        if (result.status === "success") {
          setCategories(result.data);
        } else {
          toastMessage("error", result.data);
        }
      });
    } catch (e) {
      toastMessage(
        "error",
        "Une erreur est survenue lors de la récupération des catégories."
      );
      console.log("Erreur get categories: ", e);
    }

    setLoading(false);
  }, [userInfo.token]);

  const confirmDeleteCategory = (rowData: any) => {
    setCategory(rowData);
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
      id_category: category.id_category,
    };

    try {
      await axios.post("/api/category/delete", dataToApi).then((res) => {
        const result = res.data;
        if (result.status === "success") {
          toastMessage("success", result.data);
          getCategories();
        } else {
          toastMessage("error", result.data);
        }
      });
    } catch (e) {
      console.log("Erreur delete category: ", e);
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

  const hideNewDialog = () => {
    setIsDeleteDialog(false);
  };

  const saveCategory = async () => {
    setSubmittedNewCategory(true);
    setLoadingNew(true);
    if (category.category_name != "") {
      const dataToApi = {
        token: userInfo.token,
        category: category,
      };
      setLoadingNew(true);

      try {
        await axios.post("/api/category/add", dataToApi).then((res) => {
          const result = res.data;
          if (result.status == "success") {
            toastMessage("success", result.data);
            // show success message
            getCategories();
            setCategory(emptyCategory);
          } else {
            // show error message
            toastMessage("error", result.data);
          }
          setIsNewDialog(false);
          setLoadingNew(false);
        });
      } catch (e) {
        toastMessage(
          "error",
          "Une erreur est survenue lors de l'enregistrement de la catégorie."
        );
        console.log(e);
      }

      setSubmittedNewCategory(false);
    }
    setLoadingNew(false);
  };

  const newDialogFooter = (
    <>
      <Button
        loading={loadingNew}
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
        loading={loadingNew}
        onClick={() => saveCategory()}
      />
    </>
  );

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
            Catégories
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
              data-pr-tooltip="Nouvelle catégorie"
              data-pr-position="top"
              onClick={add_new}
            ></Button>
          </div>
        </div>

        <DataTable
          loading={loading}
          dataKey="id_transaction"
          paginator
          rows={10}
          className="datatable-responsive"
          value={categories}
          emptyMessage="Aucun résultat."
          responsiveLayout="scroll"
          globalFilter={globalFilterValue}
          filters={filters}
        >
          <Column field="cree_par" header="Créé par" sortable />

          <Column field="category_name" header="Nom" sortable />
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

      {/* Modal Delete Category */}
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
          {category && (
            <span>
              Êtes-vous sûr(e) de vouloir supprimer cette catégorie:
              <b>{" " + category.category_name + " "}</b>
            </span>
          )}
        </div>
      </Dialog>

      {/* Modal New Category */}
      <Dialog
        visible={isNewDialog}
        header="Ajouter Categorie"
        modal
        style={{ width: "450px" }}
        footer={newDialogFooter}
        onHide={hideNewDialog}
      >
        <div className="grid formgrid p-fluid mt-2">
          <div className="field mb-4 col-12">
            <label htmlFor="category_name" className="font-medium text-900">
              Nom catégorie
            </label>
            <InputText
              placeholder="Le nom de la catégorie"
              id="category_name"
              type="text"
              className={classNames({
                "p-invalid": submittedNewCategory && !category.category_name,
              })}
              onChange={(e) => OnInputChange(e, "category_name")}
            />
            {submittedNewCategory && !category.category_name && (
              <small className="p-invalid">
                Le nom de la catégorie est obligatoire.
              </small>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
