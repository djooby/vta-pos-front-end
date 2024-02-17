"use client";
import type { MenuModel } from "@/types";
import { useContext, useEffect, useState } from "react";
import AppSubMenu from "./AppSubMenu";
import { UserContext } from "./context/usercontext";

const AppMenu = () => {
  const { userInfo } = useContext(UserContext);
  const [role, setRole] = useState("User");

  useEffect(() => {
    if (userInfo.role) {
      userInfo.role !== "User" && setRole(userInfo.role);
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
          to: "/",
        },
      ],
    },

    {
      visible: role === "Super Admin" || role === "Admin" ? true : false,

      label: "Categorie",
      icon: "pi pi-th-large",
      items: [
        {
          label: "Liste des catégories",
          icon: "pi pi-fw pi-th-large",
          to: "/category",
          visible: true,
        },
      ],
    },
    {
      visible: true,
      label: "Produit",
      icon: "pi pi-send",
      items: [
        {
          label: "Ajouter produit",
          icon: "pi pi-fw pi-plus",
          to: "/product/new",
        },

        {
          label: "Liste des produits",
          icon: "pi pi-fw pi-box",
          to: "/product",
        },
      ],
    },

    {
      visible: true,
      label: "Commande",
      icon: "pi pi-fw pi-truck",
      items: [
        {
          label: "Liste des commandes",
          icon: "pi pi-fw pi-truck",
          to: "/order",
        },
      ],
    },

    {
      label: "Paramètre",
      icon: "pi pi-fw pi-cog",
      items: [
        {
          label: "Gestion employé",
          icon: "pi pi-fw pi-user-edit",
          items: [
            {
              label: "Ajouter employé",
              icon: "pi pi-fw pi-user-plus",
              to: "/employee/new",
            },
            {
              label: "Liste des employés",
              icon: "pi pi-fw pi-users",
              to: "/employee",
            },
          ],
          // to: "/employee",
        },
      ],
    },
  ];

  return <AppSubMenu model={model} />;
};

export default AppMenu;
