"use client";

import { LayoutContext } from "@/layout/context/layoutcontext";
import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import fonctions from "@/utils/fonctions";
import axios from "axios";
import { Tooltip } from "primereact/tooltip";

import { getColors } from "@/utils/colors";
import { getSizes } from "@/utils/size";
import { getTypes } from "@/utils/type";
import { useRouter } from "next/navigation";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface SubCategoryListProps {
  id_category?: number;
}

const SubCategoryList: React.FC<SubCategoryListProps> = ({ id_category }) => {
  let emptyCategory: Demo.Category = {
    id_category: "0",
    category_name: "",
    image: "",
    quantity: 0,
    created_by: "",
    date: "",
  };

  const [category, setCategory] = useState<Demo.Category>(emptyCategory);
  const [subCategories, setSubCategories] = useState<Demo.SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const { layoutConfig } = useContext(LayoutContext);

  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const groupedItemTemplate = (option: Demo.GroupType) => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [categoriesName, setCategoriesName] = useState<string[]>();

  const { userInfo } = useContext(UserContext);

  const router = useRouter();

  let emptySubCategory: Demo.SubCategory = {
    code: fonctions.generateRandomString(10),
    category: "",
    color: "",
    size: "",
    type: "",
    cost: 0,
    quantity: 0,
    sale_price: 0,
    alert_quantity: 0,
    created_by: userInfo.fullname,
    date: fonctions.getCurrentDate(),
  };

  const [SubCategory, setSubCategory] = useState<Demo.SubCategory>(
    emptySubCategory
  );

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
      status: { value: null, matchMode: FilterMatchMode.EQUALS },
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

  const getSubCategoryByIdCategory = useCallback(async () => {
    const dataToapi = {
      token: userInfo.token,
      id_category: id_category,
    };

    try {
      await axios.post("/api/category/sub_category", dataToapi).then((res) => {
        const result = res.data;
        if (result.status === "success") {
          setCategory(result.data.category_info);
          setSubCategories(result.data.sub_category);
        } else {
          toastMessage("error", result.data);
        }
      });
    } catch (e) {
      toastMessage(
        "error",
        "Une erreur est survenue lors de la récupération des sous-categories."
      );
      console.log("Erreur get categories: ", e);
    }

    setLoading(false);
  }, [id_category, userInfo.token]);

  const getAllSubCategories = useCallback(async () => {
    const dataToapi = {
      token: userInfo.token,
    };

    try {
      await axios.post("/api/sub_category/list", dataToapi).then((res) => {
        const result = res.data;
        if (result.status === "success") {
          setSubCategories(result.data);
        } else {
          toastMessage("error", result.data);
        }
      });
    } catch (e) {
      toastMessage(
        "error",
        "Une erreur est survenue lors de la récupération des catégories."
      );
      console.log("Erreur get subCategories: ", e);
    }

    setLoading(false);
  }, [userInfo.token]);

  const getSubCategories = useCallback(async () => {
    if (id_category) {
      getSubCategoryByIdCategory();
    } else {
      getAllSubCategories();
    }
  }, [getAllSubCategories, getSubCategoryByIdCategory, id_category]);

  const confirmDelete = (rowData: any) => {
    setSubCategory(rowData);
    setIsDeleteDialog(true);
  };

  const hideDeleteDialog = () => {
    setIsDeleteDialog(false);
  };

  const deleteSubCategory = async () => {
    setLoadingDelete(true);

    // ? processus de suppression
    const dataToApi = {
      token: userInfo.token,
      id_sub_category: SubCategory.id_sub_category,
    };

    try {
      await axios.post("/api/sub_category/delete", dataToApi).then((res) => {
        const result = res.data;
        if (result.status === "success") {
          toastMessage("success", result.data);
          getSubCategories();
        } else {
          toastMessage("error", result.data);
        }
      });
    } catch (e) {
      console.log("Erreur delete SubCategory: ", e);
      toastMessage(
        "error",
        "Une erreur est survenue lors de la suppression de la sous-categorie."
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
          outlined
          className="mb-2"
          type="button"
          tooltip="Supprimer"
          tooltipOptions={{ position: "top" }}
          onClick={() => confirmDelete(rowData)}
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
        onClick={hideDeleteDialog}
      />
      <Button
        label="Oui"
        icon="pi pi-check"
        text
        loading={loadingDelete}
        onClick={() => deleteSubCategory()}
      />
    </>
  );

  const imageBodyTemplate = (rowData: Demo.SubCategory) => {
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
          alt={"Image"}
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

  const statusBodyTemplate = (rowData: Demo.SubCategory) => {
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

  const getCategories = useCallback(async () => {
    var dataToApi = {
      token: userInfo.token,
    };

    try {
      await axios.post("/api/category/list", dataToApi).then((res) => {
        var result = res.data;
        if (result.status === "success") {
          const categoryNames: string[] = result.data.map(
            (item: Demo.Category) => item.category_name
          );
          setCategoriesName(categoryNames);
          setLoadingCategories(false);
        } else {
          toastMessage("error", result.data);
        }
      });
    } catch (e) {
      toastMessage(
        "error",
        "Une erreur est survenue lors de la récupération des catégories."
      );
      console.log(e);
    }
  }, [userInfo.token]);

  useEffect(() => {
    if (userInfo) {
      getSubCategories();
      getCategories();
    }
    initFilters();
  }, [getCategories, getSubCategories, layoutConfig, userInfo]);

  const onRowEditComplete = async (e: any) => {
    setLoading(true);
    let _product = [...subCategories];
    let { newData, index } = e;
    _product[index] = newData;

    //? modifier le produit
    const dataToApi = {
      token: userInfo.token,
      sub_category: newData,
    };

    try {
      await axios.post("/api/sub_category/update", dataToApi).then((res) => {
        const result = res.data;
        if (result.status === "success") {
          toastMessage("success", result.data);
          getSubCategories();
          setSubCategory(emptySubCategory);
          setSelectedCategory(null);
        } else {
          toastMessage("error", result.data);
        }
      });
    } catch (e) {
      console.log(e);
      toastMessage(
        "error",
        "Une erreur est survenue lors de la modification de l'article."
      );
    }
    setLoading(false);
  };

  const numberEditor = (options: any) => {
    return (
      <InputNumber
        placeholder="Veuillez remplir ce champs"
        value={options.value}
        onChange={(e) => options.editorCallback(e.value)}
      />
    );
  };

  const categoryEditor = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        onChange={(e) => {
          options.editorCallback(e.value);
          setSelectedCategory(e.value);
        }}
        options={categoriesName}
        placeholder="Choisir catégorie"
        disabled={loadingCategories}
        filter
      />
    );
  };

  const typeEditor = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        onChange={(e) => {
          options.editorCallback(e.value);
          setSelectedType(e.value);
        }}
        options={getTypes()}
        optionLabel="label"
        optionGroupLabel="label"
        optionGroupChildren="items"
        optionGroupTemplate={groupedItemTemplate}
        placeholder="Choisir le type"
        disabled={loadingCategories}
        filter
      />
    );
  };

  const sizeEditor = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        onChange={(e) => {
          options.editorCallback(e.value);
        }}
        options={getSizes()}
        optionLabel="label"
        optionGroupLabel="label"
        optionGroupChildren="items"
        optionGroupTemplate={groupedItemTemplate}
        placeholder="Choisir la taille"
        disabled={loadingCategories}
        filter
      />
    );
  };

  const colorEditor = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        onChange={(e) => {
          options.editorCallback(e.value);
        }}
        options={getColors()}
        placeholder="Choisir la couleur"
        disabled={loadingCategories}
        filter
      />
    );
  };

  const onRowEditInit = (e: any) => {
    setSelectedCategory(e.data.category);
    setSelectedType(e.data.type);
    setSubCategory(e.data);
  };

  const footer =
    subCategories &&
    subCategories.length > 1 &&
    subCategories.length + " sous-catégories";

  return (
    <div className="col-12">
      <Toast ref={toast} />

      <div className="card">
        <div className="flex flex-column md:flex-row md:align-items-start md:justify-content-between mb-3">
          <div className="text-900 text-xl font-semibold mb-3 md:mb-0">
            {id_category ? category.category_name : "Sous-catégories"}
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
              className="md:mx-3 mx-1 export-target-button"
              rounded
              data-pr-tooltip="Nouvelle sous-catégorie"
              data-pr-position="top"
              onClick={() => router.push("/sub_category/new")}
            ></Button>
          </div>
        </div>

        <DataTable
          value={subCategories}
          footer={footer}
          loading={loading}
          dataKey="id_product"
          paginator
          rows={10}
          className="datatable-responsive"
          emptyMessage="Aucun résultat."
          responsiveLayout="scroll"
          globalFilter={globalFilterValue}
          filters={filters}
          editMode="row"
          onRowEditComplete={onRowEditComplete}
          onRowEditInit={onRowEditInit}
        >
          <Column field="image" header="Image" body={imageBodyTemplate} />
          <Column field="code" header="Code" sortable />
          <Column
            field="category"
            header="Catégorie"
            editor={(options: any) => categoryEditor(options)}
            sortable
          />

          <Column
            field="size"
            header="Taille"
            editor={(options: any) => sizeEditor(options)}
            sortable
          />
          <Column
            field="color"
            header="Couleur"
            editor={(options: any) => colorEditor(options)}
            sortable
          />

          <Column
            field="type"
            header="Type"
            editor={(options: any) => typeEditor(options)}
            sortable
          />
          <Column
            field="quantity"
            header="Qté"
            editor={(options: any) => numberEditor(options)}
            sortable
          />

          <Column
            field="alert_quantity"
            header="Alerte Qté"
            editor={(options: any) => numberEditor(options)}
            sortable
          />

          <Column
            field="sale_price"
            header="Prix"
            editor={(options: any) => numberEditor(options)}
            body={(rowData) => priceBodyTemplate(rowData.sale_price)}
            sortable
          />
          <Column
            field="status"
            header="Statut"
            body={statusBodyTemplate}
            sortable
          />
          <Column
            rowEditor
            headerStyle={{
              minWidth: "7rem",
              maxWidth: "7rem",
              width: "7rem",
            }}
            bodyStyle={{ textAlign: "center" }}
          />
          <Column field="created_by" header="Créé par" sortable />
          <Column field="date" header="Date" sortable />

          {userInfo.role === "Super Admin" && (
            <Column
              header="Action"
              headerStyle={{
                minWidth: "10rem",
                maxWidth: "16rem",
                width: "10rem",
              }}
              body={actionBodyTemplate}
            />
          )}
        </DataTable>
      </div>

      {/* Modal Delete SubCategory */}
      <Dialog
        visible={isDeleteDialog}
        style={{ width: "450px" }}
        header="Confirmation"
        modal
        footer={deleteDialogFooter}
        onHide={hideDeleteDialog}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {SubCategory && (
            <span>
              Êtes-vous sûr(e) de vouloir supprimer cette sous-catégorie:
              <b>{" " + SubCategory.code + " "}</b>
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default SubCategoryList;
