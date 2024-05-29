"use client";
import { ChainId, Token, WETH9, CurrencyAmount } from "@uniswap/sdk-core";
import { Web3 } from "web3";
import { Pair } from "@uniswap/v2-sdk";
import { Route } from "@uniswap/v2-sdk";
import { SwapWidget, lightTheme } from "@uniswap/widgets";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Ban, Loader2, Plus, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NFTItem } from "@/components/ui/nft-item";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import data from "./../../data/tokens.json";
import { ethers } from "ethers";
import { writeContract, PrepareWriteContractConfig } from "@wagmi/core";
import { prepareWriteContract } from "@wagmi/core";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { worlds } from "@/mocks";
import { addOrder, logNEOActivity } from "@/services/appService";
import { useAuth } from "@/app/providers/AuthProvider";
import { useAssets } from "@/app/providers/AssetsProvider";
import { NFTConnectSchema, nftFormSchema } from "@/interfaces/auth";
import { navigate, uploadFile } from "@/actions";
import { ACTIVITIES, ORDER_TYPE } from "@/lib/utils";
import {
  useContractWrite,
  usePrepareContractWrite,
  useSendTransaction,
} from "wagmi";

// import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Utils } from "alchemy-sdk";

import * as solanaWeb3 from "@solana/web3.js";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { useConfig } from "@/app/providers/ConfigContext";
const lamports_per_sol = solanaWeb3.LAMPORTS_PER_SOL;
const recieverwalletEth = "0x31a93aBa8A5FC94840e63EE288D5f38917D4E1CC";
const recieverwalletSolana = "9B6ZkDv7DkF8hP3QrbhHyNCorAkGNjQibT6YEPcYhFsf";
const increasedCost = 148;
const WBTC = "0x9e91F79070926A191e41367d40aD582686f9e66D";
const WBTCARB = "0x9500Ba777560daf9d3AB148ea1cf1ED39Df9eBDb";

const NftUploadForm = ({ usdTo }: { usdTo?: any }) => {
  const envConfig = useConfig();
  const [cost, setCost] = useState<number>(parseInt(envConfig.cost) || 100);
  const TARGET_SYMBOL =
    envConfig.currencySymbol || process.env.NEXT_PUBLIC_TARGET_SYMBOL || "";
  // const cost: any = envConfig.cost || process.env.NEXT_PUBLIC_COST || 5;
  const abiERC20 =
    JSON.parse(envConfig.tokenABI || "[]") ||
    JSON.parse(process.env.NEXT_TOKEN_TRANSFER_ABI || "[]");
  const [open, setOpen] = useState(false);
  const [hasStyle, setHasStyle] = useState(false);
  const [styleBalance, setstyleBalance] = useState(0);
  const [customFileName, setCustomFileName] = useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // const { connection } = useConnection();
  // const { sendTransactionAsync } = useSendTransaction();
  // const { wallet, publicKey, signTransaction, sendTransaction, signMessage } =
  //   useWallet();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { loading, assets, fetchAssets } = useAssets();
  const { walletAddress, networkChain, walletConnector, loggedUser } =
    useAuth();
  const [isPending, setisPending] = useState<boolean>(false);
  const [isDisabled, setisDisabled] = useState<boolean>(true);

  const invite_code = searchParams.get("invite_code");

  const BYTESValueInUSD = (usdTo[TARGET_SYMBOL] || 0) * cost;

  const adjustedBalance = Web3.utils.toWei(BYTESValueInUSD, "ether");

  // const balance = ethers.BigNumber.from(
  //   Math.floor(styleAmountToPay).toString()
  // );
  // const adjustedBalance = ethers.BigNumber.from(balance).mul(
  //   ethers.BigNumber.from(10).pow(18)
  // );

  // Convert adjusted balance to string
  // const balance = ethers.BigNumber.from(Math.floor(styleValueInUSDT)); // Convert to integer
  // const adjustedBalanceString = balance.toString();

  const form = useForm<NFTConnectSchema>({
    resolver: zodResolver(nftFormSchema),
  });

  const [selected, setSelected] = useState<any>({});
  const [customAsset, setCustomAsset] = useState<string>("");

  const { config } = usePrepareContractWrite({
    address:
      (envConfig.tokenAddress as `0x${string}`) ||
      (process.env.NEXT_PUBLIC_TOKEN_ADDRESS_TARGET as `0x${string}`),
    abi: abiERC20,
    functionName: "transfer",
    chainId: 1,
    args: [recieverwalletEth, adjustedBalance],
  });
  const { writeAsync, error, isError } = useContractWrite(config);

  const getSymbolByChain = (chain: string) => {
    switch (chain) {
      case "Polygon":
        return "MATIC";
      case "Ethereum":
        return "ETH";
      case "Arbitrum One":
        return "ETH";
      case "BNB Smart Chain":
        return "BNB";
      case "Solana":
        return "SOL";
      case "zkSync Era":
        return "ETH";
      default:
        return "";
    }
  };

  const getConvertedCost = (chain: string, costToBeMultiplied: number) => {
    switch (chain) {
      case "Polygon":
        return usdTo.MATIC * costToBeMultiplied;
      case "Ethereum":
        return usdTo.ETH * costToBeMultiplied;
      case "Arbitrum One":
        return usdTo.ETH * costToBeMultiplied;
      case "BNB Smart Chain":
        return usdTo.BNB * costToBeMultiplied;
      case "Solana":
        return usdTo.SOL * costToBeMultiplied;
      case "zkSync Era":
        return usdTo.ETH * costToBeMultiplied;
      default:
        return usdTo.ETH * costToBeMultiplied;
    }
  };
  function bytesToEth(
    bytesAmount: number,
    usdToBytesRate: number,
    usdToEthRate: number
  ) {
    // Convert USD to ETH
    let eth = (bytesAmount / usdToBytesRate) * usdToEthRate;

    return eth;
  }

  const handleAssetOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    if (e.target.files) {
      setisDisabled(false);
      setCustomFileName(e.target.files[0].name);
      formData.append("customAsset", e.target.files[0]);
      const { status, message } = await uploadFile(formData);
      if (status === "success") {
        console.log(message);
        setCustomAsset(message);

        await handleNEOLog(
          ACTIVITIES["CUSTOM ASSET UPLOADED SUCCESSFULLY"],
          message
        );
      } else {
        console.log(message);
        toast(message);
      }
    } else {
      setisDisabled(true);
    }
  };

  const handleNFTSelection = async (asset: any) => {
    await handleNEOLog(ACTIVITIES["NFT SELECTED"], asset.nft_url);
  };

  useEffect(() => {
    if (walletAddress && networkChain) {
      fetchAssets(walletAddress, networkChain?.name);
    }
  }, [walletAddress, networkChain]);

  const onSubmit = useCallback(
    async (data: NFTConnectSchema, e: any) => {
      if (!executeRecaptcha) return;
      (async () => {
        try {
          if (
            (!selected.nft_url && !customAsset) ||
            (selected.nft_url && customAsset)
          ) {
            throw new Error("Either 'nft' or 'customAsset' must be provided");
          }
          const allowedChains = ["Ethereum"];

          if (!allowedChains.includes(networkChain?.name)) {
            throw new Error("Invalid Chain Switch to a supported chain");
          }
          setisPending(true);
          let transactionHash = "";
          let paymentType = "";
          let costToPay = 0;
          let Totalbytes = cost * (usdTo[TARGET_SYMBOL] || 0);
          costToPay = Totalbytes;

          if (writeAsync) {
            const data = await writeAsync();
            transactionHash = data.hash;
            paymentType = TARGET_SYMBOL;
          } else {
            throw new Error("Insufficient Funds");
          }
          // if (e.nativeEvent.submitter.name === "submitButton2") {
          //   // const CHAINID =
          //   //   networkChain?.name === "Ethereum"
          //   //     ? ChainId.MAINNET
          //   //     : ChainId.ARBITRUM_ONE;

          //   // setStyleAmountToPay(
          //   //   ethers.BigNumber.from(
          //   //     Math.floor(Value_of_STYLE_in_USDT).toString()
          //   //   )
          //   // );
          //   // const delay = (ms: any) =>
          //   //   new Promise((resolve) => setTimeout(resolve, ms));
          //   // await delay(1000);
          //   if (writeAsync) {
          //     const data = await writeAsync();
          //     transactionHash = data.hash;
          //     paymentType = "STYLE";
          //   }
          // } else {
          //   if (networkChain.name === "Solana" && publicKey) {
          //     const connection = new solanaWeb3.Connection(
          //       "https://blue-billowing-water.solana-mainnet.discover.quiknode.pro/38acb8eba1b4693d47228ff6a6fd896bc0c46381/"
          //     );

          //     const balance = await connection.getBalance(
          //       new solanaWeb3.PublicKey(publicKey)
          //     );

          //     const message =
          //       "Please confirm that you are on the  Mainnet before proceeding with any transactions. Transactions on the Mainnet are live and permanent.";
          //     const encodedMessage = new TextEncoder().encode(message);

          //     if (signMessage) {
          //       const signedMessage = await signMessage(encodedMessage);
          //       if (balance <= getConvertedCost(networkChain?.name, cost)) {
          //         toast("insufficient balance");
          //         return;
          //       }

          //       if (!signedMessage) {
          //         toast("must sign a message to continue");
          //         return;
          //       }
          //     }

          //     const {
          //       context: { slot: minContextSlot },
          //       value: { blockhash, lastValidBlockHeight },
          //     } = await connection.getLatestBlockhashAndContext();

          //     // let blockhash = await connection.getLatestBlockhash("finalized");
          //     // blockhash.lastValidBlockHeight;
          //     const lamports = Math.ceil(
          //       getConvertedCost(networkChain?.name, cost) *
          //         solanaWeb3.LAMPORTS_PER_SOL
          //     );
          //     const instructions = [
          //       solanaWeb3.SystemProgram.transfer({
          //         fromPubkey: new solanaWeb3.PublicKey(publicKey),

          //         toPubkey: new solanaWeb3.PublicKey(
          //           "9B6ZkDv7DkF8hP3QrbhHyNCorAkGNjQibT6YEPcYhFsf"
          //         ),
          //         lamports: lamports,
          //       }),
          //     ];
          //     const messageV0 = new solanaWeb3.TransactionMessage({
          //       payerKey: new solanaWeb3.PublicKey(publicKey),
          //       recentBlockhash: blockhash,
          //       instructions,
          //     }).compileToV0Message();

          //     const transaction = new solanaWeb3.VersionedTransaction(
          //       messageV0
          //     );
          //     let signature = await sendTransaction(transaction, connection, {
          //       minContextSlot,
          //     });

          //     await connection.confirmTransaction({
          //       blockhash,
          //       lastValidBlockHeight,
          //       signature,
          //     });
          //     transactionHash = signature;
          //   } else {
          //     const data = await sendTransactionAsync({
          //       to: recieverwalletEth,
          //       value: Utils.parseEther(costToPay.toString()).toBigInt(),
          //       gasPrice: Utils.parseUnits("10", "gwei").toBigInt(), // Replace "10" with your desired gas price in Gwei
          //     });
          //     transactionHash = data.hash;
          //   }
          // }

          // if (!transactionHash || transactionHash === "") {
          //   throw new Error("Invalid Transaction Hash");
          // }

          let uploadData: any = {
            payment: costToPay.toString() + TARGET_SYMBOL,
            paymentHash: transactionHash,
            chain: networkChain?.name,
            connector: walletConnector?.name,
            world: data.world,
            nft: "",
            nft_meta: "",
            customAsset: "",
            orderPlatform: envConfig.identifier,
            styleAmout: styleBalance.toString(),
          };
          if (invite_code) {
            uploadData.referral_code = invite_code;
          }
          if (data.customAsset) {
            uploadData.customAsset = customAsset;
            delete uploadData.nft;
          }
          if (selected.nft_url) {
            uploadData.nft = selected.nft_url;
            uploadData.nft_meta = selected?.nftId;
            delete uploadData.customAsset;
          }
          const grToken = await executeRecaptcha("generateNeoTokyoOrder");
          const response = await addOrder(
            {
              ...uploadData,
              grToken,
            },
            loggedUser
          );
          if (!response.ok) throw new Error("Issue occured! Try later");
          await handleNEOLog(
            ACTIVITIES["ORDER SUBMITTED"],
            uploadData.customAsset ?? uploadData.nft
          );
          toast("Completed");
          setisPending(false);
          await navigate(`/confirmation`);
        } catch (error: any) {
          console.log({ error });
          toast(error.message);
          setisPending(false);
        }
      })();
    },
    [
      customAsset,
      executeRecaptcha,
      loggedUser,
      networkChain?.name,
      pathname,
      invite_code,
      selected.nft_url,
      walletConnector?.name,
    ]
  );

  const handleNEOLog = async (activity: string, url: string) => {
    try {
      await logNEOActivity(
        {
          action: activity,
          mediaOrUrl: url,
          platform: envConfig.identifier,
        },
        loggedUser
      );
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStyleHoldAmount = async (addr: string, chain: string) => {
    try {
      const resp = await fetch(
        `/api/tokenbalance?walletAddress=${addr}&chain=${chain}`
      );

      if (resp?.ok) {
        const data: any = await resp.json();
        setstyleBalance(parseInt(data?.balance));
        if (data && data?.balance && parseInt(data?.balance) >= 1000) {
          setHasStyle(true);
        }
      } else {
        setHasStyle(false);
      }
    } catch (error) {
      console.log(error);
      setHasStyle(false);
    }
  };

  useEffect(() => {
    if (walletAddress && networkChain?.name) {
      fetchStyleHoldAmount(walletAddress, networkChain?.name);
    }
  }, [walletAddress, networkChain]);

  console.log(error, isError);

  return (
    <div className="w-full m-auto" style={{ color: envConfig.labelColor }}>
      <Label
        className="tracking-widest text-sm font-bold self-start"
        htmlFor="choose"
      >
        CHOOSE NFT
      </Label>
      <ScrollArea className="size-40    p-2 mt-2 w-full mb-4 bg-transparent  ">
        <div
          className={
            assets && assets.length > 0
              ? `grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-2`
              : `size-36 w-full`
          }
        >
          {assets && assets.length > 0 ? (
            assets.map((asset, index) => (
              <NFTItem
                isLoading={loading}
                nft={asset}
                key={index}
                selectedItem={selected}
                onClick={(e) => {
                  if (asset.idx === selected.idx) {
                    setSelected({});
                    setisDisabled(true);
                    setCost(100);
                  } else {
                    if (
                      JSON.parse(asset.nftId).contract ===
                      envConfig.collectionContract
                    ) {
                      setCost(80);
                    } else {
                      let collectionCost: any =
                        envConfig.cost || process.env.NEXT_PUBLIC_COST || 100;
                      setCost(collectionCost);
                    }
                    setSelected(asset);
                    handleNFTSelection(asset);
                    setisDisabled(false);
                  }
                }}
              />
            ))
          ) : (
            <div className="flex h-full justify-center items-center">
              <p style={{ fontSize: "13px", color: envConfig.labelColor }}>
                You are not holding any NFTs in the connected wallet.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="flex flex-col justify-center items-center  mt-4 w-full sm:max-w-2xl md:w-5/12 lg:w-3/12 m-auto">
        <Label className="tracking-widest text-sm font-bold" htmlFor="or">
          OR
        </Label>
      </div>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid w-full max-w-sm items-center gap-4 mb-3">
            <FormField
              control={form.control}
              name="customAsset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="tracking-widest text-sm font-bold">
                    UPLOAD
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      {customFileName !== "" && (
                        <div className="flex w-full items-center justify-end mb-1">
                          <X
                            onClick={() => {
                              setCustomFileName("");
                              form.reset({
                                customAsset: undefined,
                                world: form.getValues().world,
                              });
                              if (!selected.nftId) setisDisabled(true);
                            }}
                            className="h-4 w-4 cursor-pointer"
                          />
                        </div>
                      )}
                      <Input
                        disabled={selected.nftId && true}
                        className="hidden"
                        id="customAsset"
                        type="file"
                        accept="image/*,.gif"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (
                              file.type.startsWith("image/") ||
                              file.name.toLowerCase().endsWith(".gif")
                            ) {
                              field.onChange(e);
                              // do your own change event
                              handleAssetOnChange(e);
                            } else {
                              // Handle invalid file type
                              toast(
                                "Invalid file type. Please upload an image or a GIF."
                              );
                            }
                          }
                        }}
                        value={field.value}
                      />
                      <FormLabel htmlFor="customAsset">
                        <div className="border flex w-full h-9 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium cursor-pointer">
                          {customFileName !== "" ? (
                            customFileName
                          ) : selected.nftId ? (
                            <Ban className="h-3 w-3" />
                          ) : (
                            <Plus className="h-3 w-3" />
                          )}
                        </div>
                      </FormLabel>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="world"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="tracking-widest text-sm font-bold">
                    SELECT WORLD
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} {...field}>
                      <SelectTrigger className="text-black rounded-none h-12">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent
                        style={{
                          position: "absolute",
                          zIndex: 100,
                          top: "auto",
                          bottom: 0,
                        }}
                        className="rounded-none"
                        position="popper"
                      >
                        <SelectGroup>
                          {worlds.map((world, idx) => (
                            <SelectItem key={idx} value={world}>
                              {world}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="my-2 flex justify-between relative">
            <div className="flex flex-col items-start space-y-1">
              <Label className="tracking-widest text-sm" htmlFor="access">
                ACCESS:
              </Label>
              <Label className="tracking-widest text-sm " htmlFor="fee">
                FEE:
              </Label>
            </div>
            <div className="flex flex-col items-end space-y-1 overflow-hidden">
              <Label className="tracking-widest text-sm " htmlFor="style">
                1.000 STYLE
              </Label>
              <Label className="tracking-widest text-sm " htmlFor="style">
                {(cost * (usdTo[TARGET_SYMBOL] || 0)).toFixed(3)}{" "}
                {TARGET_SYMBOL}
              </Label>
              {/* <Label
                className="tracking-widest absolute  left-[15.5rem] top-4 whitespace-nowrap"
                htmlFor="eth"
              >
                <span className="tracking-widest text-destructive text-clip  line-through mr-2">
                  {getConvertedCost(networkChain?.name, increasedCost).toFixed(
                    2
                  )}
                  {getSymbolByChain(networkChain?.name)}
                </span>
                {getConvertedCost(networkChain?.name, cost).toFixed(2)}
                {getSymbolByChain(networkChain?.name)} {"// "}
                <span className="tracking-widest truncate sm:normal-words">
                  LISTING WEEK DISCOUNT
                </span>
              </Label> */}
            </div>
          </div>

          <div className="mt-7 mx-0 min-w-full flex flex-col items-center">
            {hasStyle ? (
              <div className="w-full flex flex-row items-center justify-between">
                <Button
                  disabled={isPending || !form.formState.isValid ? true : false}
                  className=" w-36 tracking-wider text-md font-bold mx-auto bg-white"
                  type="submit"
                  variant="secondary"
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  PROCEED
                </Button>
              </div>
            ) : (
              <div className="w-full flex flex-row items-center justify-between ">
                <Dialog>
                  <DialogTrigger
                    className="w-full"
                    disabled={
                      isPending || !form.formState.isValid ? true : false
                    }
                  >
                    <Button
                      disabled={
                        isPending || !form.formState.isValid ? true : false
                      }
                      className=" w-36  tracking-wider text-md font-bold mx-auto self-center bg-white"
                      type="button"
                      variant="secondary"
                    >
                      {isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      PROCEED
                    </Button>
                  </DialogTrigger>
                  <DialogContent className=" bg-white max-w-md rounded-none mx-auto">
                    <SwapWidget
                      tokenList={data.tokens}
                      defaultOutputTokenAddress={WBTC}
                      defaultInputTokenAddress="0xdAC17F958D2ee523a2206206994597C13D831ec7"
                      defaultInputAmount={1}
                      theme={{
                        primary: "#1A1A33", // Maps to --primary
                        secondary: "#000000", // Maps to --secondary
                        interactive: "#FFFFFF", // Assuming interactive colors might use the input color (--input)
                        container: "#FFFFFF", // Maps to --background for general container backgrounds
                        module: "#FFFFFF", // Maps to --card, assuming modules have card styling
                        accent: "#101017", // Maps to --destructive for a strong accent, assuming some creative liberty
                        outline: "#FFFFFF", // Maps to --ring, used for focus rings or similar
                        dialog: "#FFFFFF", // Maps to --popover, assuming dialogs use popover styling
                        accentSoft: "#ffffff",
                        activeSoft: "#ffffff",
                        deepShadow: "none",

                        // // fontFamily: "'Your Font Family'",  // Specify the font family you wish to use
                        // borderRadius: "0.8rem",
                      }}
                      className=" w-full"
                      width={400}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )}
            {/* <div className="w-full flex flex-row items-center justify-between">
                        <Button
                          disabled={isPending ? true : false}
                          className="font-bold w-28"
                          type="submit"
                        >
                          {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          120${" "}
                          <span className="font-light ml-0.5">
                            {" "}
                            IN {getSymbolByChain(networkChain?.name)}
                          </span>
                        </Button>
                        <p className="text-xs font-light">OR</p>
                        <Button
                          disabled={isPending ? true : false}
                          className="font-bold w-28"
                          type="submit"
                        >
                          {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {invite_code ? "60$" : "80$"}{" "}
                          <span className="font-light ml-0.5">IN STYLE</span>
                        </Button>
                      </div> */}
            {/* {hasStyle ? (
                        <Button
                          disabled={}
                          className="w-44"
                          type="submit"
                        >
                          {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          SUBMIT
                        </Button>
                      ) : (
                        <Dialog>
                          <DialogTrigger>
                            <Button className="w-44" type="button">
                              {isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              SUBMIT
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="  bg-white   w-auto py-4">
                            <SwapWidget
                              tokenList={data.tokens}
                              defaultOutputTokenAddress={
                                networkChain?.name === "Arbitrum One"
                                  ? WBTCARB
                                  : WBTC
                              }
                              theme={{
                                primary: "#1A1A33", // Maps to --primary
                                secondary: "#000000", // Maps to --secondary
                                interactive: "#FFFFFF", // Assuming interactive colors might use the input color (--input)
                                container: "#FFFFFF", // Maps to --background for general container backgrounds
                                module: "#FFFFFF", // Maps to --card, assuming modules have card styling
                                accent: "#101017", // Maps to --destructive for a strong accent, assuming some creative liberty
                                outline: "#FFFFFF", // Maps to --ring, used for focus rings or similar
                                dialog: "#FFFFFF", // Maps to --popover, assuming dialogs use popover styling
                                accentSoft: "#ffffff",
                                activeSoft: "#ffffff",
                                // // fontFamily: "'Your Font Family'",  // Specify the font family you wish to use
                                // borderRadius: "0.8rem",
                              }}
                            />
                          </DialogContent>
                        </Dialog>
                      )} */}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default NftUploadForm;
