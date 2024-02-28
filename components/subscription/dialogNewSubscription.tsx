import { UserContext } from "@/layout/context/usercontext";
import { Demo } from "@/types";
import fonctions from "@/utils/fonctions";
import axios from "axios";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { Nullable } from "primereact/ts-helpers";
import { classNames } from "primereact/utils";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

interface NewSubscriptionProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (NewSubscriptio: Demo.Subscription) => void;
  title: string;
}

const DialogNewSubscription: React.FC<NewSubscriptionProps> = (props) => {
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
  let emptySubs: Demo.Subscription = {
    start_date: "",
    end_date: "",
    price: 0,
    status: "En cours",
    created_date: fonctions.getCurrentDate(),
    created_by: userInfo.fullname,
  };

  const [newSubs, setNewSubs] = useState<Demo.Subscription>(emptySubs);
  const [loading, setLoading] = useState<boolean>(false);

  const onInputNewSubsChange = (value: any, name: string) => {
    let _newSubs: any = { ...newSubs };
    _newSubs[`${name}`] = value;
    setNewSubs(_newSubs);
  };

  const saveNewSubs = () => {
    setSubmitted(true);

    if (selectedClient && newSubs.price > 0) {
      setLoading(true);

      // save via API
      const start_date = fonctions.convertDateToDMY(date as Date);
      const end_date = fonctions.add30Days(start_date);
      newSubs.start_date = start_date;
      newSubs.end_date = end_date;
      newSubs.client = selectedClient.name;
      newSubs.id_client = selectedClient.id_client.toString();

      try {
        axios
          .post("/api/subscription/new", {
            token: userInfo.token,
            subscription: newSubs,
          })
          .then((res) => {
            var result = res.data;
            if (result.status === "success") {
              toastMessage("success", "Abonnement enregistré avec succès.");
              props.onConfirm(result.subscription);
              setSelectedCLient(null);
              setNewSubs(emptySubs);
              setDate(today);
            } else {
              toastMessage("error", result.data);
            }
            setLoading(false);
          });
      } catch (e) {
        toastMessage(
          "error",
          "Une erreur est survenue lors de l'enregistrement de l'abonnement."
        );
        console.log(e);
        setLoading(false);
      }

      setSubmitted(false);
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
        onClick={() => saveNewSubs()}
        loading={loading}
      />
    </>
  );

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

  useEffect(() => {
    getClients();
  }, [getClients]);

  let today = new Date();

  const [date, setDate] = useState<Nullable<Date>>(today);

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
            <label htmlFor="fullname">Client</label>
            <Dropdown
              value={selectedClient}
              onChange={(e: DropdownChangeEvent) => {
                setSelectedCLient(e.value);
              }}
              options={clients}
              optionLabel="name"
              placeholder="Choisir le client"
              valueTemplate={selectedClientTemplate}
              itemTemplate={clientOptionTemplate}
              className={classNames({
                "p-invalid": submitted && !selectedClient,
              })}
              filter
              disabled={loadingClients}
            />
          </div>

          <div className="field mb-4 col-12">
            <label htmlFor="start_date">Date debut</label>
            <Calendar
              aria-label="Date debut"
              id="start_date"
              value={date}
              onChange={(e) => {
                setDate(e.value);
              }}
              dateFormat="yy-mm-dd"
              readOnlyInput
              showButtonBar
              showIcon
              className={classNames({
                "p-invalid": submitted && !date,
              })}
            />
          </div>

          <div className="field mb-4 col-12">
            <label htmlFor="price">Prix</label>
            <InputNumber
              id="price"
              onChange={(e) => onInputNewSubsChange(e.value, "price")}
              mode="currency"
              currency="USD"
              locale="fr-FR"
              min={10}
              max={100}
              className={classNames({
                "p-invalid": submitted && !newSubs.price,
              })}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DialogNewSubscription;
