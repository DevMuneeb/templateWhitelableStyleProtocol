/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { OrderHistoryType } from "./order-history-content";

export interface OrderHistory {
  item: OrderHistoryType;
}

export function HistoryItem({ item }: OrderHistory) {
  return (
    <>
      <h1
        className="py-2 text-lg  tracking-widest w-full"
        style={{ letterSpacing: "7px" }}
      >
        DATE {new Date(item.createdAt).toLocaleDateString()}
      </h1>
      <div className="pb-4 w-60">
        <div className="flex flex-row justify-start items-center">
          <img
            src={item.nft || item.customAsset}
            alt="nft"
            width="80"
            height="80"
            className="rounded-md"
          />
          <div className="ml-4 flex flex-col justify-between w-6/12">
            <h2 className="text-md tracking-wide">
              {item.orderPlatform === "STYLEGPT"
                ? "AI Creation Environment"
                : "NFT Environment"}
            </h2>
            <p
              className={`font-light text-md ${
                item.completed ? "text-green-500" : "text-orange-500"
              }`}
            >
              {item.completed ? "Done" : "In Process"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
