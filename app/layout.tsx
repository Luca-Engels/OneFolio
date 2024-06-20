import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import React from "react";
import Providers from "@/components/auth/provider";
import {LoginButton} from "@/components/auth/LoginButton"
import { investment, user } from "@/models/model";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Roboto({ subsets: ["latin"], weight: ["100","300","400","500","700","900"]});



export const metadata: Metadata = {
  title: "OneFolio",
  description: "OneFolio ermöglicht das einfache Managen ihrer Investment über alle platformen. So halten sie den Überblick",
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
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <LoginButton className={"xl:flex hidden absolute z-10 top-10 right-10 btn-nav p-4 rounded-lg h-16 w-auto gap-2"} title={true}/>
                <div className={"flex xl:flex-row-reverse sm:flex-col flex-col xl:justify-evenly justify-between h-[calc(100dvh)]"}>
                  <div className={"w-full xl:h-full xl:pb-8 h-[90dvh] pt-16 overflow-y-auto"}>
                    {children}
                  </div>
                  <Navbar/>
                </div>
              </ThemeProvider>
            </Providers>
          </body>
        </html>
  );
}
