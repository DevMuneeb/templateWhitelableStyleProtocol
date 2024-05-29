/* eslint-disable @next/next/no-img-element */
import { Suspense } from "react";
import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import "@uniswap/widgets/fonts.css";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { AssetsProvider } from "@/app/providers/AssetsProvider";
import { RainbowKitToolProvider } from "@/app/providers/RainbowKitToolProvider";
import {
  ConfigContextType,
  ConfigProvider,
} from "@/app/providers/ConfigContext";
// import { SolanaConnectionProvider } from "@/app/providers/SolanaConnectionProvider";
import GoogleCaptchaWrapper from "@/app/providers/GoogleCaptchaWrapper";

import localFont from "next/font/local";

// Font files can be colocated inside of `app`
const PPNeueMonteral = localFont({
  src: [
    {
      path: "./../fonts/PPNeueMontreal-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./../fonts/PPNeueMontreal-Medium.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: `$STYLE: ${process.env.NEXT_PUBLIC_TITLE}`,
  description:
    "Select the NFT that you would like to use in gaming and the metaverse.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let config: ConfigContextType = {
    logo: "",
    bgImage: "",
    labelColor: "",
    inputColor: "",
    tokenAddress: "",
    tokenABI: "",
    cost: "",
    navTitle: "",
    identifier: "",
    slogan: "",
    currencySymbol: "",
    collectionContract: "",
  };

  try {
    // Fetch configuration data
    const configResponse = await fetch(
      process.env.NEXT_PUBLIC_ENV_URL as string
    );

    if (!configResponse.ok) {
      throw new Error("Network response was not ok");
    }

    const { data } = await configResponse.json();
    config = data;

    // Dynamically set metadata from config
    metadata.title = `$STYLE: ${config.navTitle}`;
  } catch (error) {
    console.error("Failed to fetch configuration:", error);
  }

  // console.log(config);

  return (
    <html lang="en">
      <body className={`${PPNeueMonteral.className} relative w-full h-screen`}>
        <img
          alt="BACKGROUND"
          className=" blur-sm object-cover w-full h-full bg-no-repeat absolute"
          src={config.bgImage || process.env.NEXT_PUBLIC_BACKGROUND_IMAGE || ""}
        />
        <ThemeProvider attribute="class" defaultTheme="light">
          <Suspense fallback={<></>}>
            <ConfigProvider value={config}>
              {/* <SolanaConnectionProvider> */}
              <RainbowKitToolProvider>
                <GoogleCaptchaWrapper>
                  <AuthProvider>
                    <AssetsProvider>{children}</AssetsProvider>
                    <Toaster />
                  </AuthProvider>
                </GoogleCaptchaWrapper>
              </RainbowKitToolProvider>
              {/* </SolanaConnectionProvider> */}
            </ConfigProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
