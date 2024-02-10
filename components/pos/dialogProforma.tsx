import { Demo } from "@/types";
import { Sidebar } from "primereact/sidebar";
import Proforma from "../order/proforma";

interface DialogProformaProps {
  visible: boolean;
  order: Demo.Order;
  type: string;
  onCancel: () => void;
}

const DialogProforma: React.FC<DialogProformaProps> = ({
  order,
  visible,
  onCancel,
  type,
}: DialogProformaProps) => {
  return (
    <Sidebar visible={visible} position="top" onHide={onCancel} fullScreen>
      <Proforma order={order} />
    </Sidebar>
  );
};

export default DialogProforma;
