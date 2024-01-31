"use client";
import type { ChildContainerProps, User, UserContextProps } from "@/types";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import React, { useState } from "react";

export const UserContext = React.createContext({} as UserContextProps);

export const UserProvider = (props: ChildContainerProps) => {
  const cookies = parseCookies();
  const user = cookies["user"];
  let userData = user && JSON.parse(user);

  let theUser: User = {
    token: userData?.token,
    id_user: userData?.id_user,
    fullname: userData?.fullname,
    email: userData?.email,
    role: userData?.role,
    picture: userData?.picture,
    date_user: userData?.date_user,
  };

  const [userInfo, setUserInfo] = useState<User>(theUser);

  const saveUser = (data: any) => {
    try {
      setCookie(null, "user", JSON.stringify(data), {
        path: "/",
        maxAge: 28800,
      });

      setCookie(null, "role", data.role, {
        path: "/",
        maxAge: 28800,
      });

      return true;
    } catch (e) {
      return false;
    }
  };

  const deleteUser = () => {
    destroyCookie(null, "user", { path: "/", maxAge: 0 });
    destroyCookie(null, "role", { path: "/", maxAge: 0 });
  };

  const value = {
    userInfo,
    setUserInfo,
    saveUser,
    deleteUser,
  };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
};
