import React from "react";
import Image from "next/image";
import OrderHistoryContent from "@/components/ui/order-history-content";
import { ConfigContextType } from "@/app/providers/ConfigContext";

const OrderHistoryScreen = async () => {
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
  } catch (error) {
    console.error("Failed to fetch configuration:", error);
  }

  return (
    <div className="min-h-screen w-full rounded-md  relative flex flex-col items-center justify-center antialiased">
      <div className="sm:max-w-2xl md:w-5/12 lg:w-3/12">
        <div className="w-full aspect-square items-center justify-center">
          <div className="relative z-10 py-1 flex flex-col items-center justify-center">
            <img
              src={config.logo || process.env.NEXT_PUBLIC_LOGO || ""}
              alt="logo"
              width="80"
              height="80"
            />
          </div>
          <div className="">
            <OrderHistoryContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryScreen;
