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
import {
  DataTable,
  DataTableExpandedRows,
  DataTableFilterMeta,
} from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
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

export default function Products() {
  const [expandedRows, setExpandedRows] = useState<
    any[] | DataTableExpandedRows
  >([]);
  const [products, setProducts] = useState<Demo.Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const { layoutConfig } = useContext(LayoutContext);

  const [isDeleteDialog, setIsDeleteDialog] = useState(false);

  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingAttribute, setLoadingAttribute] = useState(false);

  const { userInfo } = useContext(UserContext);

  const router = useRouter();

  let emptyProduct = {
    id_product: "",
    code: "",
    product: "",
    brand: "",
    image: "",
    created_by: userInfo.fullname,
    date: fonctions.getCurrentDate(),
  };

  let emptyAttribute = {
    id_product_attribute: "",
    id_product: "",
    attribute_name: "",
    attribute_value: "",
  };

  const attributeTypeList = ["Couleur", "Taille", "Type", "Poids"];
  const [selectedAttributeList, setSelectedAttributeList] = useState(null);

  const [submitted, setSubmitted] = useState(false);

  const [product, setProduct] = useState<Demo.Product>(emptyProduct);

  const [attribute, setAttribute] = useState<Demo.Attribute>(emptyAttribute);

  const OnInputChange = (e: any, name: any) => {
    const val = (e.target && e.target.value) || "";
    let _attribute: any = { ...attribute };
    _attribute[`${name}`] = val;
    setAttribute(_attribute);
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

  const deleteAttribute = async (id_product_attribute: any) => {
    setLoadingAttribute(true);

    const dataToApi = {
      token: userInfo.token,
      id_product_attribute: id_product_attribute,
    };
    try {
      await axios.post("/api/attribute/delete", dataToApi).then((res) => {
        const result = res.data;
        if (result.status === "success") {
          toastMessage("success", result.data);
          getProducts();
        } else {
          toastMessage("error", result.data);
        }
      });
    } catch (e) {
      console.log("Erreur delete attribute: ", e);
      toastMessage(
        "error",
        "Une erreur est survenue lors de la suppression de l'attribut."
      );
    }
    setLoadingAttribute(false);
  };

  const actionAttributeTemplate = (rowData: any) => {
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
          onClick={() => deleteAttribute(rowData.id_product_attribute)}
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

  const rowExpansionTemplate = (data: Demo.Product) => {
    return (
      <div className="orders-subtable">
        <div className="flex flex-columnp align-items-center justify-content-start">
          <h5>Attributs de: {data.category}</h5>
          <Button
            icon="pi pi-plus"
            severity="success"
            rounded
            className="mb-2 ml-3"
            type="button"
            tooltip="Ajouter attribut"
            tooltipOptions={{ position: "top" }}
            onClick={() => addAttribute(data.id_product)}
          />
        </div>
        <DataTable
          style={{ maxWidth: "400px" }}
          value={data.attribute}
          responsiveLayout="scroll"
          loading={loadingAttribute}
        >
          <Column field="attribute_name" header="Attribut" sortable></Column>
          <Column field="attribute_value" header="Valeur" sortable></Column>
          <Column
            field=""
            header="Action"
            body={actionAttributeTemplate}
          ></Column>
        </DataTable>
      </div>
    );
  };

  const [isNewDialogAttribute, setIsNewDialogAttribute] = useState(false);

  const addAttribute = (id_product: any) => {
    setIsNewDialogAttribute(true);
    attribute.id_product = id_product;
  };

  const newDialogAttributeFooter = (
    <>
      <Button
        loading={loadingAttribute}
        label="Non"
        icon="pi pi-times"
        severity="secondary"
        className="p-button-text"
        text
        onClick={() => onHideNewDialog()}
      />
      <Button
        label="Oui"
        icon="pi pi-check"
        text
        loading={loadingAttribute}
        onClick={() => saveAttribute()}
      />
    </>
  );

  const onHideNewDialog = () => {
    setIsNewDialogAttribute(false);
  };

  const saveAttribute = async () => {
    setSubmitted(true);
    setLoadingAttribute(true);

    if (attribute.attribute_name?.trim() && attribute.attribute_value?.trim()) {
      const dataToApi = {
        token: userInfo.token,
        product_attribute: attribute,
      };
      try {
        await axios.post("/api/attribute/add", dataToApi).then((res) => {
          const result = res.data;
          if (result.status === "success") {
            setIsNewDialogAttribute(false);
            toastMessage("success", result.data);
            getProducts();
          } else {
            toastMessage("error", result.data);
          }
        });
      } catch (e) {
        console.log("Erreur save attribute: ", e);
        toastMessage(
          "error",
          "Une erreur est survenue lors de la sauvegarde de l'attribut."
        );
      }
      setSubmitted(false);
    }
    setLoadingAttribute(false);
  };

  useEffect(() => {
    if (userInfo) {
      getProducts();
    }
    initFilters();
  }, [getProducts, layoutConfig, userInfo]);

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
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          loading={loading}
          dataKey="id_product"
          paginator
          rows={10}
          className="datatable-responsive"
          emptyMessage="Aucun résultat."
          responsiveLayout="scroll"
          globalFilter={globalFilterValue}
          filters={filters}
        >
          <Column expander style={{ width: "3em" }} />
          <Column field="cost" header="Image" body={imageBodyTemplate} />
          <Column field="code" header="Code" sortable />
          <Column field="category" header="Catégorie" sortable />
          <Column field="brand" header="Marque" sortable />
          <Column field="quantity" header="Quantité" sortable />
          <Column field="alert_quantity" header="Alerte Stock" sortable />
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

      {/* Modal New Attribute */}
      <Dialog
        visible={isNewDialogAttribute}
        style={{ width: "450px" }}
        header="Nouvel attribut"
        modal
        footer={newDialogAttributeFooter}
        onHide={onHideNewDialog}
      >
        <div className="grid formgrid mt-5 p-fluid">
          <div className="field mb-4 col-12">
            <label htmlFor="compte" className="font-medium text-900">
              Nom Attribut *
            </label>
            <Dropdown
              id="compte"
              options={attributeTypeList}
              value={attribute.attribute_name}
              onChange={(e) => {
                setSelectedAttributeList(e.value);
                attribute.attribute_name = e.value;
              }}
              placeholder="attribut"
              itemTemplate={(option) => {
                return option;
              }}
              className={classNames({
                "p-invalid": submitted && !selectedAttributeList,
              })}
            />
            {submitted && !selectedAttributeList && (
              <small className="p-invalid">
                Veuillez choisir l&apos;attribut.
              </small>
            )}
          </div>

          <div className="field mb-4 col-12">
            <label htmlFor="attribute_value" className="font-medium text-900">
              Valeur Attribut *
            </label>
            <InputText
              id="attribute_value"
              placeholder="La valeur de l'attribut"
              onChange={(e) => OnInputChange(e, "attribute_value")}
              className={classNames({
                "p-invalid": submitted && !attribute.attribute_value,
              })}
            />
            {submitted && !attribute.attribute_value && (
              <small className="p-invalid">
                La valeur de l&apos;attribut est obligatoire.
              </small>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
