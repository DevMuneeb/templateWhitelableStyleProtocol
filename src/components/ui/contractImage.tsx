"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

export function ContractImage({}: any) {
  return (
    <div className="relative bottom-0 left-0 z-10 p-4 pl-6 sm:absolute sm:top-auto sm:bottom-0 sm:left-0">
      <h4 className="text-xs mb-3">$STYLE Contracts</h4>
      <div className="mb-3">
        <p className="text-xs">On ERC20:</p>
        <div className="flex flex-row items-center justify-center">
          <p className="text-xs truncate">
            0x9e91F79070926A191e41367d40aD582686f9e66D
          </p>
          <Copy
            onClick={() => {
              navigator.clipboard.writeText(
                "0x9e91F79070926A191e41367d40aD582686f9e66D"
              );
              toast("Copied to clipboard!");
            }}
            className="ml-2 h-3 w-3 cursor-pointer"
          />
        </div>
      </div>
      <div className="">
        <p className="text-xs">On ARB:</p>
        <div className="flex flex-row items-center justify-center">
          <p className="text-xs truncate">
            0x9500Ba777560daf9d3AB148ea1cf1ED39Df9eBDb
          </p>
          <Copy
            onClick={() => {
              navigator.clipboard.writeText(
                "0x9500Ba777560daf9d3AB148ea1cf1ED39Df9eBDb"
              );
              toast("Copied to clipboard!");
            }}
            className="ml-2 h-3 w-3 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
