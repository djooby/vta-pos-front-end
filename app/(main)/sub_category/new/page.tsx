"use client";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import { getColors } from "@/utils/colors";
import fonctions from "@/utils/fonctions";
import { getSizes } from "@/utils/size";
import { getTypes } from "@/utils/type";
import axios from "axios";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

interface GroupItem {
  label: string;
  value: string;
}

interface GroupType {
  label: string;
  items: GroupItem[];
}

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

  const groupedItemTemplate = (option: Demo.GroupType) => {
    return (
      <div className="flex align-items-center">
        <div>{option.label}</div>
      </div>
    );
  };

  const onOtherInputChange = (val: any, name: any) => {
    let _subCategory: any = { ...subCategory };
    _subCategory[`${name}`] = val;
    setSubCategory(_subCategory);
  };

  const [selectedCategory, setselectedCategory] = useState<Demo.Category>();
  const [selectedSize, setSelectedSize] = useState<GroupItem | null>(null);
  const [selectedColor, setSelectedColor] = useState();
  const [selectedType, setSelectedType] = useState<GroupItem | null>(null);

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
      subCategory.color.trim() &&
      subCategory.size.trim() &&
      subCategory.type.trim() &&
      subCategory.sale_price > 0 &&
      subCategory.alert_quantity > 0 &&
      subCategory.quantity > 0
    ) {
      setLoading(true);
      const token = userInfo.token;
      const dataToapi = {
        token: token,
        sub_category: subCategory,
      };

      try {
        await axios.post("/api/sub_category/add", dataToapi).then((res) => {
          const result = res.data;
          if (result.status === "success") {
            // redirect to subCategory overview
            toastMessage("success", "Sous-catégorie enregistrée avec succès.");
            setSubCategory(emptySubCategory);
            setSubmitted(false);
            setSelectedColor(undefined);
            setSelectedSize(null);
            setSelectedType(null);
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
                onChange={(e: DropdownChangeEvent) => {
                  setSelectedSize(e.value);
                  onOtherInputChange(e.value, "size");
                }}
                optionLabel="label"
                options={getSizes()}
                placeholder="Choisir la Taille"
                optionGroupLabel="label"
                optionGroupChildren="items"
                optionGroupTemplate={groupedItemTemplate}
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
                options={getColors()}
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
                onChange={(e: DropdownChangeEvent) => {
                  setSelectedType(e.value);
                  onOtherInputChange(e.value, "type");
                }}
                optionLabel="label"
                options={getTypes()}
                placeholder="Choisir le type"
                optionGroupLabel="label"
                optionGroupChildren="items"
                optionGroupTemplate={groupedItemTemplate}
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
