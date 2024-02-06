// FullCalendar Types

// Chart.js Types
import { ChartData, ChartOptions } from "chart.js";

// Custom Types
type InventoryStatus = "INSTOCK" | "LOWSTOCK" | "OUTOFSTOCK";
type Status = "DELIVERED" | "PENDING" | "RETURNED" | "CANCELLED";
type SmallFolder = Omit<BaseFolder, "icon"> & {
  icon: "pi pi-folder" | "pi pi-images" | "pi pi-folder-open";
};
type LargeFolder = Omit<BaseFolder, "icon"> & {
  icon: "pi pi-folder" | "pi pi-image" | "pi pi-folder-open";
};
type Icon =
  | "pi pi-image"
  | "pi pi-file-excel"
  | "pi pi-file-pdf"
  | "pi pi-ellipsis-v"
  | "pi pi-folder"
  | "pi pi-images"
  | "pi pi-folder-open";
type Color = "bg-yellow-500" | "bg-pink-500" | "bg-green-500" | "bg-indigo-500";
type LightColor =
  | "bg-yellow-100"
  | "bg-pink-100"
  | "bg-green-100"
  | "bg-indigo-100";
type MailKeys =
  | "important"
  | "starred"
  | "trash"
  | "spam"
  | "archived"
  | "sent";

// Exported Types
export type LayoutType = "list" | "grid";
export type SortOrderType = 1 | 0 | -1;

// Interfaces
export interface CustomEvent {
  name?: string;
  status?: "Ordered" | "Processing" | "Shipped" | "Delivered";
  date?: string;
  color?: string;
  icon?: string;
  image?: string;
}

interface ShowOptions {
  severity?: string;
  content?: string;
  summary?: string;
  detail?: string;
  life?: number;
}

export interface ChartDataState {
  barData?: ChartData;
  pieData?: ChartData;
  lineData?: ChartData;
  polarData?: ChartData;
  radarData?: ChartData;
}
export interface ChartOptionsState {
  barOptions?: ChartOptions;
  pieOptions?: ChartOptions;
  lineOptions?: ChartOptions;
  polarOptions?: ChartOptions;
  radarOptions?: ChartOptions;
}

// Demo Namespace
declare namespace Demo {
  // Interfaces
  interface Base {
    name: string;
    icon: Icon;
    objectURL?: string;
  }

  interface IFile extends Base {
    date: string;
    fileSize: string;
  }

  interface Metric extends Base {
    title: string;
    icon: "pi pi-ellipsis-v";
    fieldColor: Color;
    color: LightColor;
    files: string;
    fileSize: string;
  }

  interface BaseFolder extends Base {
    size: string;
  }
  interface Task {
    id?: number;
    name?: string;
    description?: string;
    completed?: boolean;
    status?: string;
    comments?: string;
    attachments?: string;
    members?: Member[];
    startDate?: string;
    endDate?: string;
  }

  interface DialogConfig {
    visible: boolean;
    header: string;
    newTask: boolean;
  }

  interface User {
    id: number;
    name: string;
    image: string;
    status: string;
    messages: Message[];
    lastSeen: string;
  }

  type Category = {
    id_category: string;
    category_name: string;
    image: string;
    created_by: string;
    date: string;
    product_quantity: number;
    products?: Product[];
  };

  //ProductService
  type Product = {
    id_product?: string;
    code: string;
    category: string;
    color: string;
    size: string;
    type?: string;
    cost: number;
    sale_price: number;
    quantity: number;
    alert_quantity: number;
    created_by?: string;
    image?: string;
    status?: InventoryStatus;
    attribute?: Attribute[];
    orders?: ProductOrder[];
    [key: string]:
      | string
      | string[]
      | number
      | boolean
      | undefined
      | ProductOrder[]
      | Attribute[]
      | InventoryStatus
      | File[];
  };

  type Attribute = {
    id_product_attribute?: string;
    id_product?: string;
    attribute_name?: string;
    attribute_value?: string;
  };

  type Client = {
    id_client: number;
    name: string;
    phone: string;
    address?: string;
  };

  type OrderProduct = {
    id_order_product?: string;
    id_order?: string;
    category: string;
    image?: string;
    size: string;
    color: string;
    type?: string;
    code?: string;
    service: string;
    quantity: number;
    price: number;
    total: number;
  };

  type Order = {
    id_oder?: string;
    client: Client;
    subTotal: number;
    discount: number;
    total: number;
    status?: string;
    deliveryDate?: string;
    orderProducts?: OrderProduct[];
    date: string;
    code: string;
  };


  type Payment = {
    id_order?: number;
    name: string;
    amount: number;
    paid?: boolean;
    date: string;
  };

  // PhotoService
  type Photo = {
    title: string;
    itemImageSrc?: string | undefined;
    thumbnailImageSrc?: string | undefined;
    alt?: string | undefined;
  };

  // IconService
  type Icon = {
    icon?: {
      paths?: string[];
      attrs?: [{}];
      isMulticolor?: boolean;
      isMulticolor2?: boolean;
      grid?: number;
      tags?: string[];
    };
    attrs?: [{}];
    properties?: {
      order?: number;
      id: number;
      name: string;
      prevSize?: number;
      code?: number;
    };
    setIdx?: number;
    setId?: number;
    iconIdx?: number;
  };
}
