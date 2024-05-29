"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailConnectSchema, connectFormSchema } from "@/interfaces/auth";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { useAuth } from "@/app/providers/AuthProvider";
import { WalletConnectModal } from "@/components/ui/wallet-connect-modal";
import { navigate } from "@/actions";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccountModal, useChainModal } from "@rainbow-me/rainbowkit";
import { useConfig } from "@/app/providers/ConfigContext";

const EmailAuthForm = () => {
  const envConfig = useConfig();
  const { walletAddress, setEmail, isLoading } = useAuth();
  const { openConnectModal } = useConnectModal();
  const [open, setOpen] = useState(false);

  const form = useForm<EmailConnectSchema>({
    resolver: zodResolver(connectFormSchema),
  });

  const onSubmit = async (data: EmailConnectSchema) => {
    if (!walletAddress) {
      openConnectModal && openConnectModal();
    }
    setEmail(data.email);
  };

  const goToTerms = async () => {
    await navigate("/terms-conditions");
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        // className={`${envConfig.labelColor}`}
        style={{ color: envConfig.labelColor }}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`tracking-widest text-md font-bold`}>
                EMAIL *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  className={`rounded-none h-12`}
                  style={{ color: envConfig.inputColor }}
                  {...field}
                />
              </FormControl>
              {/* <FormDescription style={{ fontSize: "11px" }}>
                By signing up you agree to our{" "}
                <span
                  onClick={() => goToTerms()}
                  className="cursor-pointer underline underline-offset-1"
                >
                  Terms & Conditions
                </span>
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-9 mx-0 min-w-full flex flex-col items-center">
          <Button
            disabled={isLoading ? true : false}
            className=" w-2/4 tracking-wider text-md font-bold bg-white"
            type="submit"
            variant="secondary"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin " />}
            CONNECT
          </Button>
        </div>
        {/* <WalletConnectModal open={open} setOpen={setOpen} /> */}
      </form>
    </FormProvider>
  );
};

export default EmailAuthForm;
