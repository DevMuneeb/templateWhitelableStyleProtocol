import React from "react";

import Image from "next/image";
import { BackgroundBeams } from "@/shared/Root/background-beams";
import OrderConfirmationContent from "@/components/ui/order-confirmation-content";
import { ConfigContextType } from "@/app/providers/ConfigContext";

const ConfirmationScreen = async () => {
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
      <div className=" max-w-full sm:mx-w-xl  sm:pl-4 md:w-[17rem]">
        <div className="w-full aspect-square items-center justify-center">
          <div className="relative z-10 py-1 flex flex-col items-center justify-center">
            <img
              src={config.logo || process.env.NEXT_PUBLIC_LOGO || ""}
              alt="logo"
              width="80"
              height="80"
            />
          </div>
          <div>
            <OrderConfirmationContent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;
