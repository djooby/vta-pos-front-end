"use client";
import { UserContext } from "@/layout/context/usercontext";
import { Page } from "@/types";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

const Delete: Page = () => {
  const { deleteUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    deleteUser();
    router.push("/auth/login");
  }, [, deleteUser, router]);
  return (
    <>
      <div className="px-5 min-h-screen flex justify-content-center align-items-center">
        <div className="z-1 text-center">
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
          <p className="line-height-3 mt-0 mb-5 text-700 text-sm font-medium">
            Chargement en cours...
          </p>
        </div>
      </div>
    </>
  );
};
export default Delete;
