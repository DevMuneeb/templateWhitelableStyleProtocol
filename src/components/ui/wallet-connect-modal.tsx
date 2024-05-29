"use client";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "./button";
interface WalletModalProps {
  open: boolean;
  setOpen: any;
}

export function WalletConnectModal({ open, setOpen }: WalletModalProps) {
  const { select, wallets, publicKey, disconnect } = useWallet();

  const { openConnectModal } = useConnectModal();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className=" max-w-sm">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            <h1 className="mt-6 font-bold">EVM Wallets</h1>
            <div
              onClick={() => {
                setOpen && setOpen();
                openConnectModal && openConnectModal();
              }}
              className="flex flex-row justify-start items-center cursor-pointer  rounded-lg"
            >
              <Image
                src="/assets/wallets/metaMask.svg"
                alt="metamask"
                width={50}
                height={50}
                className="rounded-lg mr-2"
              />
              <Image
                src="/assets/wallets/coinbase.svg"
                alt="coinbase"
                width={40}
                height={40}
                className="rounded-lg mr-2"
              />
              <Image
                src="/assets/wallets/walletConnect.svg"
                alt="wallectconnect"
                width={70}
                height={70}
                className="rounded-lg"
              />
              <Image
                src="/assets/wallets/rainbow.svg"
                alt="rainbow"
                width={40}
                height={40}
                className="rounded-lg"
              />
              {/* <div className="justify-start items-center size-14 shrink-0 grow-0 rounded-xl border-2">
                <div className="flex flex-row py-1">
            
                </div>
                <Separator />
                <p className="text-xs text-center">+others</p>
              </div> */}
            </div>

            <h1 className="mt-3 font-bold">Solana</h1>
            <div className="flex flex-row justify-start items-center py-2">
              {wallets.filter(
                (wallet) =>
                  wallet.readyState === "Installed" &&
                  wallet.adapter.name !== "Brave Wallet"
              ).length > 0 ? (
                wallets
                  .filter(
                    (wallet) =>
                      wallet.readyState === "Installed" &&
                      wallet.adapter.name !== "Brave Wallet"
                  )
                  .map((wallet) => (
                    <Button
                      className=" hover:bg-none p-0"
                      variant="outline"
                      key={wallet.adapter.name}
                      onClick={() => {
                        select(wallet.adapter.name);
                      }}
                    >
                      {" "}
                      <Image
                        src={wallet.adapter.icon}
                        alt={wallet.adapter.name}
                        height={40}
                        width={40}
                      />
                    </Button>
                  ))
              ) : (
                <p className="">
                  No wallet found. Please install phantom (supported Solana
                  wallet)
                </p>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
