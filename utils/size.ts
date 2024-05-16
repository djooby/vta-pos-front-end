// utils/size.ts

import { Demo } from "@/types";

const sizeAll: Demo.GroupType[] = [
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
      { label: "Youth XS", value: "Youth XS" },
      { label: "Youth Small", value: "Youth Small" },
      { label: "Youth Medium", value: "Youth Medium" },
      { label: "Youth Large", value: "Youth Large" },
      { label: "XS", value: "XS" },
      { label: "S", value: "S" },
      { label: "M", value: "M" },
      { label: "L", value: "L" },
      { label: "XL", value: "XL" },
      { label: "XXL", value: "XXL" },
      { label: "XXXL", value: "XXXL" },
    ],
  },
  {
    label: "Once",
    items: [
      { label: "11 oz", value: "11 oz" },
      { label: "12 oz", value: "12 oz" },
      { label: "13 oz", value: "13 oz" },
      { label: "14 oz", value: "14 oz" },
      { label: "15 oz", value: "15 oz" },
      { label: "16 oz", value: "16 oz" },
      { label: "18 oz", value: "18 oz" },
      { label: "20 oz", value: "20 oz" },
      { label: "30 oz", value: "30 oz" },
    ],
  },
];

export const getSizes = (): Demo.GroupType[] => {
  return sizeAll;
};
