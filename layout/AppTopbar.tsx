"use client";
import type { AppTopbarRef } from "@/types";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import AppBreadcrumb from "./AppBreadCrumb";
import { LayoutContext } from "./context/layoutcontext";
import { UserContext } from "./context/usercontext";

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
  const { onMenuToggle, showProfileSidebar, showConfigSidebar } = useContext(
    LayoutContext
  );
  const menubuttonRef = useRef(null);

  const onConfigButtonClick = () => {
    showConfigSidebar();
  };

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
  }));

  const [img, setImg] = useState("/layout/images/avatar/avatar.png");

  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    userInfo && userInfo.picture
      ? setImg(userInfo.picture)
      : setImg("/layout/images/avatar/avatar.png");
  }, [userInfo]);

  const router = useRouter();

  return (
    <div className="layout-topbar">
      <div className="topbar-start">
        <button
          ref={menubuttonRef}
          type="button"
          className="topbar-menubutton p-link p-trigger"
          onClick={onMenuToggle}
        >
          <i className="pi pi-bars"></i>
        </button>

        <AppBreadcrumb className="topbar-breadcrumb"></AppBreadcrumb>
      </div>

      <div className="topbar-end">
        <ul className="topbar-menu">
          <li className="ml-3">
            <Button
              type="button"
              icon="pi pi-shopping-bag"
              label="POS"
              rounded
              severity="success"
              className="flex-shrink-0"
              onClick={() => router.push("/pos")}
            ></Button>
          </li>

          <li className="ml-3">
            <Button
              type="button"
              icon="pi pi-cog"
              text
              rounded
              severity="secondary"
              className="flex-shrink-0"
              onClick={onConfigButtonClick}
            ></Button>
          </li>
          <li
            className="topbar-profile p-2 border-primary border-1"
            style={{ borderRadius: "50%" }}
          >
            <button
              type="button"
              className="p-link"
              onClick={showProfileSidebar}
            >
              <img alt="Profile" src={img} />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
