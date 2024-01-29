"use client";
import type { MenuModel } from "@/types";
import { useContext, useEffect, useState } from "react";
import AppSubMenu from "./AppSubMenu";
import { UserContext } from "./context/usercontext";

const AppMenu = () => {
  const { userInfo } = useContext(UserContext);
  const [role, setRole] = useState("Super Admin");

  useEffect(() => {
    if (userInfo.role) {
      setRole(userInfo.role);
    }
  }, [userInfo.role]);

  const model: MenuModel[] = [
    {
      visible: role === "Super Admin" || role === "Admin" ? true : false,
      label: "Accueil",
      icon: "pi pi-home",
      items: [
        {
          label: "Tableau de bord",
          icon: "pi pi-fw pi-chart-bar",
          to: "/dashboard",
        },
      ],
    },
    {
      visible: role === "Super Admin" || role === "Admin" ? true : false,
      label: "Produit",
      icon: "pi pi-send",
      items: [
        {
          label: "Ajouter produit",
          icon: "pi pi-fw pi-plus",
          to: "/product/new",
          visible: role === "Super Admin" || role === "Admin" ? true : false,
        },

        {
          label: "Liste des produits",
          icon: "pi pi-fw pi-box",
          to: "/product",
          visible: role === "Super Admin" || role === "Admin" ? true : false,
        },
      ],
    },

    {
      visible: role === "Super Admin" ? true : false,
      label: "Paramètre",
      icon: "pi pi-fw pi-building",
      items: [
        {
          label: "Gestion employé",
          icon: "pi pi-fw pi-users",
          to: "/employee",
        },
      ],
    },
  ];

  return <AppSubMenu model={model} />;
};

export default AppMenu;
