"use client";
import CategoryList from "@/components/pos/categoriesList";
import DialogCategoryProducts from "@/components/pos/dialogCategoryProducts";
import DialogOrderProduct from "@/components/pos/dialogOrderProduct";
import Order from "@/components/pos/order";
import { Demo } from "@/types";
import fonctions from "@/utils/fonctions";
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
    // Traitement à effectuer lorsque l'utilisateur annule
    console.log("Action annulée");
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
  const [product, setProduct] = useState<Demo.Product | null>(null);

  const handleProductSelect = (product: Demo.Product) => {
    setProduct(product);
    setIsDialogCategoryProducts(false);
    setIsDialogOrderProduct(true);
  };

  //!  =============== PRODUCT ORDER =======================
  const [orderProducts, setOrderProducts] = useState<Demo.OrderProduct[]>([]);
  const [orderProduct, setOrderProduct] = useState<Demo.OrderProduct>();
  const [isDialogOrderProduct, setIsDialogOrderProduct] = useState<boolean>(
    false
  );

  const cancelDialogOrderProduct = () => {
    console.log("Action annulée");
    setIsDialogOrderProduct(false);
  };

  const handleProductOrder = (orderProduct: Demo.OrderProduct) => {
    orderProduct.id_order_product = parseInt(fonctions.generateId(12));
    orderProducts.push(orderProduct);
    setOrder({ ...order, orderProducts: orderProducts });
    setIsDialogOrderProduct(false);
  };

  const removeProductOrder = (orderProduct: Demo.OrderProduct) => {
    const index = orderProducts.indexOf(orderProduct);
    if (index !== -1) {
      orderProducts.splice(index, 1);
      setOrder({ ...order, orderProducts: orderProducts });
    }
  };

  //! ==================== ORDER =========================
  let emptyOrder: Demo.Order = {
    subTotal: 0,
    discount: 0,
    total: 0,
    date: "",
    code: "",
    status: "null",
  };
  const [order, setOrder] = useState<Demo.Order>(emptyOrder);

  useEffect(() => {
    if (order !== null) {
      let somme_totale = 0;
      // Calcul de la somme totale
      for (const element of orderProducts) {
        somme_totale += element.total;
      }
      let _total =
        order?.discount > 0 ? somme_totale - order?.discount : somme_totale;

      // Vérifier si les valeurs ont changé avant de mettre à jour l'état
      if (
        _total !== order.total ||
        somme_totale !== order.subTotal ||
        JSON.stringify(orderProducts) !== JSON.stringify(order.orderProducts)
      ) {
        setOrder({
          ...order,
          orderProducts: orderProducts,
          total: _total,
          subTotal: somme_totale,
        });
      }
    }
  }, [order, orderProducts]);

  const handleDiscount = (discount: number) => {
    if (discount > 0) {
      setOrder({ ...order, discount: discount });
    }
  };
  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <CategoryList onCategorySelect={handleCategorySelect} />
      </div>
      <div className="col-12 md:col-6">
        <Order
          orderProducts={orderProducts}
          order={order}
          client={client}
          remove={removeProductOrder}
          onDiscount={handleDiscount}
        />
      </div>

      <DialogCategoryProducts
        visivle={isDialogCategoryProducts}
        title="Liste des articles"
        onCancel={cancelDialogCategoryProducts}
        onConfirm={handleProductSelect}
        data={selectedCategory}
      />

      <DialogOrderProduct
        visivle={isDialogOrderProduct}
        title="Configuration commande"
        onCancel={cancelDialogOrderProduct}
        onConfirm={handleProductOrder}
        data={product}
      />
    </div>
  );
};

export default MainPage;
