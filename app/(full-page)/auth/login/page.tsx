"use client";

import { UserContext } from "@/layout/context/usercontext";
import type { Page } from "@/types";
import fonctions from "@/utils/fonctions";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useContext, useRef, useState } from "react";
import { LayoutContext } from "../../../../layout/context/layoutcontext";

const Login: Page = () => {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const { layoutConfig } = useContext(LayoutContext);
  const dark = layoutConfig.colorScheme !== "light";
  const { saveUser, setUserInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const toast = useRef<Toast | null>(null);

  const toastMessage = (status: any, message: string) => {
    var summary = status == "error" ? "Erreur!" : "Succès!";

    toast.current?.show({
      severity: status,
      summary: summary,
      detail: message,
      life: 3000,
    });
  };

  const [formData, setFormData] = useState({
    password: "",
    email: "",
  });

  const handleChange = (e: any) => {
    // Update the formData as the user types
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    // Prevent the default form submit action
    e.preventDefault();
    setSubmitted(true);
    if (
      fonctions.validateEmail(formData.email) &&
      formData.password.length > 8
    ) {
      sendDataLogin("form", formData);
    } else {
      toastMessage("error", "Veuillez compléter tous les champs.");
    }
  };

  // * google Login
  const googleLogin = async (credential: any) => {
    const dataToLogin = {
      credential: credential,
    };
    sendDataLogin("google", dataToLogin);
  };

  const sendDataLogin = async (way: string, dataLogin: any) => {
    setLoading(true);

    if (way === "form") {
      var apiLink = "/api/auth/login";
    } else {
      var apiLink = "/api/auth/google";
    }
    try {
      await axios.post(apiLink, dataLogin).then((res: any) => {
        var data = res.data;
        // ? check result status
        if (data.status == "success") {
          // * processus de Login
          // ? save User to local Storage
          var data = data.data;
          var userTosave = {
            token: data.token,
            id_user: data.id_user,
            fullname: data.fullname,
            email: data.email,
            role: data.role,
            picture: data.picture,
            date_user: data.date_user,
          };

          // * save User
          var isSaved = saveUser(userTosave);
          // ? save Enterprise
          if (isSaved) {
            // ? redirect to enterprise: home
            toastMessage("success", "Vous vous êtes connecté.");

            router.push("/");
          } else {
            //! show error
            toastMessage("error", "Une erreur est survenue. code SU-Log.");
          }
        } else {
          // ! Auth Failed
          toastMessage("error", data.data);
        }
      });
    } catch (e) {
      toastMessage(
        "error",
        "Erreur serveur, veuillez reessayer ulterieurement."
      );
      console.log(e);
    }
    setLoading(false);
  };
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1600 800"
        className="fixed left-0 top-0 min-h-screen min-w-screen"
        preserveAspectRatio="none"
      >
        <rect
          fill={dark ? "var(--primary-900)" : "var(--primary-500)"}
          width="1600"
          height="800"
        />
        <path
          fill={dark ? "var(--primary-800)" : "var(--primary-400)"}
          d="M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z"
        />
        <path
          fill={dark ? "var(--primary-700)" : "var(--primary-300)"}
          d="M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z"
        />
        <path
          fill={dark ? "var(--primary-600)" : "var(--primary-200)"}
          d="M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z"
        />
        <path
          fill={dark ? "var(--primary-500)" : "var(--primary-100)"}
          d="M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z"
        />
      </svg>
      <Toast ref={toast} />

      <div className="px-5 min-h-screen flex justify-content-center align-items-center">
        <div className="border-1 surface-border surface-card border-round py-7 px-4 md:px-7 z-1">
          <div className="mb-4">
            <div className="text-900 text-xl font-bold mb-2">CONNEXION</div>
            <span className="text-600 font-medium">
              Veuillez compléter les champs ci-dessous.
            </span>
          </div>
          <form className="flex flex-column" onSubmit={handleSubmit}>
            <span className="p-input-icon-left w-full mb-4">
              <i className="pi pi-envelope"></i>
              <InputText
                id="email"
                className={classNames(
                  "w-full md:w-25rem",
                  !fonctions.validateEmail(formData.email) && submitted
                    ? " p-invalid"
                    : ""
                )}
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </span>
            <span className="p-input-icon-left w-full mb-4">
              <i className="pi pi-lock z-2"></i>
              <Password
                id="password"
                type="text"
                className={classNames(
                  "w-full md:w-25rem ",
                  submitted && formData.password == "" ? "p-invalid" : ""
                )}
                placeholder="Mot de passe"
                name="password"
                value={formData.password}
                onChange={handleChange}
                inputClassName="w-full md:w-25rem"
                feedback={false}
                toggleMask
                inputStyle={{ paddingLeft: "2.5rem" }}
              />
            </span>
            <div className="mb-4 flex flex-wrap gap-3">
              <a className="text-600 cursor-pointer hover:text-primary cursor-pointer ml-auto transition-colors transition-duration-300">
                Mot de passe oublié ?
              </a>
            </div>
            <Button
              label="Se connecter"
              className="w-full"
              type="submit"
              loading={loading}
            ></Button>

            <span className="font-medium text-600 mt-1">
              Pas de compte ?{" "}
              <Link
                href="/auth/register"
                className="font-semibold cursor-pointer text-900 hover:text-primary transition-colors transition-duration-300"
              >
                Créez-en un.
              </Link>
            </span>
          </form>
          <Divider>
            <span className="text-600 font-medium">OU</span>
          </Divider>

          <div className="flex justify-content-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                googleLogin(credentialResponse.credential);
              }}
              onError={() => {
                console.log("Login Failed");
                toastMessage(
                  "error",
                  "Une erreur est survenue lors de votre connexion avec Google."
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
