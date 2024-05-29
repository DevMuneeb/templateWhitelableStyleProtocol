/** @format */

"use client";

import { navigate } from "@/actions";
import { useAuth } from "@/app/providers/AuthProvider";
import { useConfig } from "@/app/providers/ConfigContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MainNav } from "@/components/ui/main-nav";
import { NavItem } from "@/components/ui/nav-item";
import { OrderHistoryType } from "@/components/ui/order-history-content";
import { ORDER_TYPE } from "@/lib/utils";
import { useAccountModal, useChainModal } from "@rainbow-me/rainbowkit";
import { useWallet } from "@solana/wallet-adapter-react";
import { Copy, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { Key, useState } from "react";

export function DisconnectModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: () => void;
}) {
  const { disconnect, publicKey } = useWallet();
  const { logout } = useAuth();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" min-h-48 w-80">
        <DialogHeader>
          <DialogTitle className=" flex justify-center items-center">
            Phantom Wallet
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className=" text-center flex  justify-between items-center flex-row">
          <Button
            variant="outline"
            className=" flex justify-center items-center flex-col h-20  rounded-sm  mt-1"
            onClick={() => {
              publicKey && navigator.clipboard.writeText(publicKey?.toString());
            }}
          >
            <p>{publicKey?.toString().substring(0, 8)}....</p>
            <Copy></Copy>
          </Button>
          <Button
            variant="outline"
            className=" flex justify-center items-center flex-col h-20  rounded-sm "
            onClick={() => {
              logout();
              disconnect();
              navigate("/");
            }}
          >
            <p>Disconnect</p>
            <LogOut />
          </Button>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

const Header = ({ showItems = true }) => {
  const envConfig = useConfig();
  const pathname = usePathname();
  const [solanaDisconnectModalIsOpen, setsolanaDisconnectModalIsOpen] =
    useState(false);
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { disconnect } = useWallet();
  const { walletAddress, networkChain, orderHistories } = useAuth();
  // let platform = pathname.includes("/style-gpt")
  //   ? ORDER_TYPE.STYLEGPT
  //   : ORDER_TYPE.MPV2POINT0;
  let platform = envConfig.identifier;
  return (
    <header className="fixed top-0 z-50 w-full text-white">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        {showItems && (
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end ">
            <nav className="flex items-center gap-6 text-md">
              {orderHistories?.filter(
                (order: OrderHistoryType, idx: Key | null | undefined) =>
                  order.orderPlatform === platform
              ).length > 0 && (
                <NavItem
                  onClick={async () => await navigate("/order-history")}
                  route={"/order-history"}
                  name={"MY ORDERS"}
                />
              )}
              {networkChain && (
                <NavItem onClick={() => {}} route={"eth"} name={"ETH"} />
              )}
              {walletAddress && (
                <NavItem
                  onClick={() => {
                    // if (networkChain?.name == "Solana") {
                    //   setsolanaDisconnectModalIsOpen(true);
                    //   // disconnect();
                    // } else {
                    openAccountModal && openAccountModal();
                    // }
                  }}
                  route={"chain"}
                  name={
                    walletAddress &&
                    `${walletAddress?.substring(
                      0,
                      7
                    )}.....${walletAddress?.slice(-6)}`
                  }
                  classes="max-w-36"
                />
              )}
            </nav>
          </div>
        )}
      </div>
      {/* {solanaDisconnectModalIsOpen && (
        <DisconnectModal
          open={solanaDisconnectModalIsOpen}
          setOpen={() => {
            setsolanaDisconnectModalIsOpen(!solanaDisconnectModalIsOpen);
          }}
        />
      )} */}
    </header>
  );
};

export default Header;
