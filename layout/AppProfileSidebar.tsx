import { useRouter } from "next/navigation";
import { Sidebar } from "primereact/sidebar";
import { useContext } from "react";
import { LayoutContext } from "./context/layoutcontext";
import { UserContext } from "./context/usercontext";

const AppProfileSidebar = () => {
  const { deleteUser, userInfo } = useContext(UserContext);
  const { layoutState, setLayoutState } = useContext(LayoutContext);

  const onProfileSidebarHide = () => {
    setLayoutState((prevState) => ({
      ...prevState,
      profileSidebarVisible: false,
    }));
  };

  const router = useRouter();

  const logOut = () => {
    router.push("/auth/login");
    deleteUser();
  };

  return (
    <Sidebar
      visible={layoutState.profileSidebarVisible}
      onHide={onProfileSidebarHide}
      position="right"
      className="layout-profile-sidebar w-full sm:w-25rem"
    >
      <div className="flex flex-column mx-auto md:mx-0">
        <span className="mb-2 font-semibold">Bienvenue</span>
        <span className="text-color-secondary font-medium mb-5">
          {userInfo ? userInfo.fullname : "Jhonathan Doe"}
        </span>

        <ul className="list-none m-0 p-0">
          <li>
            <a className="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
              <span>
                <i className="pi pi-user text-xl text-primary"></i>
              </span>
              <div className="ml-3">
                <span className="mb-2 font-semibold">Profil</span>
                <p className="text-color-secondary m-0">
                  {userInfo ? userInfo.email : "Jhondoe@vtahaiti.com"}
                </p>
              </div>
            </a>
          </li>

          <li onClick={() => logOut()}>
            <a className="cursor-pointer flex surface-border mb-3 p-3 align-items-center border-1 surface-border border-round hover:surface-hover transition-colors transition-duration-150">
              <span>
                <i className="pi pi-power-off text-xl text-primary"></i>
              </span>
              <div className="ml-3">
                <span className="mb-2 font-semibold">Se Déconnecter</span>
                <p className="text-color-secondary m-0">Fermer votre session</p>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </Sidebar>
  );
};

export default AppProfileSidebar;
