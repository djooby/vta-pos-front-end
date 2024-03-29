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
      visible:
        role === "Super Admin" || role === "Administrateur" ? true : false,
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
      visible:
        role === "Super Admin" ||
        role === "Administrateur" ||
        role === "Secrétaire"
          ? true
          : false,

      label: "Internet",
      icon: "pi pi-th-large",
      items: [
        {
          label: "Abonnement internet",
          icon: "pi pi-fw pi-globe",
          to: "/internet",
          visible: true,
        },
      ],
    },

    {
      visible:
        role === "Super Admin" ||
        role === "Administrateur" ||
        role === "Secrétaire"
          ? true
          : false,

      label: "Catégorie",
      icon: "pi pi-th-large",
      items: [
        {
          label: "Liste des catégories",
          icon: "pi pi-fw pi-th-large",
          to: "/category",
          visible: true,
        },

        {
          label: "Sous-catégories",
          icon: "pi pi-fw pi-hashtag",
          // to: "/sub_category",
          visible: true,
          items: [
            {
              label: "Ajouter",
              icon: "pi pi-fw pi-plus",
              to: "/sub_category/new",
            },
            {
              label: "Lister",
              icon: "pi pi-fw pi-list",
              to: "/sub_category",
            },
          ],
        },
      ],
    },

    {
      visible: false,
      label: "Produit",
      icon: "pi pi-box",
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
      visible:
        role === "Super Admin" || role === "Administrateur" ? true : false,
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
        },
      ],
    },
  ];

  return <AppSubMenu model={model} />;
};

export default AppMenu;
