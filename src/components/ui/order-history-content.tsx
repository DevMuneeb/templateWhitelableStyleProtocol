"use client";
import { Key, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HistoryItem } from "@/components/ui/history-item";
import { getOrders } from "@/services/appService";
import { useAuth } from "@/app/providers/AuthProvider";
import { navigate } from "@/actions";
import { Loader2 } from "lucide-react";
import { ORDER_TYPE } from "@/lib/utils";
import { useConfig } from "@/app/providers/ConfigContext";

export type OrderHistoryType = {
  id: string;
  nft: string;
  payment: number;
  createdAt: string;
  completed: boolean;
  customAsset: string;
  paymentHash: string;
  updatedAt: string;
  userId: string;
  world: string;
  orderPlatform: string;
};

const OrderHistoryContent = () => {
  const envConfig = useConfig();
  const pathname = usePathname();
  const { orderHistories, isLoading } = useAuth();
  let platform = ORDER_TYPE.NEOTOKYO;
  //  pathname.includes("/style-gpt")
  //   ? ORDER_TYPE.STYLEGPT
  //   : ORDER_TYPE.MPV2POINT0;

  return (
    <div
      className="max-w-sm flex flex-col items-center justify-center gap-7"
      style={{ color: envConfig.labelColor }}
    >
      <div className="">
        <h1 className="py-3 text-lg font tracking-widest">PAST ORDERS</h1>

        <ScrollArea className="size-60 min-w-80 rounded-md">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-7 w-h-7 animate-spin" />
            </div>
          ) : orderHistories?.filter(
              (order: OrderHistoryType, idx: Key | null | undefined) =>
                order.orderPlatform === platform
            ).length > 0 ? (
            orderHistories
              ?.filter(
                (order: OrderHistoryType, idx: Key | null | undefined) =>
                  order.orderPlatform === platform
              )
              .map((order: OrderHistoryType, idx: Key | null | undefined) => (
                <HistoryItem key={idx} item={order} />
              ))
          ) : (
            <div className="flex h-full justify-center items-center">
              <p
                className={`text-foreground/75 mt-7`}
                style={{ fontSize: "12px", color: envConfig.labelColor }}
              >
                You have not submitted any NFTs.
              </p>
            </div>
          )}
        </ScrollArea>

        <div className="mt-10 min-w-full flex flex-col items-center">
          <Button
            onClick={async () => await navigate(`/dashboard`)}
            className="w-44 bg-white tracking-wider text-md font-bold"
            type="button"
            variant="secondary"
          >
            CLOSE
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryContent;
