"use client";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { UserContext } from "@/layout/context/usercontext";
import fonctions from "@/utils/fonctions";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

export default function Profile() {
  const imgPlaceholder = "/product/placeholder.png";
  const [productImage, setproductImage] = useState(imgPlaceholder);
  const { layoutConfig } = useContext(LayoutContext);

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

  const router = useRouter();

  let emptyProduct = {
    code: fonctions.generateRandomString(10),
    brand: "",
    category: "",
    cost: 0,
    quantity: 0,
    status:"INSTOCK"
  };

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(emptyProduct);

  const onInputChange = (e: any, name: any) => {
    const val = (e.target && e.target.value) || "";
    let _product: any = { ...product };
    _product[`${name}`] = val;
    setProduct(_product);
  };

  const onOtherInputChange = (val: any, name: any) => {
    let _product: any = { ...product };
    _product[`${name}`] = val;
    setProduct(_product);
  };

  const [isActionDialogVisible, setIsActionDialogVisible] = useState(false);
  const [loadingAddCategory, setLoadingAddCategory] = useState(false);

  const [selectedCategory, setselectedCategory] = useState(null);

  const hideActionDialog = () => {
    setIsActionDialogVisible(false);
  };

  const [category, setCategory] = useState<string>();
  const [submittedNewCategory, setSubmittedNewCategory] = useState(false);

  const [categories, setCategories] = useState([]);

  const getCategories = useCallback(async () => {
    var dataToApi = {
      token: userInfo.token,
    };

    try {
      await axios.post("/api/category/list", dataToApi).then((res) => {
        var result = res.data;
        if (result.status === "success") {
          setCategories(result.data);
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


  const saveProduct = async () => {
    setSubmitted(true);
    if (
      product.code.trim() &&
      product.category.trim() &&
      product.cost > 0 &&
      product.quantity > 0
    ) {
      setLoading(true);
      const token = userInfo.token;
      const dataToapi = {
        token: token,
        product: product,
      };

      try {
        await axios.post("/api/product/add", dataToapi).then((res) => {
          const result = res.data;
          if (result.status === "success") {
            // redirect to product overview
            toastMessage("success", "L'article a été enregistré avec succès.");
            router.push("/product/overview/" + product.code);
          } else {
            toastMessage("error", result.data);
            setLoading(false);
          }
        });
      } catch (e) {
        setLoading(false);

        console.log(e);
        toastMessage(
          "error",
          "Une erreur est survenue lors de l'enregistrement de l'article."
        );
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      getCategories();
    }
  }, [getCategories, userInfo, layoutConfig]);

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="card-title flex mb-3 justify-content-between align-items-center">
        <span className="text-900 text-xl font-semibold">
          Ajouter nouvel article
        </span>

      </div>

      <Divider />
      <div className="grid">
       

        <div className="col-12 align-items-center">
          <div className="grid formgrid p-fluid">
            <div className="field mb-4 col-12 md:col-6">
              <label htmlFor="code" className="font-medium text-900">
                Code *
              </label>
              <InputText
                placeholder="Code de l'article"
                id="code"
                type="text"
                value={product.code}
                disabled
                className={classNames({
                  "p-invalid": submitted && !product.code,
                })}
                onChange={(e) => onInputChange(e, "code")}
              />
              {submitted && !product.code && (
                <small className="p-invalid">Le code est obligatoire.</small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-6">
              <label htmlFor="expediteur" className="font-medium text-900">
                Catégorie *
              </label>

              <Dropdown
                value={selectedCategory}
                onChange={(e) => {
                  setselectedCategory(e.value);
                  onOtherInputChange(e.value.category_name, "category");
                }}
                options={categories}
                optionLabel="category_name"
                placeholder="Choisir catégorie"
                filter
                className={classNames({
                  "p-invalid": submitted && !product.category,
                })}
              />

              {submitted && !product.category && (
                <small className="p-invalid">
                  La catégorie de l&apos;article est obligatoire.
                </small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-4">
              <label htmlFor="quantity" className="font-medium text-900">
                Quantité *
              </label>
              <InputNumber
                placeholder="Le nombre d'unités de l'article"
                id="quantity"
                type="text"
                className={classNames({
                  "p-invalid": submitted && !product.quantity,
                })}
                onChange={(e) => onOtherInputChange(e.value, "quantity")}
                max={1500}
              />
              {submitted && !product.quantity && (
                <small className="p-invalid">
                  La quantité est obligatoire.
                </small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-4">
              <label htmlFor="cost" className="font-medium text-900">
                Prix d&apos;achat *
              </label>
              <InputNumber
                placeholder="Prix d'achat de l'article"
                id="cost"
                type="text"
                className={classNames({
                  "p-invalid": submitted && !product.cost,
                })}
                onChange={(e) => onOtherInputChange(e.value, "cost")}
                max={150000}
              />
              {submitted && !product.cost && (
                <small className="p-invalid">
                  Le prix d&apos;achat est obligatoire.
                </small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-4">
              <label htmlFor="brand" className="font-medium text-900">
                Marque
              </label>
              <InputText
                placeholder="Marque de l'article"
                id="brand"
                type="text"
                onChange={(e) => onInputChange(e, "brand")}
              />
            </div>

            <div className="col-12">
              <Button
                label="Enregistrer"
                loading={loading}
                className="w-12rem"
                icon="pi pi-check"
                onClick={() => saveProduct()}
              />
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
}
