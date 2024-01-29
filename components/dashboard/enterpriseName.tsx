"use client";
import { EnterpriseContext } from "@/layout/context/enterprisecontext";
import { UserContext } from "@/layout/context/usercontext";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

export default function EnterpriseName() {
  const { userInfo } = useContext(UserContext);
  const { enterprise } = useContext(EnterpriseContext);

  const [nom, setNom] = useState("");
  const [logo, setLogo] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");

  const allowedRoles = ["Super Admin", "Admin"];

  useEffect(() => {
    if (enterprise) {
      setRole(userInfo.role);
      setNom(enterprise.name);
      setLogo(enterprise.logo);
      setAddress(enterprise.address);
    }
  }, [enterprise, userInfo.role]);

  return (
    <div className="grid">
      <div className="col-12">
        <div className="flex flex-column sm:flex-row align-items-center gap-4">
          <div className="flex flex-column sm:flex-row align-items-center gap-3">
            <img
              alt="logo"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) =>
                (e.currentTarget.src = "/c-logo.jpg")
              }
              src={logo + "?" + Math.random()}
              style={{ borderRadius: "50%" }}
              className="w-4rem h-4rem flex-shrink-0  border-2 border-primary"
            />
            <div className="flex flex-column align-items-center sm:align-items-start">
              <span className="text-900 font-bold text-4xl">{nom}</span>
              <p className="text-600 m-0">{address}</p>
            </div>
          </div>
          {allowedRoles.includes(role) && (
            <div className="flex gap-2 sm:ml-auto">
              <Link href="/enterprise/account">
                <i className="pi pi-plus p-button-rounded p-button p-button-outlined"></i>
              </Link>
              <Link
                href="/enterprise/transfer/new"
                className="p-button p-button-rounded"
              >
                Ajouter Transfert
              </Link>
              <Link href="/enterprise/account/remove">
                <i className="pi pi-minus p-button-rounded p-button p-button-outlined"></i>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
