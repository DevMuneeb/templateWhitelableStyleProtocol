import React from "react";
import Image from "next/image";
import NftUploadGenerate from "@/components/ui/nft-upload-generate";

const StyleGPTScreen = async () => {
  let usdTo = {
    BNB: 0,
    SOL: 0,
    ETH: 0,
    MATIC: 0,
    AVAX: 0,
    USDT: 0,
    STYLE: 0,
  };
  const response = await fetch(
    "https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BNB,SOL,ETH,MATIC,AVAX,USDT&api_key=c6e59741df9f6c531a95544244b4a7908508a8b276cb6c4bd144e722ada87915"
  );
  const responseMEXC = await fetch(
    "https://www.mexc.com/api/platform/spot/market-v2/web/deals?symbolId=23496cb3505149588c0bbc79407d8873"
  );

  let stylePrice = 0.0;
  if (responseMEXC.ok) {
    const prices = await responseMEXC.json();
    if (prices && prices?.data?.deals && prices?.data?.deals?.length > 0) {
      stylePrice = parseFloat(prices.data.deals[0].p);
    }
  }

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
    };
  }
  return (
    <div className="min-h-screen w-full rounded-md bg-white relative flex flex-col items-center justify-center antialiased">
      <div className="sm:max-w-2xl lg:w-3/12">
        <div className="w-full aspect-square items-center justify-center">
          <div className="relative z-10 py-1 flex flex-col items-center justify-center">
            <Image
              src="/assets/logo/STYLEAnimatedLogo.gif"
              alt="Main"
              width="80"
              height="80"
            />
          </div>
          <div className="px-10">
            <NftUploadGenerate usdTo={usdTo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleGPTScreen;
