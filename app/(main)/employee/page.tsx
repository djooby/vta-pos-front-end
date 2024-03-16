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
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { InputNumber } from "primereact/inputnumber";
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

  const [selectedRole, setSelectedRole] = useState<string | null>(null);

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

  const role = [
    "Non définie",
    "Administrateur",
    "Secrétaire",
    "Technicien",
    "Caissier",
  ];
  const [submitted, setSubmitted] = useState(false);

  const onRowEditComplete = async (e: any) => {
    setSubmitted(false);
    setLoading(true);
    let _employee = [...employees];
    let { newData, index } = e;
    _employee[index] = newData;

    if (
      newData.first_name === "" ||
      newData.last_name === "" ||
      newData.email === "" ||
      newData.phone === "" ||
      newData.poste === "" ||
      !role.includes(newData.role) ||
      newData.address === ""
    ) {
      toastMessage("error", "Veuillez remplir tous les champs");
      setLoading(false);
      return;
    } else {
      // ?modifier l employe
      const dataToApi = {
        token: userInfo.token,
        new_employee: newData,
      };

      try {
        await axios.post("/api/employee/update", dataToApi).then((res) => {
          const result = res.data;
          if (result.status === "success") {
            toastMessage("success", result.data);
            setEmployees(_employee);
          } else {
            toastMessage("error", result.data);
          }
        });
      } catch (e) {
        toastMessage(
          "error",
          "Une erreur est survenue lors de la modification"
        );
        console.log(e);
      }
      setSubmitted(false);
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

  const phoneEditor = (options: any) => {
    return (
      <InputMask
        id="phone"
        value={options.value}
        mask="9999-9999"
        placeholder="9999-9999"
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const salaryEditor = (options: any) => {
    return (
      <InputNumber
        type="text"
        value={options.value}
        mode="currency"
        currency="HTG"
        locale="fr-HT"
        min={0}
        onChange={(e) => options.editorCallback(e.value)}
      />
    );
  };

  const roleEditor = (options: any) => {
    return (
      <Dropdown
        id="role"
        value={selectedRole}
        onChange={(e) => {
          setSelectedRole(e.value);
          options.editorCallback(e.value);
        }}
        options={role}
        placeholder="Choisir le niveau d'acces"
      />
    );
  };

  const onRowEditInit = (e: any) => {
    setSelectedRole(e.data.role);
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
          editMode="row"
          onRowEditComplete={onRowEditComplete}
          onRowEditInit={onRowEditInit}
        >
          <Column
            field="first_name"
            header="Prénom"
            editor={(options: any) => textEditor(options)}
            sortable
          />
          <Column
            field="last_name"
            header="Nom"
            editor={(options: any) => textEditor(options)}
            sortable
          />
          <Column
            field="email"
            header="Email"
            editor={(options: any) => textEditor(options)}
            sortable
          />
          <Column
            field="phone"
            header="Téléphone"
            editor={(options: any) => phoneEditor(options)}
            sortable
          />
          <Column
            field="poste"
            header="Poste"
            editor={(options: any) => textEditor(options)}
            sortable
          />
          <Column
            field="role"
            header="Role"
            editor={(options: any) => roleEditor(options)}
            sortable
          />
          <Column
            field="salary"
            header="Salaire"
            editor={(options: any) => salaryEditor(options)}
            sortable
          />
          <Column
            field="address"
            header="Adresse"
            editor={(options: any) => textEditor(options)}
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
