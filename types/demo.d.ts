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
    id_task?: number;
    id_order?: string;
    id_order_item?: number;
    completed?: boolean;
    description?: string;
    status?: string;
    date?: string;
    created_by?: string;
    quantity?: string;
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
    quantity: number;
    products?: Product[];
  };

  type Product = {
    subCategory?: SubCategory;
    id_product: string;
    id_sub_category: string;
    product_name: string;
    type: string;
    price: number;
    image: string;
  };
  type ProductImages = {
    id_product_images?: string;
    id_product: string;
    url: string;
  };

  //ProductService
  type SubCategory = {
    id_sub_category?: string;
    code: string;
    category: string;
    color: string;
    size: string;
    type: string;
    cost: number;
    sale_price: number;
    quantity: number;
    alert_quantity: number;
    created_by?: string;
    image?: string;
    status?: InventoryStatus;
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

  type Client = {
    id_client: number;
    name: string;
    phone: string;
    address: string;
    date: string;
  };

  type OrderItem = {
    id_order_item?: number;
    id_order?: string;
    id_sub_category: string;
    category: string;
    image?: string;
    size: string;
    color: string;
    type: string;
    code?: string;
    service: string;
    quantity: number;
    price: number;
    total: number;
    status?: string;
    created_by?: string;
  };

  type Order = {
    id_order?: string;
    client?: Client;
    sub_total: number;
    discount: number;
    total: number;
    status?: string;
    delivery_date?: string;
    orderItems?: OrderItem[];
    date: string;
    code: string;
    rendez_vous?: string;
    origin: string;
  };

  type Payment = {
    id_payment?: number;
    id_order?: number;
    amount: number;
    created_by?: string;
    date: string;
  };

  type Employee = {
    id_employee?: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    poste: string;
    role: string;
    salary: number;
    address: string;
    date: string;
    image?: string;
    password?: string;
  };

  type Subscription = {
    id_subcription?: string;
    id_client?: string;
    client?: string;
    start_date: string;
    end_date: string;
    price: number;
    status: string;
    created_date?: string;
    created_by?: string;
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
