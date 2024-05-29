import type { Metadata } from "next";
import Header from "@/shared/Layout/header";
import {
  ConfigContextType,
  ConfigProvider,
} from "@/app/providers/ConfigContext";

export const metadata: Metadata = {
  title: "$STYLE: NEO TOKYO ACCESS",
  description:
    "Get your Citizen custom tailored in 3D, usable for Virtual Worlds and Gaming.",
};

export default async function DashboardLayout({
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

  return (
    <div>
      <Header />

      {children}
    </div>
  );
}
