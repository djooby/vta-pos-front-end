"use client";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import fonctions from "@/utils/fonctions";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

export default function Profile() {
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

  let emptySubCategory: Demo.SubCategory = {
    code: fonctions.generateRandomString(10),
    category: "",
    color: "",
    size: "",
    type: "",
    cost: 0,
    sale_price: 0,
    quantity: 0,
    alert_quantity: 0,
    created_by: userInfo.fullname,
    date: fonctions.getCurrentDate(),
  };

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [subCategory, setSubCategory] = useState<Demo.SubCategory>(
    emptySubCategory
  );

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
  const typeCup = [
    "Argent",
    "Avec cuillère",
    "Avec tête",
    "Gluten",
    "Gris",
    "Magique",
    "Manche en argent",
    "Manche en or",
    "Or",
    "Personnalisé",
    "Simple",
  ];

  const onInputChange = (e: any, name: any) => {
    const val = (e.target && e.target.value) || "";
    let _subCategory: any = { ...subCategory };
    _subCategory[`${name}`] = val;
    setSubCategory(_subCategory);
  };

  const onOtherInputChange = (val: any, name: any) => {
    let _subCategory: any = { ...subCategory };
    _subCategory[`${name}`] = val;
    setSubCategory(_subCategory);
  };

  const [selectedCategory, setselectedCategory] = useState<Demo.Category>();
  const [selectedSize, setSelectedSize] = useState();
  const [selectedColor, setSelectedColor] = useState();
  const [selectedType, setSelectedType] = useState();

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

  const saveSubCategory = async () => {
    setSubmitted(true);
    if (
      subCategory.code.trim() &&
      subCategory.category.trim() &&
      subCategory.quantity > 0
    ) {
      setLoading(true);
      const token = userInfo.token;
      const dataToapi = {
        token: token,
        sub_category: subCategory,
      };
      console.log(dataToapi);

      try {
        await axios.post("/api/sub_category/add", dataToapi).then((res) => {
          const result = res.data;
          if (result.status === "success") {
            // redirect to subCategory overview
            toastMessage("success", "Sous-catégorie enregistré avec succès.");
            setSubCategory(emptySubCategory);
            setSubmitted(false);
            setSelectedColor(undefined);
            setSelectedSize(undefined);
            setSelectedType(undefined);
            setselectedCategory(undefined);
          } else {
            toastMessage("error", result.data);
          }
          setLoading(false);
        });
      } catch (e) {
        setLoading(false);

        console.log(e);
        toastMessage(
          "error",
          "Une erreur est survenue lors de l'enregistrement de la sous-catégorie."
        );
      }
    }
  };

  // Options en fonction de la catégorie sélectionnée
  let typeOptions: string[] = [];
  if (selectedCategory?.category_name === "Tasse") {
    typeOptions = typeCup;
  } else {
    typeOptions = ["Non définie"];
  }

  let sizeOptions: string[] = [];
  if (
    selectedCategory?.category_name === "Maillot à col" ||
    selectedCategory?.category_name === "T-Shirt" ||
    selectedCategory?.category_name === "Maillot"
  ) {
    sizeOptions = sizeShirt;
  } else if (selectedCategory?.category_name === "Tasse") {
    sizeOptions = sizeCup;
  } else if (selectedCategory?.category_name === "Tumbler") {
    sizeOptions = sizeTumbler;
  } else {
    sizeOptions = ["Non définie"];
  }

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
          Ajouter sous-catégorie
        </span>
      </div>

      <Divider />
      <div className="grid">
        <div className="col-12 align-items-center">
          <div className="grid formgrid p-fluid">
            <div className="field mb-4 col-12 md:col-3">
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
                disabled={loadingCategories}
                filter
                className={classNames({
                  "p-invalid": submitted && !subCategory.category,
                })}
              />

              {submitted && !subCategory.category && (
                <small className="p-invalid">
                  La catégorie de l&apos;article est obligatoire.
                </small>
              )}

              {loadingCategories && (
                <small className="p-invalid">
                  <i className="pi pi-spinner pi-spin"></i> Chargement des
                  catégories...
                </small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-3">
              <label htmlFor="size" className="font-medium text-900">
                Taille *
              </label>

              <Dropdown
                value={selectedSize}
                onChange={(e) => {
                  setSelectedSize(e.value);
                  onOtherInputChange(e.value, "size");
                }}
                options={sizeOptions}
                placeholder="Choisir la Taille"
                filter
                className={classNames({
                  "p-invalid": submitted && !subCategory.size,
                })}
              />

              {submitted && !subCategory.size && (
                <small className="p-invalid">
                  La taille de l&apos;article est obligatoire.
                </small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-3">
              <label htmlFor="color" className="font-medium text-900">
                Couleur *
              </label>

              <Dropdown
                id="color"
                value={selectedColor}
                onChange={(e) => {
                  setSelectedColor(e.value);
                  onOtherInputChange(e.value, "color");
                }}
                options={colors}
                placeholder="Choisir la couleur"
                filter
                className={classNames({
                  "p-invalid": submitted && !subCategory.color,
                })}
              />

              {submitted && !subCategory.color && (
                <small className="p-invalid">
                  La couleur de l&apos;article est obligatoire.
                </small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-3 hidden">
              <label htmlFor="cost" className="font-medium text-900">
                Prix d&apos;achat *
              </label>
              <InputNumber
                placeholder="Prix d'achat"
                id="cost"
                type="text"
                className={classNames({
                  "p-invalid": submitted && !subCategory.cost,
                })}
                value={subCategory.cost}
                onChange={(e) => onOtherInputChange(e.value, "cost")}
                max={150000}
              />
              {submitted && !subCategory.cost && (
                <small className="p-invalid">
                  Le prix d&apos;achat est obligatoire.
                </small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-3">
              <label htmlFor="sale_price" className="font-medium text-900">
                Prix de vente *
              </label>
              <InputNumber
                placeholder="Prix de vente"
                id="sale_price"
                type="text"
                value={subCategory.sale_price}
                className={classNames({
                  "p-invalid": submitted && !subCategory.sale_price,
                })}
                onChange={(e) => onOtherInputChange(e.value, "sale_price")}
                max={150000}
              />
              {submitted && !subCategory.sale_price && (
                <small className="p-invalid">
                  Le prix de vente est obligatoire.
                </small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-4">
              <label htmlFor="quantity" className="font-medium text-900">
                Quantité *
              </label>
              <InputNumber
                placeholder="Le nombre d'unités"
                id="quantity"
                type="text"
                value={subCategory.quantity}
                className={classNames({
                  "p-invalid": submitted && !subCategory.quantity,
                })}
                onChange={(e) => onOtherInputChange(e.value, "quantity")}
                max={1500}
              />
              {submitted && !subCategory.quantity && (
                <small className="p-invalid">
                  La quantité est obligatoire.
                </small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-4">
              <label htmlFor="alert_quantity" className="font-medium text-900">
                Alerte quantité *
              </label>
              <InputNumber
                placeholder="Quantité minimale"
                id="quantity"
                type="text"
                value={subCategory.alert_quantity}
                className={classNames({
                  "p-invalid": submitted && !subCategory.alert_quantity,
                })}
                onChange={(e) => onOtherInputChange(e.value, "alert_quantity")}
              />
              {submitted && !subCategory.alert_quantity && (
                <small className="p-invalid">
                  L&apos;alerte de quantité est obligatoire.
                </small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-4">
              <label htmlFor="type" className="font-medium text-900">
                Type
              </label>

              <Dropdown
                id="type"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.value);
                  onOtherInputChange(e.value, "type");
                }}
                options={typeOptions}
                placeholder="Choisir Type"
                disabled={loadingCategories}
                filter
                className={classNames({
                  "p-invalid": submitted && !subCategory.type,
                })}
              />
              {submitted && !subCategory.type && (
                <small className="p-invalid">Le type est obligatoire.</small>
              )}
            </div>

            <div className="col-12">
              <Button
                outlined
                label="Enregistrer"
                loading={loading}
                className="w-12rem"
                icon="pi pi-check"
                onClick={() => saveSubCategory()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
