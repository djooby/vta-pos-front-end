import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Tableau de bord - VTA Entreprise",
  description: "The dashboard page",
};

export default function DashboardLayout(props: { children: React.ReactNode }) {
  return <div className="grid">{props.children}</div>;
}
