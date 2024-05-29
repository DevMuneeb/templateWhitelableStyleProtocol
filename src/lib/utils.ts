import { Network } from "alchemy-sdk";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Public_Sans } from "next/font/google";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const IdToChainNameAlchemy = {
  Ethereum: Network.ETH_MAINNET,
  Polygon: Network.MATIC_MAINNET,
  "Arbitrum One": Network.ARB_MAINNET,
};

export const ACTIVITIES = {
  "2D IMAGE GENERATED": "2D IMAGE GENERATED",
  "3D IMAGE GENERATED": "3D IMAGE GENERATED",
  "ORDER SUBMITTED": "ORDER SUBMITTED",
  "NFT SELECTED": "NFT SELECTED",
  "CUSTOM ASSET UPLOADED SUCCESSFULLY": "CUSTOM ASSET UPLOADED SUCCESSFULLY",
};
export const ORDER_TYPE = {
  STYLEGPT: "STYLEGPT",
  MPV2POINT0: "MPV2POINT0",
  NEOTOKYO: "NEOTOKYO",
};

export const pb_sans = Public_Sans({ subsets: ["latin"] });
