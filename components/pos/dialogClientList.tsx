"use client";
import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

interface ClientProps {
  visible: boolean;
  title: string;
  onConfirm: (client: Demo.Client) => void;
  onCancel: () => void;
  newClient: () => void;
}

const DialogClientList: React.FC<ClientProps> = (props) => {
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

  const [clients, setClients] = useState<Demo.Client[]>();
  const [selectedClient, setSelectedCLient] = useState<Demo.Client | null>(
    null
  );

  const [loadingClients, setLoadingClients] = useState(true);

  const getClients = useCallback(async () => {
    try {
      await axios
        .post("/api/client", {
          token: userInfo.token,
        })
        .then((res) => {
          var result = res.data;
          if (result.status === "success") {
            setClients(result.data);
          } else {
            toastMessage("error", result.data);
          }
        });
    } catch (error) {
      console.log(error);
    }

    setLoadingClients(false);
  }, [userInfo.token]);

  useEffect(() => {
    getClients();
  }, [getClients]);

  const selectedClientTemplate = (option: Demo.Client, props: any) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <img
            alt={option.name}
            src="/user.png"
            className={`mr-2`}
            style={{ width: "18px" }}
          />
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const clientOptionTemplate = (option: Demo.Client) => {
    return (
      <div className="flex align-items-center">
        <img
          alt={option.name}
          src="/user.png"
          className={`mr-2`}
          style={{ width: "20px" }}
        />
        <div className="flex flex-column">
          <span className="font-bold">{option.name}</span>
          <span className="font-small">{option.phone}</span>
        </div>
      </div>
    );
  };

  const dialogFooter = (
    <>
      <Button
        icon="pi pi-user-plus"
        label="Enregistrer noveau client"
        text
        onClick={() => props.newClient()}
      ></Button>
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
        style={{ width: "450px" }}
        footer={dialogFooter}
      >
        <div className="grid formgrid p-fluid mt-2">
          <div className="field mb-4 col-12">
            <Dropdown
              value={selectedClient}
              onChange={(e: DropdownChangeEvent) => {
                setSelectedCLient(e.value);
                props.onConfirm(e.value);
              }}
              options={clients}
              optionLabel="name"
              placeholder="Choisir le client"
              valueTemplate={selectedClientTemplate}
              itemTemplate={clientOptionTemplate}
              className="w-full"
              filter
              disabled={loadingClients}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DialogClientList;
