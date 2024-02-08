import { Demo } from "@/types";
import { Sidebar } from "primereact/sidebar";
import Invoice from "../orders/invoice";

interface DialogInvoiceProps {
  visible: boolean;
  order: Demo.Order;
  type: string;
  onCancel: () => void;
}

const DialogInvoice: React.FC<DialogInvoiceProps> = ({
  order,
  visible,
  onCancel,
  type,
}: DialogInvoiceProps) => {
  return (
    <Sidebar visible={visible} position="top" onHide={onCancel} fullScreen>
      <Invoice order={order} type={type} />
    </Sidebar>
  );
};


export default DialogInvoice;
