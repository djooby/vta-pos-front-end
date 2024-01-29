"use client";
import { LayoutProvider } from "../layout/context/layoutcontext";

import { UserProvider } from "@/layout/context/usercontext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ProgressLoader } from "nextjs-progressloader";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
import "../styles/demo/Demos.scss";
import "../styles/layout/layout.scss";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const googleId = process.env.NEXT_PUBLIC_GOOGLE_ID_CLIENT as string;
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link
          id="theme-link"
          href={`/theme/theme-light/blue/theme.css`}
          rel="stylesheet"
        ></link>
        <link rel="icon" type="image/x-icon" href="/logo/icon-bg.jpg"></link>
      </head>
      <body>
        <ProgressLoader color="#00b236" showSpinner={false} />
        <PrimeReactProvider>
          <UserProvider>
            <GoogleOAuthProvider clientId={googleId}>
              <LayoutProvider>{children}</LayoutProvider>
            </GoogleOAuthProvider>
          </UserProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
