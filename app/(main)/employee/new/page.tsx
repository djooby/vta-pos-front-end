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
import { InputMask } from "primereact/inputmask";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useContext, useRef, useState } from "react";

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

  let emptyEmployee: Demo.Employee = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    poste: "",
    role: "",
    address: "",
    date: fonctions.getCurrentDate(),
    salary: 0,
  };

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState<Demo.Employee>(emptyEmployee);

  const role = ["Admin", "Secretary", "User"];

  const onInputChange = (e: any, name: any) => {
    const val = (e.target && e.target.value) || "";
    let _employee: any = { ...employee };
    _employee[`${name}`] = val;
    setEmployee(_employee);
  };

  const onOtherInputChange = (val: any, name: any) => {
    let _employee: any = { ...employee };
    _employee[`${name}`] = val;
    setEmployee(_employee);
  };

  const [selectedRole, setSelectedRole] = useState();

  const saveEmployee = async () => {
    setSubmitted(true);
    if (
      employee.first_name.trim() &&
      employee.last_name.trim() &&
      employee.email.trim() &&
      employee.address.trim() &&
      employee.phone.trim() &&
      employee.role.trim() &&
      employee.poste.trim()
    ) {
      setLoading(true);
      const dataToapi = {
        token: userInfo.token,
        employee: employee,
      };

      try {
        await axios.post("/api/employee/add", dataToapi).then((res) => {
          const result = res.data;
          if (result.status === "success") {
            // redirect to employee overview
            toastMessage("success", "L'employé a été enregistré avec succès.");
            router.push("/employee");
          } else {
            toastMessage("error", result.data);
            setLoading(false);
          }
        });
      } catch (e) {
        console.log(e);
        toastMessage(
          "error",
          "Une erreur est survenue lors de l'enregistrement de l'employé."
        );
      }
      setSubmitted(false);
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="card-title flex mb-3 justify-content-between align-items-center">
        <span className="text-900 text-xl font-semibold">
          Ajouter nouvel employé
        </span>
      </div>

      <Divider />
      <div className="grid">
        <div className="col-12 align-items-center">
          <div className="grid formgrid p-fluid">
            <div className="field mb-4 col-12 md:col-4">
              <label htmlFor="first_name" className="font-medium text-900">
                Prénom
              </label>
              <InputText
                placeholder="Prénom de l'employé"
                id="first_name"
                type="text"
                onChange={(e) => onInputChange(e, "first_name")}
                className={classNames({
                  "p-invalid": submitted && !employee.first_name,
                })}
              />
              {submitted && !employee.poste && (
                <small className="p-invalid">
                  Le Prénom de l&apos;employé est obligatoire.
                </small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-4">
              <label htmlFor="last_name" className="font-medium text-900">
                Nom
              </label>
              <InputText
                placeholder="Nom de l'employé"
                id="last_name"
                type="text"
                onChange={(e) => onInputChange(e, "last_name")}
                className={classNames({
                  "p-invalid": submitted && !employee.last_name,
                })}
              />
              {submitted && !employee.last_name && (
                <small className="p-invalid">
                  Le Nom de l&apos;employé est obligatoire.
                </small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-4">
              <label htmlFor="email" className="font-medium text-900">
                Email
              </label>
              <InputText
                placeholder="Email de l'employé"
                id="email"
                type="text"
                onChange={(e) => onInputChange(e, "email")}
                className={classNames({
                  "p-invalid": submitted && !employee.email,
                })}
              />

              {submitted && !employee.poste && (
                <small className="p-invalid">
                  L&apos;email de l&apos;employé est obligatoire.
                </small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-6">
              <label htmlFor="address" className="font-medium text-900">
                Adresse
              </label>
              <InputText
                placeholder="Adresse de l'employé"
                id="address"
                type="text"
                onChange={(e) => onInputChange(e, "address")}
                className={classNames({
                  "p-invalid": submitted && !employee.address,
                })}
              />

              {submitted && !employee.address && (
                <small className="p-invalid">
                  L&apos;adresse de l&apos;employé est obligatoire.
                </small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-6">
              <label htmlFor="phone" className="font-medium text-900">
                Téléphone
              </label>
              <InputMask
                id="phone"
                mask="9999-9999"
                placeholder="9999-9999"
                onChange={(e) => {
                  onOtherInputChange(e.value, "phone");
                }}
              />
              {submitted && !employee.phone && (
                <small className="p-invalid">
                  L&apos;adresse de l&apos;employé est obligatoire.
                </small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-4">
              <label htmlFor="role" className="font-medium text-900">
                Role *
              </label>

              <Dropdown
                id="role"
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.value);
                  onOtherInputChange(e.value, "role");
                }}
                options={role}
                placeholder="Choisir le niveau d'acces"
                className={classNames({
                  "p-invalid": submitted && !employee.role,
                })}
              />

              {submitted && !employee.role && (
                <small className="p-invalid">
                  Le role de l&apos;employé est obligatoire.
                </small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-4">
              <label htmlFor="poste" className="font-medium text-900">
                Poste
              </label>
              <InputText
                placeholder="Poste de l'employé"
                id="poste"
                type="text"
                onChange={(e) => onInputChange(e, "poste")}
                className={classNames({
                  "p-invalid": submitted && !employee.poste,
                })}
              />
              {submitted && !employee.poste && (
                <small className="p-invalid">
                  Le poste d&apos;employé est obligatoire.
                </small>
              )}
            </div>

            <div className="field mb-4 col-12 md:col-4">
              <label htmlFor="salary" className="font-medium text-900">
                Salaire *
              </label>
              <InputNumber
                placeholder="Salaire de l'employé"
                id="salary"
                value={employee.salary}
                type="text"
                onChange={(e) => onOtherInputChange(e.value, "salary")}
                max={150000}
              />
            </div>

            <div className="col-12">
              <Button
                label="Enregistrer"
                loading={loading}
                className="w-12rem"
                icon="pi pi-check"
                onClick={() => saveEmployee()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
