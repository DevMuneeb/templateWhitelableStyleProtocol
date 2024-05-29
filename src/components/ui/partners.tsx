"use client";

import Image from "next/image";
import { useAuth } from "@/app/providers/AuthProvider";

export function Partners({}: any) {
  const { networkChain } = useAuth();
  let uniSwapURL =
    networkChain?.name === "Arbitrum One"
      ? "https://app.uniswap.org/explore/tokens/arbitrum/0x9500Ba777560daf9d3AB148ea1cf1ED39Df9eBDb"
      : "https://app.uniswap.org/explore/tokens/ethereum/0x9e91F79070926A191e41367d40aD582686f9e66D";

  return (
    <div className="relative right-0 z-10 m-3 sm:absolute sm:top-auto sm:right-0 flex flex-col items-end justify-end">
      <a href={uniSwapURL} target="_blank">
        <Image
          src="/assets/platforms/uniswap.webp"
          alt="uniswap"
          width={130}
          height={130}
          className="mr-1.5"
        />
      </a>
      <a href="https://www.mexc.com/exchange/STYLE_USDT" target="_blank">
        <Image
          src="/assets/platforms/mexc.webp"
          alt="mexc"
          width={120}
          height={120}
        />
      </a>
      <a href="https://www.bitget.com/spot/STYLEUSDT" target="_blank">
        <Image
          src="/assets/platforms/bitget.webp"
          alt="bitget"
          width={65}
          height={65}
          className="mr-2"
        />
      </a>
    </div>
  );
}
