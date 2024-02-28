"use client";

import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import axios from "axios";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface CategoryListProps {
  onCategorySelect: (category: Demo.Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onCategorySelect }) => {
  const [dataViewValue, setDataViewValue] = useState<Demo.Category[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const { userInfo } = useContext(UserContext);
  const toast = useRef<Toast | null>(null);

  const [loadingCategories, setLoadingCategories] = useState<boolean>(false);

  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(null);
  const [sortField, setSortField] = useState("");

  const getCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.post("/api/category/list", {
        token: userInfo.token,
      });
      const result = response.data;
      if (result.status === "success") {
        setDataViewValue(result.data);
      } else {
        toastMessage("error", result.data);
      }
    } catch (error) {
      toastMessage(
        "error",
        "Une erreur est survenue lors de la récupération des catégories."
      );
      console.error("Erreur get categories: ", error);
    }
    setLoadingCategories(false);
  }, [userInfo.token]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const [filteredValue, setFilteredValue] = useState<Demo.Category[] | null>(
    null
  );

  const sortOptions = [
    { label: "Ordre décroissant", value: "!quantity" },
    { label: "Ordre  croissant", value: "quantity" },
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
        placeholder="Filtrer par quantité"
        onChange={onSortChange}
      />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onFilter}
          placeholder="Filtrer par nom"
        />
      </span>
    </div>
  );

  const itemTemplate = (category: Demo.Category) => {
    return (
      <div className="col-6 lg:col-3">
        <div className="card m-3 border-1 p-2 surface-border">
          <div className="flex flex-wrap gap-2 align-items-center justify-content-end mb-2">
            <span
              className={`product-badge status-${getInventoryStatus(
                category.quantity
              ).toLowerCase()}`}
            >
              {category.quantity}
            </span>
          </div>
          <div className="flex flex-column align-items-center text-center mb-3">
            <img
              src={category.image}
              alt={category.image}
              className="w-9 shadow-2 my-3 mx-0"
            />
            <Button
              text
              label={category.category_name}
              onClick={() => onCategorySelect(category)}
            />
          </div>
        </div>
      </div>
    );
  };

  const getInventoryStatus = (quantity: any) => {
    quantity = parseInt(quantity);

    if (quantity > 0) return "INSTOCK";
    else return "OUTOFSTOCK";
  };

  const toastMessage = (status: any, message: string) => {
    const summary = status == "error" ? "Erreur!" : "Succès!";

    toast.current?.show({
      severity: status,
      summary: summary,
      detail: message,
      life: 3000,
    });
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <h5>Catégories</h5>
        {loadingCategories ? (
          <div>Chargement...</div>
        ) : (
          <DataView
            value={filteredValue || dataViewValue}
            paginator
            rows={12}
            sortField={sortField}
            sortOrder={sortOrder}
            itemTemplate={itemTemplate}
            header={dataViewHeader}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryList;
