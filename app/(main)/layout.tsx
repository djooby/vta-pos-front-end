import { Metadata } from "next";
import Layout from "../../layout/layout";
interface MainLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Tableau de bord - VTA",
  description: "Dashboard of VTA.",
  robots: { index: false, follow: false },
  icons: {
    icon: "./../logo/icon-bg.jpg",
  },
};

export default function MainLayout({ children }: MainLayoutProps) {
  return <Layout>{children}</Layout>;
}
