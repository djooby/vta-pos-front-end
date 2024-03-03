"use client";
import ClientPos from "@/components/client/client";
import DialogClientList from "@/components/client/dialogClientList";
import DialogNewClient from "@/components/client/dialogNewClient";
import DialogOrderItem from "@/components/order/dialogOrderItem";
import Order from "@/components/order/order";
import CategoryList from "@/components/pos/categoriesList";
import DialogCategoryProducts from "@/components/pos/dialogCategoryProducts";
import { Demo } from "@/types";
import fonctions from "@/utils/fonctions";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";

import React, { useEffect, useState } from "react";
const MainPage: React.FC = () => {
  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<Demo.Category | null>(null);

  const handleCategorySelect = (category: Demo.Category) => {
    setSelectedCategory(category);
    setIsDialogCategoryProducts(true);
  };

  const cancelDialogCategoryProducts = () => {
    setIsDialogCategoryProducts(false);
  };

  // !==================CLIENT ==================
  let emptyClient: Demo.Client = {
    id_client: 0,
    name: "",
    phone: "",
    address: "",
    date: "",
  };
  const [client, setClient] = useState<Demo.Client>(emptyClient);

  //!  ================= PRODUCT =================
  const [isDialogCategoryProducts, setIsDialogCategoryProducts] = useState(
    false
  );

  const [subCategory, setSubCategory] = useState<Demo.SubCategory | null>(null);

  const handleProductSelect = (subCategory: Demo.SubCategory) => {
    setSubCategory(subCategory);
    setIsDialogCategoryProducts(false);
    setIsDialogorderItem(true);
  };

  //!  =============== PRODUCT ORDER =======================
  const [orderItems, setorderItems] = useState<Demo.OrderItem[]>([]);
  const [isDialogorderItem, setIsDialogorderItem] = useState<boolean>(false);

  const cancelDialogorderItem = () => {
    console.log("Action annulée");
    setIsDialogorderItem(false);
  };

  const handleProductOrder = (orderItem: Demo.OrderItem) => {
    orderItem.id_order_item = parseInt(fonctions.generateId(12));
    orderItems.push(orderItem);
    setOrder({ ...order, orderItems: orderItems });
    setIsDialogorderItem(false);
  };

  const removeProductOrder = (orderItem: Demo.OrderItem) => {
    const index = orderItems.indexOf(orderItem);
    if (index !== -1) {
      orderItems.splice(index, 1);
      setOrder({ ...order, orderItems: orderItems });
    }
  };

  //! ===== RENDEZ-VOUS=================

  let today = new Date();
  let month = today.getMonth();
  let year = today.getFullYear();
  let prevMonth = month === 0 ? 11 : month - 1;
  let prevYear = prevMonth === 11 ? year - 1 : year;
  let nextMonth = month === 11 ? 0 : month + 1;
  let nextYear = nextMonth === 0 ? year + 1 : year;

  let minDate = new Date();

  minDate.setMonth(month);
  minDate.setFullYear(prevYear);

  let maxDate = new Date();

  maxDate.setMonth(nextMonth);
  maxDate.setFullYear(nextYear);

  const [date, setDate] = useState<Nullable<Date>>(null);

  const onChangeDate = async (e: any) => {
    const newDate = fonctions.convertDateToDMY(e as Date);
    const rendez_vous = fonctions.dateFormatDMYToDMYFr(newDate);
    setRendezVous(rendez_vous);
    setOrder({ ...order, rendez_vous: rendez_vous });
  };

  const [rendezVous, setRendezVous] = useState<string>("");

  //! ==================== ORDER =========================
  let emptyOrder: Demo.Order = {
    sub_total: 0,
    discount: 0,
    total: 0,
    date: fonctions.getCurrentDate(),
    code: fonctions.generateId(6),
    status: "null",
    origin: "Central",
    rendez_vous: rendezVous,
  };
  const [order, setOrder] = useState<Demo.Order>(emptyOrder);

  useEffect(() => {
    if (order !== null) {
      let somme_totale = 0;
      // Calcul de la somme totale
      for (const element of orderItems) {
        somme_totale += element.total;
      }
      let _total =
        order?.discount > 0 ? somme_totale - order?.discount : somme_totale;

      // Vérifier si les valeurs ont changé avant de mettre à jour l'état
      if (
        _total !== order.total ||
        somme_totale !== order.sub_total ||
        JSON.stringify(orderItems) !== JSON.stringify(order.orderItems)
      ) {
        setOrder({
          ...order,
          orderItems: orderItems,
          total: _total,
          sub_total: somme_totale,
        });
      }
    }
  }, [order, orderItems]);

  const handleDiscount = (discount: number) => {
    if (discount > 0) {
      setOrder({ ...order, discount: discount });
    }
  };
  // !========= CLIENT ===========================

  const [isVisibleDialogClient, setIsVisibleDialogClient] = useState<boolean>(
    false
  );

  const [isVisibleNewClient, setIsVisibleNewClient] = useState<boolean>(false);

  const handleSelectClient = (client: Demo.Client) => {
    setClient(client);
    setOrder({ ...order, client: client });
    setIsVisibleDialogClient(false);
  };

  const handleCancelDialogClient = () => {
    setIsVisibleDialogClient(false);
  };

  const handleNewClient = () => {
    setIsVisibleDialogClient(false);
    setIsVisibleNewClient(true);
  };

  const handleCancelNewDialogClient = () => {
    setIsVisibleNewClient(false);
  };

  const handleConfirmNewClient = (client: Demo.Client) => {
    setClient(client);
    setOrder({ ...order, client: client });
    setIsVisibleNewClient(false);
  };

  return (
    <div className="grid">
      <div className="col-12 md:col-4">
        <CategoryList onCategorySelect={handleCategorySelect} />
      </div>
      <div className="col-12 md:col-8">
        <div className=" card">
          <div className="flex align-items-center justify-content-between mb-3">
            <div className="text-900 text-xl font-semibold">Client</div>
            <Button
              type="button"
              icon="pi pi-plus"
              label="Choisir client"
              outlined
              size="small"
              onClick={() => setIsVisibleDialogClient(true)}
            ></Button>
          </div>

          <ClientPos client={client} />
        </div>

        {/*! rendez-vous */}

        <div className=" card">
          <div className="flex align-items-center justify-content-between mb-3">
            <div className="text-900 text-xl font-semibold">Rendez-vous</div>
          </div>

          <Calendar
            id="rendez-vous"
            dateFormat="yy-mm-dd"
            className="w-full"
            minDate={minDate}
            showIcon
            value={date}
            onChange={(e) => {
              setDate(e.value);
              onChangeDate(e.value);
            }}
          />
        </div>

        <Order
          orderItems={orderItems}
          rendezVous={rendezVous}
          order={order}
          client={client}
          remove={removeProductOrder}
          onDiscount={handleDiscount}
        />
      </div>

      <DialogCategoryProducts
        visible={isDialogCategoryProducts}
        title="Liste des articles"
        onCancel={cancelDialogCategoryProducts}
        onConfirm={handleProductSelect}
        data={selectedCategory}
      />

      <DialogOrderItem
        visible={isDialogorderItem}
        title="Configuration commande"
        onCancel={cancelDialogorderItem}
        onConfirm={handleProductOrder}
        data={subCategory}
      />

      <DialogClientList
        newClient={handleNewClient}
        visible={isVisibleDialogClient}
        title="Choisir client"
        onConfirm={handleSelectClient}
        onCancel={handleCancelDialogClient}
      />

      <DialogNewClient
        visible={isVisibleNewClient}
        onCancel={handleCancelNewDialogClient}
        title="Ajouter client"
        onConfirm={handleConfirmNewClient}
      />
    </div>
  );
};

export default MainPage;
