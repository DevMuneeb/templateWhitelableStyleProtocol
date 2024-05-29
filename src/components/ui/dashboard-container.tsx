import React from "react";
import Image from "next/image";
import NftUploadForm from "@/components/ui/nft-upload-form";
import { ConfigContextType } from "@/app/providers/ConfigContext";

export async function DashboardContainer() {
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

  const TARGET_SYMBOL =
    config.currencySymbol || process.env.NEXT_PUBLIC_TARGET_SYMBOL || "";
  let usdTo: any = {
    BNB: 0,
    SOL: 0,
    ETH: 0,
    MATIC: 0,
    AVAX: 0,
    USDT: 0,
    STYLE: 0,
  };
  const response = await fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BNB,SOL,ETH,MATIC,AVAX,USDT,${TARGET_SYMBOL}&api_key=c6e59741df9f6c531a95544244b4a7908508a8b276cb6c4bd144e722ada87915`
  );
  const responseMEXC = await fetch(
    "https://www.mexc.com/api/platform/spot/market-v2/web/deals?symbolId=23496cb3505149588c0bbc79407d8873"
  );

  const responseCoinCap = await fetch(
    `https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=USD&convert=${TARGET_SYMBOL}`,
    {
      headers: {
        "X-CMC_PRO_API_KEY": "7716d67f-4205-44f7-b50a-01ad30a7f389",
      },
    }
  );

  let stylePrice = 0.0;
  if (responseMEXC.ok) {
    const prices = await responseMEXC.json();
    if (prices && prices?.data?.deals && prices?.data?.deals?.length > 0) {
      stylePrice = parseFloat(prices.data.deals[0].p);
    }
  }
  // peopleops@digisquadian.com
  if (response.ok) {
    const data = await response.json();

    usdTo = {
      BNB: data?.BNB || 0,
      SOL: data?.SOL || 0,
      ETH: data?.ETH || 0,
      MATIC: data?.MATIC || 0,
      AVAX: data?.AVAX || 0,
      USDT: data?.USDT || 0,
      STYLE: stylePrice,
      [TARGET_SYMBOL]: data?.[TARGET_SYMBOL] || 0,
    };
  }
  if (responseCoinCap.ok) {
    const data = await responseCoinCap.json();
    usdTo[TARGET_SYMBOL] =
      data?.data[0].quote?.[TARGET_SYMBOL]?.price || usdTo[TARGET_SYMBOL];
  }

  return (
    <div className="min-h-screen w-full rounded-md  relative flex flex-col items-center justify-center antialiased">
      <div className=" max-w-full sm:max-w-2xl md:w-5/12 lg:w-3/12 mt-10">
        <div className="w-full aspect-square items-center justify-center">
          <div className="relative z-10 py-1 flex flex-col items-center justify-center">
            <img
              src={config.logo || process.env.NEXT_PUBLIC_LOGO || ""}
              alt="logo"
              width="80"
              height="80"
            />
          </div>
          <div className="relative z-10 p-6 ">
            <NftUploadForm usdTo={usdTo} />
          </div>
        </div>
      </div>
    </div>
  );
}
