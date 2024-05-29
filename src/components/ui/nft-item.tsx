/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export type NFTItem = {
  idx: number;
  nftId: object;
  nft_url: string;
  nftname: string;
  nftValue: string;
};

interface NFTitemProps {
  isLoading: boolean;
  nft: NFTItem;
  selectedItem: NFTItem;
  onClick?: (e: any) => void;
}

export function NFTItem({
  isLoading,
  nft,
  selectedItem,
  onClick,
}: // setSelected,
NFTitemProps) {
  return (
    <div className="group cursor-pointer relative" onClick={onClick}>
      {isLoading ? (
        <Skeleton className="size-16 rounded-xl" />
      ) : (
        <img
          src={nft.nft_url}
          alt={nft.nftname}
          width="150"
          height="150"
          className={`size-16 object-cover  transition-transform transform scale-100 group-hover:scale-105  ${
            nft.idx === selectedItem.idx ? "border-black border-4" : ""
          } `}
        />
      )}
      {/* {nft.idx === selectedItem.idx && (
        <div className="absolute object-right top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black size-16 bg-opacity-50 rounded-lg transition-transform transform scale-100 group-hover:scale-105">
          <Image
            src="/assets/accept.png"
            alt="accept"
            width="30"
            height="30"
            className="absolute h-[30px] w-[30px] object-right top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      )} */}
    </div>
  );
}
