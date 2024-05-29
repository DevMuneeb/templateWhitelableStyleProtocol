"use client";
import { navigate } from "@/actions";
import { FAQ } from "@/components/ui/faq";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useConfig } from "@/app/providers/ConfigContext";

const OrderConfirmationContent = () => {
  const envConfig = useConfig();
  const pathname = usePathname();
  return (
    <div
      className="flex flex-col gap-7"
      style={{ color: envConfig.labelColor }}
    >
      <div className="p-2">
        <h1 className="py-2 text-sm font-bold  tracking-widest">
          THANK YOU FOR THE ORDER.
        </h1>
        <p className="font-light text-sm my-4">
          The process can take up to 92h.
        </p>
        <h6 className={` text-sm font-bold`}>
          You will receive the usable version of your asset on your wallet
          automatically or send to your email.
        </h6>

        <FAQ />
        <div className="mt-4 mx-0 min-w-full flex flex-col items-center">
          <Button
            onClick={async () => await navigate(`/dashboard`)}
            className=" w-44  tracking-wider text-md font-bold mx-auto bg-white "
            type="submit"
            variant="secondary"
          >
            CLOSE
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationContent;
