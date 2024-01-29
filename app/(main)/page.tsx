"use client";
import { Enterprise, EnterpriseInCookie, Page } from "@/types";
import axios from "axios";
import { Button } from "primereact/button";
import Image from "next/image";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { EnterpriseContext } from "@/layout/context/enterprisecontext";
import { UserContext } from "@/layout/context/usercontext";
import { useRouter } from "next/navigation";
import { Skeleton } from "primereact/skeleton";
import { destroyCookie } from "nookies";
import Link from "next/link";

const HomePage: Page = () => {
  const { userInfo, deleteUser } = useContext(UserContext);
  const { enterprise, deleteEnterprise, saveEnterprise } = useContext(
    EnterpriseContext
  );
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // TODO Logout function
  const logOut = () => {
    deleteUser();
    deleteEnterprise();
    router.refresh();
  };

  //* Choose Enterprise
  const chooseEnterprise = (enterprise: any) => {
    let enterpriseInCookie: EnterpriseInCookie = {
      id_enterprise: enterprise.id_entreprise,
      name: enterprise.nom,
      logo: enterprise.logo,
      address: enterprise.adresse,
    };
    saveEnterprise(enterpriseInCookie);
    router.push("/enterprise/dashboard");
    // router.refresh("/enterprise/dashboard");
  };

  const token = userInfo.token;

  //* get Enterprises
  const getEnterprises = useCallback(async () => {
    await axios
      .post("/api/enterprise/list", {
        token: token,
      })
      .then((res) => {
        setEnterprises(res.data.message);
      });
  }, [token]);

  useEffect(() => {
    getEnterprises();
    setLoading(false);
  }, [getEnterprises]);

  return (
    <div className="px-5 min-h-screen justify-content-center align-content-center">
      <div className="grid justify-content-center min-h-screen align-content-center">
        <div className="lg:col-6 col-12 h-full">
          <div className="card h-full">
            <div className="flex flex-column mb-3 border-1 surface-border surface-card border-round p-2">
              <div className="flex p-4 justify-content-between border-300 border-bottom-1 w-full">
                <div className="text-900 mr-5 text-xl font-semibold">
                  VOS ENTREPRISES
                </div>
                {enterprises.length < 4 && (
                  <Button
                    type="button"
                    icon="pi pi-plus"
                    label="Ajouter"
                    className="p-button-outlined p-button-sm"
                  />
                )}
              </div>
              <div className="flex p-5">
                <div className="grid w-full">
                  {loading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="col-12 md:col-6">
                          <Skeleton width="h-12rem" height="3rem"></Skeleton>
                        </div>
                      ))
                    : enterprises.map((enterprise, index: number) => (
                        <div key={index} className="col-12 md:col-6">
                          <a
                            className="w-full p-button-outlined border-white"
                            onClick={() => chooseEnterprise(enterprise)}
                            href="#"
                          >
                            <div className="w-12 p-3 border-1 border-round align-items-center surface-border flex align-items-center8 hover:surface-100 cursor-pointer border-radius">
                              <div className="relative w-3rem h-3rem mr-2">
                                <Image
                                  src={enterprise.logo + "?" + Math.random()}
                                  alt={"Logo " + enterprise.nom}
                                  className="w-12 object-cover object-center border-3 border-primary border-circle"
                                  priority
                                  fill={true}
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  placeholder="blur"
                                  blurDataURL={enterprise.logo}
                                />
                              </div>
                              <span className="text-900 text-lg font-medium">
                                {enterprise.nom}
                              </span>
                            </div>
                          </a>
                        </div>
                      ))}
                  {}
                </div>
              </div>
            </div>
            <div className="flex justify-content-center">
              <Button
                type="button"
                icon="pi pi-power-off"
                className="p-button-outlined p-button-danger p-button-rounded"
                onClick={logOut}
                tooltip="Se déconnecter"
                tooltipOptions={{ position: "bottom" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
