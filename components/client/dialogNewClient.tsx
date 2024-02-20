import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import fonctions from "@/utils/fonctions";
import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useContext, useRef, useState } from "react";

interface NewClientProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (client: Demo.Client) => void;
  title: string;
}

const DialogNewClient: React.FC<NewClientProps> = (props) => {
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

  const [submitted, setSubmitted] = useState<boolean>(false);
  let emptyClient: Demo.Client = {
    id_client: 0,
    name: "",
    phone: "",
    address: "",
    date: fonctions.getCurrentDate(),
  };

  const [newClient, setNewClient] = useState<Demo.Client>(emptyClient);
  const [loading, setLoading] = useState<boolean>(false);

  const onInputNewClientChange = (value: any, name: string) => {
    let _newClient: any = { ...newClient };
    _newClient[`${name}`] = value;
    setNewClient(_newClient);
  };

  const saveNewClient = () => {
    setSubmitted(true);
    setLoading(true);

    if (
      newClient.name.trim() &&
      newClient.address.trim() &&
      newClient.phone.trim()
    ) {
      // save via API
      try {
        axios
          .post("/api/client/new", {
            token: userInfo.token,
            client: newClient,
          })
          .then((res) => {
            var result = res.data;
            if (result.status === "success") {
              toastMessage("success", "Client enregistré avec succès.");
              props.onConfirm(result.client);
            } else {
              toastMessage("error", result.data);
            }
          });
      } catch (e) {
        toastMessage(
          "error",
          "Une erreur est survenue lors de l'enregistrement des clients."
        );
        console.log(e);
      }

      setLoading(false);
    }
  };

  const dialogFooter = (
    <>
      <Button
        icon="pi pi-check"
        text
        className="mb-2"
        label="Enregistrer"
        type="button"
        onClick={() => saveNewClient()}
        loading={loading}
      />
    </>
  );
  return (
    <>
      <Toast ref={toast} />
      <Dialog
        position="top"
        visible={props.visible}
        header={props.title}
        onHide={props.onCancel}
        className="max-h-screen"
        footer={dialogFooter}
        style={{ width: "450px" }}
      >
        <div className="grid formgrid p-fluid mt-2">
          <div className="field mb-4 col-12">
            <label htmlFor="fullname">Prénom et Nom</label>
            <InputText
              id="fullname"
              placeholder="Entrer le nom complet"
              onChange={(e) => onInputNewClientChange(e.target.value, "name")}
              className={classNames({
                "p-invalid": submitted && !newClient.name,
              })}
            />
          </div>

          <div className="field mb-4 col-12">
            <label htmlFor="phone">Télephone</label>
            <InputMask
              mask="9999-9999"
              placeholder="****-****"
              id="phone"
              onChange={(e) => onInputNewClientChange(e.target.value, "phone")}
              className={classNames({
                "p-invalid": submitted && !newClient.phone,
              })}
            />
          </div>

          <div className="field mb-4 col-12">
            <label htmlFor="address">Adresse</label>
            <InputText
              id="address"
              value={newClient.address}
              placeholder="Entrer l'adresse"
              onChange={(e) =>
                onInputNewClientChange(e.target.value, "address")
              }
              className={classNames({
                "p-invalid": submitted && !newClient.address,
              })}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DialogNewClient;
