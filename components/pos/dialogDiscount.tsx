"use client";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useEffect, useRef, useState } from "react";

interface DiscountProps {
  visible: boolean;
  title: string;
  value: number;
  onConfirm: (discount: number) => void;
  onCancel: () => void;
}

const DialogDiscount: React.FC<DiscountProps> = (props) => {
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

  const saveDiscount = () => {
    setSubmitted(true);

    if (discount && discount > 0) {
      props.onConfirm(discount);
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
        onClick={() => saveDiscount()}
      />
    </>
  );

  const [discount, setDiscount] = useState<number | null>(0);

  useEffect(() => {
    if (props.value && props.value > 0) {
      setDiscount(props.value);
    }
  }, [props.value]);

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
      >
        <div className="grid formgrid p-fluid mt-2">
          <div className="field mb-4 col-12">
            <label htmlFor="discount">Discount</label>
            <InputNumber
              id="discount"
              value={discount}
              placeholder="Entrer le disocunt"
              onValueChange={(e) => e.value && setDiscount(e.value)}
              className={classNames({
                "p-invalid": submitted && !discount,
              })}
              min={1}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DialogDiscount;
