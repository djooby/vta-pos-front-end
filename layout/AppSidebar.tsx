import Link from "next/link";
import { useContext } from "react";
import AppMenu from "./AppMenu";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import { LayoutState } from "../types/layout";
import { Image } from "primereact/image";

const AppSidebar = () => {
  const { setLayoutState } = useContext(LayoutContext);
  const anchor = () => {
    setLayoutState((prevLayoutState: LayoutState) => ({
      ...prevLayoutState,
      anchored: !prevLayoutState.anchored,
    }));
  };
  return (
    <>
      <div className="sidebar-header">
        <Link href="/" className="app-logo">
          <Image
            src="/logo/icon.png"
            alt="Logo"
            className="app-logo-normal"
            width="150"
          />
          <Image
            src="/logo/icon.png"
            alt="Logo"
            className="app-logo-small"
            width="50"
          />
        </Link>
        <button
          className="layout-sidebar-anchor p-link z-2 mb-2"
          type="button"
          onClick={anchor}
        ></button>
      </div>

      <div className="layout-menu-container">
        <MenuProvider>
          <AppMenu />
        </MenuProvider>
      </div>
    </>
  );
};

export default AppSidebar;
