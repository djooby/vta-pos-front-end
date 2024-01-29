import { Metadata } from "next";
import React from "react";

interface FullPageLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "VTA - connexion",
  description: "Veuillez vous connecter a votre compte VTA.",
  icons: {
    icon: "./../logo/icon-bg.jpg",
  },
};

export default function FullPageLayout({ children }: FullPageLayoutProps) {
  return <React.Fragment>{children}</React.Fragment>;
}
