"use client";
import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import fonctions from "@/utils/fonctions";
import axios from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { DataView } from "primereact/dataview";
import { Dialog } from "primereact/dialog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

export default function POS() {
  const [dataViewValue, setDataViewValue] = useState<Demo.Category[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filteredValue, setFilteredValue] = useState<Demo.Category[] | null>(
    null
  );
  const [layout, setLayout] = useState<
    "grid" | (string & Record<string, unknown>)
  >("grid");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
  const [sortField, setSortField] = useState("");

  const [loading, setLoading] = useState(true);

  const chooseCategory = (category: Demo.Category) => {
    setCategory(category);
    getCategoryProducts(category.id_category);
    // showModal
    setVisibleProducts(true);
  };

  const chooseProduct = (product: Demo.Product) => {
    setProduct(product);
    setBoxSellingVisible(true);
  };

  const sortOptions = [
    { label: "Quantite High to Low", value: "!product_quantity" },
    { label: "Quantite Low to High", value: "product_quantity" },
  ];

  const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    if (value.length === 0) {
      setFilteredValue(null);
    } else {
      const filtered = dataViewValue?.filter((category) => {
        const categoryNameLowercase = category.category_name.toLowerCase();
        const searchValueLowercase = value.toLowerCase();
        return categoryNameLowercase.includes(searchValueLowercase);
      });

      setFilteredValue(filtered);
    }
  };

  const onSortChange = (event: DropdownChangeEvent) => {
    const value = event.value;

    if (value.indexOf("!") === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const dataViewHeader = (
    <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
      <Dropdown
        value={sortKey}
        options={sortOptions}
        optionLabel="label"
        placeholder="Filtrer par quantite"
        onChange={onSortChange}
      />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onFilter}
          placeholder="Filtrer par categorie"
        />
      </span>
    </div>
  );

  const getInventoryStatus = (qte: any) => {
    qte = parseInt(qte);

    if (qte > 0) return "INSTOCK";
    else return "OUTOFSTOCK";
  };

  const dataviewGridItem = (data: Demo.Category) => {
    return (
      <div className="col-12 lg:col-3">
        <div className="card m-3 border-1 p-2 surface-border">
          <div className="flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
            <span
              className={`product-badge status-${getInventoryStatus(
                data.product_quantity
              ).toLowerCase()}`}
            >
              {getInventoryStatus(data.product_quantity)}
              {"(" + data.product_quantity + ")"}
            </span>
          </div>
          <div className="flex flex-column align-items-center text-center mb-3">
            <img
              src={data.image}
              alt={data.image}
              className="w-9 shadow-2 my-3 mx-0"
            />
            <div className="text-xl font-bold">{data.category_name}</div>
          </div>
          <div className="flex align-items-center justify-content-end">
            <Button
              label="Choisir"
              className="w-full"
              disabled={data.product_quantity <= 0}
              onClick={() => chooseCategory(data)}
            />
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (data: Demo.Category) => {
    if (!data) {
      return;
    }
    return dataviewGridItem(data);
  };

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

  let emptyCategory = {
    id_category: "",
    category_name: "",
    image: "",
    product_quantity: 0,
    created_by: userInfo.fullname,
    date: fonctions.getCurrentDate(),
  };

  let emptyProduct: Demo.Product = {
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

  const [category, setCategory] = useState<Demo.Category>(emptyCategory);
  const [product, setProduct] = useState<Demo.Product>(emptyProduct);

  const [products, setProducts] = useState<Demo.Product[]>([]);

  const getCategories = useCallback(async () => {
    const dataToapi = {
      token: userInfo.token,
    };

    try {
      await axios.post("/api/category/list", dataToapi).then((res) => {
        const result = res.data;
        if (result.status === "success") {
          setDataViewValue(result.data);
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

  const getCategoryProducts = async (id_category: any) => {
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
  };

  const [visibleProducts, setVisibleProducts] = useState(false);

  useEffect(() => {
    getCategories();
    setGlobalFilterValue("");
  }, [getCategories]);

  //! =======================================================
  const [loadingProducts, setLoadingProducts] = useState(false);

  const listeService = ["Normal", "Personnalisé"];
  const [selectedService, setSelectedService] = useState<string>("Normal");

  const actionBodyTemplate = (rowData: any) => {
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
          onClick={() => chooseProduct(rowData)}
        />
      </>
    );
  };

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

  const onHideBoxSellingDialog = () => {
    setBoxSellingVisible(false);
    setProduct(emptyProduct);
    setCategory(emptyCategory);
  };

  const boxSellingDialogFooter = (
    <>
      <Button
        label="Non"
        icon="pi pi-times"
        severity="secondary"
        className="p-button-text"
        text
        onClick={onHideBoxSellingDialog}
      />
      <Button
        label="Oui"
        icon="pi pi-check"
        text
        onClick={() => confirmBoxSelling()}
      />
    </>
  );

  const [boxSellingVisible, setBoxSellingVisible] = useState(false);
  const [quantity, setQuantity] = useState<any>(1);

  //! =============== PRODUCT ORDER ==============
  let emptyProductOrder: Demo.OrderProduct = {
    category: product.category,
    code: product.code,
    color: product.color,
    size: product.size,
    type: product.type,
    service: selectedService,
    price: product.sale_price,
    quantity: 1,
    total: product.sale_price * quantity,
  };

  const [orderProducts, setOrderProducts] = useState<Demo.OrderProduct[]>();
  const [orderProduct, setOrderProduct] = useState<Demo.OrderProduct>(
    emptyProductOrder
  );

  const confirmBoxSelling = () => {
    orderProduct.total = orderProduct.price * orderProduct.quantity;
    orderProduct.category = product.category;
    orderProduct.code = product.code;
    orderProduct.color = product.color;
    orderProduct.size = product.size;
    orderProduct.type = product.type;

    console.log("PO: ", orderProduct);
    console.log("P: ", product);

    // setBoxSellingVisible(false);
    // setProduct(emptyProduct);
    // setCategory(emptyCategory);
    // setVisibleProducts(false);
  };

  const onInputChange = (value: any, name: any) => {
    let _orderProduct: any = { ...orderProduct };
    _orderProduct[`${name}`] = value;
    setOrderProduct(_orderProduct);
  };

  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <div className="card">
          <h5>Catégories</h5>
          <DataView
            value={filteredValue || dataViewValue}
            layout={layout}
            paginator
            rows={12}
            sortOrder={sortOrder}
            sortField={sortField}
            itemTemplate={itemTemplate}
            header={dataViewHeader}
          ></DataView>
        </div>
      </div>

      <div className="col-12 md:col-6">
        <div className="card">
          <h5>Article(s) selectionné(s)</h5>
        </div>
      </div>

      <Dialog
        header={"Liste de: " + category.category_name}
        position="top"
        visible={visibleProducts}
        style={{ width: "50vw" }}
        onHide={() => setVisibleProducts(false)}
      >
        <div className="card">
          <h5>Articles</h5>
          <DataTable
            loading={loadingProducts}
            dataKey="id_category"
            paginator
            rows={10}
            className="datatable-responsive"
            value={products}
            emptyMessage="Aucun résultat."
            responsiveLayout="scroll"
          >
            <Column field="cost" header="Image" body={imageBodyTemplate} />

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
        </div>
      </Dialog>

      <Dialog
        header={"Configuration commande"}
        position="top"
        visible={boxSellingVisible}
        style={{ width: "450px" }}
        onHide={onHideBoxSellingDialog}
        footer={boxSellingDialogFooter}
      >
        <div className="grid formgrid p-fluid mt-2">
          <div className="field mb-4 col-12">
            <label htmlFor="service">Service</label>
            <Dropdown
              id="service"
              options={listeService}
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.value);
                onInputChange(e.value, "service");
              }}
            ></Dropdown>
          </div>

          <div className="field mb-4 col-12">
            <label htmlFor="price">Prix unitaire</label>
            <InputNumber
              id="price"
              placeholder="Entrer le prix unitaire"
              value={product.sale_price}
              disabled={selectedService == "Normal" ? true : false}
              onChange={(e) => onInputChange(e.value, "price")}
            />
          </div>
          <div className="field mb-4 col-12">
            <label htmlFor="quantity">Quantite</label>
            <InputNumber
              id="quantity"
              value={1}
              placeholder="Entrer la quantite"
              onValueChange={(e) => onInputChange(e.value, "quantity")}
              min={1}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
