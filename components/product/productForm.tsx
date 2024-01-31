import { UserContext } from "@/layout/context/usercontext";
import fonctions from "@/utils/fonctions";
import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useCallback, useContext, useEffect, useState } from "react";

export default function ProductForm(props: any) {
  let emptyProduct = {
    code: fonctions.generateRandomString(10),
    brand: "",
    category: "",
    cost: "",
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

  const { userInfo } = useContext(UserContext);

  const [isActionDialogVisible, setIsActionDialogVisible] = useState(false);
  const [loadingAddCategory, setLoadingAddCategory] = useState(false);

  const [selectedCategory, setselectedCategory] = useState(null);
  const newCategory = {
    category_name: "Ajouter nouvelle categorie",
    id_category: "0",
  };

  const hideActionDialog = () => {
    setIsActionDialogVisible(false);
  };

  const [category, setCategory] = useState<string>();
  const [submittedNewCategory, setSubmittedNewCategory] = useState(false);

  const [categories, setCategories] = useState([newCategory]);

  const getCategories = useCallback(async () => {
    var dataToApi = {
      token: userInfo.token,
    };

    try {
      await axios.post("/api/category/get", dataToApi).then((res) => {
        var result = res.data;
        if (result.status === "success") {
          // const _newCategory = [...categories, result.data];
          setCategories(result.data);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }, [userInfo.token]);

  const saveCategory = async () => {
    setSubmittedNewCategory(true);
    if (category != "") {
      const dataToApi = {
        token: userInfo.token,
        category_name: category,
      };
      setLoadingAddCategory(true);

      try {
        await axios.post("/api/category/add", dataToApi).then((res) => {
          const result = res.data;
          if (result.status == "sucess") {
            // show success message
            getCategories();
          } else {
            // show error message
          }

          setIsActionDialogVisible(false);
          setLoadingAddCategory(false);
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const actionDialogFooter = (
    <>
      <Button
        label="Non"
        icon="pi pi-times"
        disabled={loadingAddCategory}
        text
        onClick={hideActionDialog}
      />
      <Button
        label="Oui"
        icon="pi pi-check"
        loading={loadingAddCategory}
        text
        onClick={() => saveCategory()}
      />
    </>
  );

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <div className="grid formgrid p-fluid">
      <div className="field mb-4 col-12 md:col-6">
        <label htmlFor="expediteur" className="font-medium text-900">
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
        <label htmlFor="brand" className="font-medium text-900">
          Marque
        </label>
        <InputText
          placeholder="Marque de l'article"
          id="brand"
          type="text"
          className={classNames({
            "p-invalid": submitted && !product.brand,
          })}
          onChange={(e) => onInputChange(e, "brand")}
        />
        {submitted && !product.brand && (
          <small className="p-invalid">La marque est obligatoire.</small>
        )}
      </div>

      <div className="field mb-4 col-12 md:col-6">
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
          onChange={(e) => onInputChange(e, "cost")}
          max={1500}
        />
        {submitted && !product.cost && (
          <small className="p-invalid">
            Le prix d&apos;achat est obligatoire.
          </small>
        )}
      </div>

      <div className="field mb-4 col-12 md:col-6">
        <label htmlFor="expediteur" className="font-medium text-900">
          Categorie *
        </label>

        <Dropdown
          value={selectedCategory}
          onChange={(e) => {
            setselectedCategory(e.value);
            if (e.value.category_name === "Ajouter nouvelle categorie") {
              setIsActionDialogVisible(true);
            }
          }}
          options={categories}
          optionLabel="category_name"
          placeholder="Choisir categorie"
          filter
          className="w-full"
        />

        {submitted && !product.category && (
          <small className="p-invalid">La categorie est obligatoire.</small>
        )}
      </div>

      <div className="col-12">
        <Button
          label="Enregistrer"
          loading={loading}
          className="w-12rem"
          icon="pi pi-check"
        />
      </div>
      <Dialog
        visible={isActionDialogVisible}
        header="Ajouter Categorie"
        modal
        style={{ width: "450px" }}
        footer={actionDialogFooter}
        onHide={hideActionDialog}
      >
        <div className="grid formgrid p-fluid mt-2">
          <div className="field mb-4 col-12">
            <label htmlFor="category_name" className="font-medium text-900">
              Nom categorie
            </label>
            <InputText
              placeholder="Nom de categorie"
              id="category_name"
              type="text"
              value={category}
              className={classNames({
                "p-invalid": submittedNewCategory && !category,
              })}
              onChange={(e) => setCategory(e.target.value)}
            />
            {submittedNewCategory && !category && (
              <small className="p-invalid">
                Le nom de la categorie est obligatoire.
              </small>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
