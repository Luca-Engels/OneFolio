import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import React from "react";
import Providers from "@/components/auth/provider";
import {LoginButton} from "@/components/auth/LoginButton"
import { ModeToggle } from "@/components/themeButton";
import { AdvertBar } from "@/components/addsBar/AdvertBar";

import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Roboto({ subsets: ["latin"], weight: ["100","300","400","500","700","900"]});



export const metadata: Metadata = {
  title: "OneFolio",
  description: "OneFolio ermöglicht das einfache Managen ihrer Investment über alle Platformen. So halten sie den Überblick",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default"
  },
  icons: {
    shortcut: "/images/favicon.ico",
    apple: "/images/logo512.png",
    icon: "/images/logo512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
          <head>
            <link rel="manifest" href="/manifest.json" />  
          </head>
          <body className={inter.className}>
            <Providers>
              <LoginButton className={"xl:flex hidden absolute z-10 top-8 right-8 btn-nav p-4 rounded-lg h-16 w-auto gap-2"} title={true}/>
              <ModeToggle className={"absolute z-10 top-8 right-52 btn-nav p-4 xl:rounded-lg w-fit hidden xl:flex"} iconClass="h-7 w-7"/>
              <div className={"flex xl:flex-row-reverse sm:flex-col flex-col justify-between h-[calc(100dvh)]"}>
                <AdvertBar />
                <div className={"xl:w-[70vw] xl:h-full xl:pb-8 h-[90dvh] xl:pt-12 pt-8 overflow-y-auto"}>
                  {children}
                </div>
                <Navbar/>
              </div>
            </Providers>
            <SpeedInsights/>
          </body>
        </html>
  );
}
