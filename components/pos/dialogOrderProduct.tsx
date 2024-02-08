"use client";
import { Demo } from "@/types";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState } from "react";

interface DialogOrderProduct {
  visivle: boolean;
  title: string;
  onConfirm: (product: Demo.OrderProduct) => void;
  onCancel: () => void;
  data: Demo.Product | null;
}

const DialogOrderProduct: React.FC<DialogOrderProduct> = (props) => {
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

  const saveOrderProduct = () => {
    setSubmitted(true);

    if (orderProduct.price > 0 && orderProduct.quantity > 0) {
      orderProduct.total = orderProduct.price * orderProduct.quantity;
      orderProduct.category = props.data?.category as string;
      orderProduct.code = props.data?.code as string;
      orderProduct.color = props.data?.color as string;
      orderProduct.size = props.data?.size as string;
      orderProduct.type = props.data?.type as string;
      toastMessage("success", "Article ajouté avec succès.");
      props.onConfirm(orderProduct);
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
        onClick={() => saveOrderProduct()}
      />
    </>
  );

  const listeService = ["Normal", "Personnalisé"];
  const [selectedService, setSelectedService] = useState<string>("Normal");

  let emptyOrderProduct: Demo.OrderProduct = {
    id_product: "",
    category: "",
    size: "",
    color: "",
    service: selectedService,
    quantity: 1,
    price: 0,
    total: 0,
  };
  const [orderProduct, setOrderProduct] = useState<Demo.OrderProduct>(
    emptyOrderProduct
  );

  useEffect(() => {
    if (props.data) {
      setOrderProduct({
        id_product: props.data?.id_product as string,
        category: props.data?.category as string,
        size: props.data?.size as string,
        color: props.data?.color as string,
        service: selectedService,
        quantity: 1,
        price: props.data?.sale_price as number,
        total: 0,
      });
    }
  }, [props.data, selectedService]);

  const onInputChange = (value: any, name: any) => {
    let _orderProduct: any = { ...orderProduct };
    _orderProduct[`${name}`] = value;
    setOrderProduct(_orderProduct);
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        position="top"
        visible={props.visivle}
        header={props.title + ": " + props.data?.code}
        onHide={props.onCancel}
        className="max-h-screen"
        footer={dialogFooter}
      >
        <div className="grid formgrid p-fluid mt-2">
          <div className="field mb-4 col-12">
            <label htmlFor="service">Service</label>
            <Dropdown
              id="service"
              options={listeService}
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.value);
                onInputChange(e.value, "service");
              }}
              className={classNames({
                "p-invalid": submitted && !orderProduct.service,
              })}
            ></Dropdown>
          </div>

          <div className="field mb-4 col-12">
            <label htmlFor="price">Prix unitaire</label>
            <InputNumber
              id="price"
              placeholder="Entrer le prix unitaire"
              value={orderProduct.price}
              disabled={selectedService == "Normal" ? true : false}
              onChange={(e) => onInputChange(e.value, "price")}
              className={classNames({
                "p-invalid": submitted && !orderProduct.price,
              })}
            />
          </div>
          <div className="field mb-4 col-12">
            <label htmlFor="quantity">Quantité</label>
            <InputNumber
              id="quantity"
              value={1}
              placeholder="Entrer la quantité"
              onValueChange={(e) => onInputChange(e.value, "quantity")}
              className={classNames({
                "p-invalid": submitted && !orderProduct.quantity,
              })}
              min={1}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DialogOrderProduct;
