"use client";
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
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
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

  const colors = [
    "Non définie",
    "Abricot",
    "Argent",
    "Beige",
    "Blanc",
    "Bleu",
    "Citron vert",
    "Crème",
    "Cuivre",
    "Cyan",
    "Gris",
    "Indigo",
    "Jaune",
    "Kaki",
    "Magenta",
    "Mauve",
    "Noir",
    "Olive",
    "Orange",
    "Or",
    "Rose",
    "Rouge",
    "Saumon",
    "Turquoise",
    "Vert",
    "Violet",
  ];

  const sizeShirt = ["Youth", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const sizeCup = ["11 oz", "13 oz", "15 oz"];
  const sizeTumbler = ["18 oz", "20 oz", "30 oz", "15 oz"];

  const { userInfo } = useContext(UserContext);

  const router = useRouter();

  let emptyProduct = {
    id_product: "",
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

  const [product, setProduct] = useState<Demo.Product>(emptyProduct);

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

  const getProducts = useCallback(async () => {
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

  const confirmDelete = (rowData: any) => {
    setProduct(rowData);
    setIsDeleteDialog(true);
  };

  const hideDeleteDialog = () => {
    setIsDeleteDialog(false);
  };

  const deleteProduct = async () => {
    setLoadingDelete(true);

    // ? processus de suppression
    const dataToApi = {
      token: userInfo.token,
      id_product: product.id_product,
    };

    try {
      await axios.post("/api/product/delete", dataToApi).then((res) => {
        const result = res.data;
        if (result.status === "success") {
          toastMessage("success", result.data);
          getProducts();
        } else {
          toastMessage("error", result.data);
        }
      });
    } catch (e) {
      console.log("Erreur delete product: ", e);
      toastMessage(
        "error",
        "Une erreur est survenue lors de la suppression de l'article."
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
        onClick={() => deleteProduct()}
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

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [categoriesName, setCategoriesName] = useState<string[]>();

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
      getProducts();
      getCategories();
    }
    initFilters();
  }, [getCategories, getProducts, layoutConfig, userInfo]);

  const onRowEditComplete = async (e: any) => {
    setLoading(true);
    let _product = [...products];
    let { newData, index } = e;
    _product[index] = newData;

    //? modifier le produit
    const dataToApi = {
      token: userInfo.token,
      new_product: newData,
    };

    try {
      await axios.post("/api/product/update", dataToApi).then((res) => {
        const result = res.data;
        if (result.status === "success") {
          toastMessage("success", result.data);
          getProducts();
          setProduct(emptyProduct);
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

  const textEditor = (options: any) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const numberEditor = (options: any) => {
    return (
      <InputNumber
        placeholder="Veuillez remplir ce champs"
        value={options.value}
        onChange={(e) => options.editorCallback(e.value)}
        className="w-5rem"
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

  // Options en fonction de la catégorie sélectionnée
  let sizeOptions: string[] = [];
  if (
    selectedCategory === "Maillot à col" ||
    selectedCategory === "T-Shirt" ||
    selectedCategory === "Maillot"
  ) {
    sizeOptions = sizeShirt;
  } else if (selectedCategory === "Tasse") {
    sizeOptions = sizeCup;
  } else if (selectedCategory === "Tumbler") {
    sizeOptions = sizeTumbler;
  } else {
    sizeOptions = ["Non définie"];
  }

  const sizeEditor = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        onChange={(e) => {
          options.editorCallback(e.value);
        }}
        options={sizeOptions}
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
        options={colors}
        placeholder="Choisir la couleur"
        disabled={loadingCategories}
        filter
      />
    );
  };

  const onRowEditInit = (e: any) => {
    setSelectedCategory(e.data.category);
    setProduct(e.data);
  };

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
              className="md:mx-3 mx-1 export-target-button"
              rounded
              data-pr-tooltip="Nouvel article"
              data-pr-position="top"
              onClick={() => router.push("/product/new")}
            ></Button>
          </div>
        </div>

        <DataTable
          value={products}
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
          <Column field="cost" header="Image" body={imageBodyTemplate} />
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
            editor={(options: any) => textEditor(options)}
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
            field="cost"
            header="Prix d'achat"
            editor={(options: any) => numberEditor(options)}
            body={(rowData) => priceBodyTemplate(rowData.cost)}
            sortable
          />
          <Column
            field="sale_price"
            header="Prix de vente"
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
        onHide={hideDeleteDialog}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {product && (
            <span>
              Êtes-vous sûr(e) de vouloir supprimer cet article:
              <b>{" " + product.code + " "}</b>
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
