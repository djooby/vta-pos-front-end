import { Demo } from "@/types";

const typeAll: Demo.GroupType[] = [
  {
    label: "Aucun",
    items: [
      {
        label: "Non définie",
        value: "Non définie",
      },
    ],
  },

  {
    label: "Maillot",
    items: [
      {
        label: "Haiti",
        value: "Haiti",
      },

      {
        label: "R.D",
        value: "R.D",
      },
    ],
  },
  {
    label: "Thermos",
    items: [
      { label: "Argent", value: "Argent" },
      { label: "Avec cuillère", value: "Avec cuillère" },
      { label: "Avec manche", value: "Avec manche" },
      { label: "Avec tête", value: "Avec tête" },
      { label: "Gluter", value: "Gluter" },
      { label: "Gris", value: "Gris" },
      { label: "Isothermique", value: "Isothermique" },
      { label: "Magique", value: "Magique" },
      { label: "Manche en argent", value: "Manche en argent" },
      { label: "Manche en or", value: "Manche en or" },
      { label: "Or", value: "Or" },
      { label: "Personnalisé", value: "Personnalisé" },
      { label: "Sans manche", value: "Sans manche" },
      { label: "Simple", value: "Simple" },
      { label: "Thermos enfant", value: "Thermos enfant" },
    ],
  },

  {
    label: "Case iPhone",
    items: [
      { label: "iPhone 6", value: "iPhone 6" },
      { label: "iPhone 7-8", value: "iPhone 7-8" },
      { label: "iPhone 7-8 plus", value: "iPhone 7-8 plus" },
      { label: "iPhone XS", value: "iPhone XS" },
      { label: "iPhone XR", value: "iPhone XR" },
      { label: "iPhone XM", value: "iPhone XM" },
      { label: "iPhone 11", value: "iPhone 11" },
      { label: "iPhone 11 Pro", value: "iPhone 11 Pro" },
      { label: "iPhone 11 Pro Max", value: "iPhone 11 Pro Max" },
      { label: "iPhone 12", value: "iPhone 12" },
      { label: "iPhone 12 Mini", value: "iPhone 12 Mini" },
      { label: "iPhone 12 Pro", value: "iPhone 12 Pro" },
      { label: "iPhone 12 Pro Max", value: "iPhone 12 Pro Max" },
      { label: "iPhone 13", value: "iPhone 13" },
      { label: "iPhone 13 Mini", value: "iPhone 13 Mini" },
      { label: "iPhone 13 Pro", value: "iPhone 13 Pro" },
      { label: "iPhone 13 Pro Max ", value: "iPhone 13 Pro Max" },
      { label: "iPhone 14", value: "iPhone 14" },
      { label: "iPhone 14 Mini", value: "iPhone 14 Mini" },
      { label: "iPhone 14 Pro", value: "iPhone 14 Pro" },
      { label: "iPhone 14 Pro Max", value: "iPhone 14 Pro Max" },
      { label: "iPhone 15", value: "iPhone 15" },
      { label: "iPhone 15 Mini", value: "iPhone 15 Mini" },
      { label: "iPhone 15 Pro", value: "iPhone 15 Pro" },
      { label: "iPhone 15 Pro Max", value: "iPhone 15 Pro Max" },
    ],
  },

  {
    label: "Case Samsung",
    items: [
      { label: "Samsung Galaxy Note", value: "Samsung Galaxy Note" },
      { label: "Samsung Galaxy S", value: "Samsung Galaxy S" },
      { label: "Samsung Galaxy A", value: "Samsung Galaxy A" },
      { label: "Samsung Galaxy J", value: "Samsung Galaxy J" },
    ],
  },

  {
    label: "Porte-clés",
    items: [
      { label: "Porte-clés rectangle", value: "Porte-clés rectangle" },
      { label: "Porte-clés carré", value: "Porte-clés carré" },
      { label: "Porte-clés rond", value: "Porte-clés rond" },
      { label: "Porte-clés cœur", value: "Porte-clés cœur" },
      { label: "Porte-clés ovale", value: "Porte-clés ovale" },
      { label: "Porte-clés personnalisé", value: "Porte-clés personnalisé" },
      { label: "Porte-clés en métal", value: "Porte-clés en métal" },
      { label: "Porte-clés en plastique", value: "Porte-clés en plastique" },
      { label: "Porte-clés en bois", value: "Porte-clés en bois" },
      { label: "Porte-clés en acrylique", value: "Porte-clés en acrylique" },
      { label: "Porte-clés décapsuleurs ", value: "Porte-clés décapsuleurs" },
    ],
  },
];

export const getTypes = (): Demo.GroupType[] => {
  return typeAll;
};
