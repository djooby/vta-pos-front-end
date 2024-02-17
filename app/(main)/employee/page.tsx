"use client";

import { LayoutContext } from "@/layout/context/layoutcontext";
import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

export default function Employee() {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Demo.Employee[]>([]);
  const { userInfo } = useContext(UserContext);
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const { layoutConfig } = useContext(LayoutContext);

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

  const emptyEmployee: Demo.Employee = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    poste: "",
    role: "",
    salary: 0,
    address: "",
    date: "",
  };

  const [employee, setEmployee] = useState<Demo.Employee>(emptyEmployee);

  const getEmployees = useCallback(async () => {
    setLoading(true);
    try {
      await axios
        .post("/api/employee/list", { token: userInfo.token })
        .then((res) => {
          const result = res.data;
          if (result.status === "success") {
            setEmployees(result.data);
            setLoading(false);
          } else {
            toastMessage("error", result.data);
          }
        });
    } catch (e) {
      toastMessage(
        "error",
        "Une erreur est survenue lors de la récupération des employés"
      );
      console.log(e);
    }
  }, [userInfo.token]);

  useEffect(() => {
    getEmployees();
    initFilters();
  }, [getEmployees]);

  const router = useRouter();

  const actionBodyTemplate = (rowData: any) => {
    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        rounded
        className="mb-2"
        type="button"
        tooltip="Supprimer"
        tooltipOptions={{ position: "top" }}
        // onClick={() => confirmDeleteCategory(rowData)}
      />
    );
  };

  return (
    <div className="col-12">
      <Toast ref={toast} />

      <div className="card">
        <div className="flex flex-column md:flex-row md:align-items-start md:justify-content-between mb-3">
          <div className="text-900 text-xl font-semibold mb-3 md:mb-0">
            Employés
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
              data-pr-tooltip="Nouvel employé"
              data-pr-position="top"
              onClick={() => router.push("/employee/new")}
            ></Button>
          </div>
        </div>

        <DataTable
          loading={loading}
          dataKey="id_employee"
          paginator
          rows={10}
          className="datatable-responsive"
          value={employees}
          emptyMessage="Aucun résultat."
          responsiveLayout="scroll"
          globalFilter={globalFilterValue}
          filters={filters}
        >
          <Column field="first_name" header="Prénom" sortable />
          <Column field="last_name" header="Nom" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="phone" header="Téléphone" sortable />
          <Column field="poste" header="Poste" sortable />
          <Column field="role" header="Role" sortable />
          <Column field="salary" header="Salaire" sortable />
          <Column field="address" header="Adresse" sortable />
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
    </div>
  );
}
