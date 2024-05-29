"use client";
import { Web3 } from "web3";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { SwapWidget, lightTheme } from "@uniswap/widgets";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  create3DAvatar,
  generateAvatar,
  get3DAvatar,
  getImageUrl,
  pin2DToS3,
  pinModelToS3,
} from "@/services/avatarService";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { NFTItem } from "@/components/ui/nft-item";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import data from "./../../data/tokens.json";

import { worlds } from "@/mocks";
import { addOrder, logGptActivity } from "@/services/appService";
import { useAuth } from "@/app/providers/AuthProvider";
import { NFTConnectSchema, nftFormSchema } from "@/interfaces/auth";
import { navigate } from "@/actions";
import ModelViewer from "./model-viewer";
import { ACTIVITIES, ORDER_TYPE } from "@/lib/utils";
import { useSendTransaction } from "wagmi";
import { Utils } from "alchemy-sdk";
import { Dialog, DialogContent, DialogTrigger } from "./dialog";

const recieverwalletEth = "0x31a93aBa8A5FC94840e63EE288D5f38917D4E1CC";
const WBTC = "0x9e91F79070926A191e41367d40aD582686f9e66D";
const WBTCARB = "0x9500Ba777560daf9d3AB148ea1cf1ED39Df9eBDb";
const cost = 120;
const abiERC20 = [
  // Other functions...
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "holder", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

let imageBackupsArray: string[] = [];
let imageURLBackupsArray: string[] = [];
let modelBackupsArray: string[] = [];

const NftUploadGenerate = ({
  usdTo,
}: {
  usdTo: {
    BNB: number;
    SOL: number;
    ETH: number;
    MATIC: number;
    AVAX: number;
    USDT: number;
    STYLE: number;
  };
}) => {
  const [hasStyle, setHasStyle] = useState(false);
  const [styleBalance, setstyleBalance] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [modelUrl, setModelUrl] = useState("");
  const [modelUrlBackup, setModelUrlBackup] = useState("");
  const [tryAgainCount, setTryAgainCount] = useState<number>(0);
  const [modelProccess, setModelProccess] = useState(0);
  const [modelLoading, setModelLoading] = useState(false);
  const [image64Base, setImage64Base] = useState("");
  const [image64HasError, setImage64HasError] = useState<boolean>(false);
  const [imageBackup, setImageBackup] = useState("");
  const [modelHasError, setModelHasError] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { walletAddress, networkChain, walletConnector, loggedUser } =
    useAuth();
  const { sendTransactionAsync } = useSendTransaction();

  const [isPending, setisPending] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>({
    id: 0,
    name: "",
    src: "",
  });
  const [customAsset, setCustomAsset] = useState<string>("");
  const [step, setStep] = useState<number>(0);

  const invite_code = searchParams.get("invite_code");

  const [styleAmountToPay, setStyleAmountToPay] = useState<number>(
    invite_code ? 50 : 60
  );

  const usdt = styleAmountToPay * usdTo.USDT;

  const styleValueInUSDT = usdt / usdTo.STYLE;

  const adjustedBalance = Web3.utils.toWei(styleValueInUSDT, "ether");

  const { config } = usePrepareContractWrite({
    address: networkChain?.name === "Ethereum" ? WBTC : WBTCARB,
    abi: abiERC20,
    functionName: "transfer",
    chainId: networkChain?.name === "Ethereum" ? 1 : 42161,
    args: [recieverwalletEth, adjustedBalance],
  });
  const { writeAsync } = useContractWrite(config);

  const form = useForm<NFTConnectSchema>({
    resolver: zodResolver(nftFormSchema),
  });
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

  const getConvertedCost = (chain: string) => {
    switch (chain) {
      case "Polygon":
        return usdTo.MATIC * cost;
      case "Ethereum":
        return usdTo.ETH * cost;
      case "Arbitrum One":
        return usdTo.ETH * cost;

      case "BNB Smart Chain":
        return usdTo.BNB * cost;

      case "Solana":
        return usdTo.SOL * cost;

      case "zkSync Era":
        return usdTo.ETH * cost;
      case "Sepolia":
        return usdTo.ETH * cost;
      default:
        return cost;
    }
  };
  const onSubmit = useCallback(
    async (data: NFTConnectSchema, e: any) => {
      if (!executeRecaptcha) return;
      (async () => {
        try {
          const submitType = e.nativeEvent.submitter.name;
          console.log({ submitType });
          let transactionHash = "";
          let paymentType = "";
          if ((!selected.src && !customAsset) || (selected.src && customAsset))
            throw new Error("No image or 3D provided");

          // const grToken = await executeRecaptcha("generateOrder");
          // const grTokenLog = await executeRecaptcha("generateOrderLog");
          // if (!grToken || !grTokenLog) {
          //   throw new Error("Error Validating Captcha");
          // }
          if (!networkChain?.name || networkChain?.name !== "Ethereum") {
            throw new Error("Invalid Chain, Switch to Ethereum mainnet");
          }
          const payment = getConvertedCost(networkChain?.name);

          if (e.nativeEvent.submitter.name === "submitButton2") {
            if (writeAsync) {
              const data = await writeAsync();
              transactionHash = data.hash;
              paymentType = "STYLE";
            }
          } else {
            const transactionData = await sendTransactionAsync({
              to: recieverwalletEth,
              value: Utils.parseEther(payment.toString()).toBigInt(),
              gasPrice: Utils.parseUnits("10", "gwei").toBigInt(), // Replace "10" with your desired gas price in Gwei
            });
            transactionHash = transactionData.hash;
          }
          if (!transactionHash || transactionHash === "") {
            throw new Error("Invalid Transaction Hash");
          }
          let uploadData: any = {
            payment:
              paymentType === "STYLE"
                ? styleValueInUSDT.toString() + paymentType
                : getConvertedCost(networkChain?.name).toString() +
                  getSymbolByChain(networkChain?.name),
            paymentHash: transactionHash,
            chain: networkChain?.name,
            connector: walletConnector?.name,
            world: data.world,
            nft: imageUrl,
            customAsset: modelUrl,
            orderPlatform: ORDER_TYPE.STYLEGPT,
            styleAmout: styleBalance.toString(),
          };
          if (invite_code) {
            uploadData.referral_code = invite_code;
          }

          setisPending(true);
          const grToken = await executeRecaptcha("generateOrder");
          const response = await addOrder(
            {
              ...uploadData,
              grToken,
            },
            loggedUser
          );
          if (!response.ok) throw new Error("Issue occured! Try later");
          await logGptActivity(
            {
              action: ACTIVITIES["ORDER SUBMITTED"],
              mediaOrUrl: modelUrl,
              prompt: prompt,
            },
            loggedUser
          );
          toast("Completed");
          setisPending(false);

          await navigate(
            `${
              pathname.includes("/style-gpt") ? "/style-gpt" : "/mvp"
            }/confirmation`
          );
        } catch (error: any) {
          console.log(error);
          toast(error.message);
          setisPending(false);
        }
      })();
    },
    [
      loggedUser,
      customAsset,
      executeRecaptcha,
      image,
      imageUrl,
      modelUrl,
      networkChain?.name,
      pathname,
      selected.src,
      walletConnector?.name,
    ]
  );

  const handleGenerateAvatar = useCallback(() => {
    if (!executeRecaptcha) return;
    (async () => {
      try {
        setLoading(true);
        setModelHasError(false);
        setImage64HasError(false);
        if (!prompt) {
          return;
        }
        if (image) {
          // setImageBackup(image);
          imageBackupsArray.push(image);
        }
        if (modelUrl) {
          setModelUrlBackup(modelUrl);
          modelBackupsArray.push(modelUrl);
          setModelUrl("");
        }
        const response = await generateAvatar({ prompt: prompt });
        if (!response.ok) {
          throw new Error("Failed to create avatar");
        }
        const imageAsBase64 = Buffer.from(response.data, "binary").toString(
          "base64"
        );
        const imageAsSrc = "data:image/png;base64," + imageAsBase64;

        const pin2DResponse = await pin2DToS3(imageAsSrc);
        if (!pin2DResponse.ok) {
          throw new Error("Failed to upload avatar");
        }
        console.log(pin2DResponse.data.url);

        // setImage64Base(imageAsBase64);
        setImage(imageAsSrc);
        setCustomAsset(imageAsSrc);
        imageURLBackupsArray.push(pin2DResponse.data.url);
        setImageUrl(pin2DResponse.data.url);

        await logGptActivity(
          {
            action: ACTIVITIES["2D IMAGE GENERATED"],
            mediaOrUrl: pin2DResponse.data.url,
            prompt: prompt,
          },
          loggedUser
        );
      } catch (e: any) {
        console.log(e);
        setLoading(false);
        setImage64HasError(true);
        toast(e.message || "Error generating 2D image, try later!");
      } finally {
        setLoading(false);
      }
    })();
  }, [executeRecaptcha, image, loggedUser, modelUrl, prompt]);

  const handleImageTo3D = useCallback(() => {
    if (!executeRecaptcha) return;

    (async () => {
      try {
        setStep(1);
        setLoading(true);
        setModelLoading(true);
        setModelHasError(false);
        console.log({ imageUrl });

        // const image_url = (await getImageUrl({ image: image64Base })).data?.data
        //   ?.url;
        // if (!image_url) {
        //   throw new Error("Failed to retrieve image URL");
        // }

        // console.log(image_url, "image url");

        const createResponse = await create3DAvatar({ image_url: imageUrl });
        if (!createResponse.ok || !createResponse.data?.result) {
          throw new Error("Failed to create 3D avatar");
        }
        setModelProccess(3);

        const task_id = createResponse.data.result;
        let modelUrl = "";
        while (!modelUrl) {
          await new Promise((resolve) => setTimeout(resolve, 30 * 1000));

          const getModelResponse = await get3DAvatar({ task_id });
          if (!getModelResponse.ok) {
            throw new Error("Failed to get 3D avatar model");
          }

          console.log(getModelResponse.data, "get response");
          modelUrl = getModelResponse.data?.model_urls?.glb;
          setModelProccess(getModelResponse.data?.progress);
        }

        const pinResponse = await pinModelToS3(modelUrl);
        if (!pinResponse.ok || !pinResponse.data?.url) {
          throw new Error("Failed to pin model to S3");
        }

        console.log(pinResponse.data?.url);
        modelUrl = pinResponse.data.url;
        setModelUrl(modelUrl);

        await logGptActivity(
          {
            action: ACTIVITIES["3D IMAGE GENERATED"],
            mediaOrUrl: modelUrl,
            prompt: prompt,
          },
          loggedUser
        );
      } catch (error) {
        console.error(error);
        setLoading(false);
        setModelHasError(true);
        toast("Error generating 3D model, please try again later!");
      } finally {
        setLoading(false);
        setModelLoading(false);
      }
    })();
  }, [executeRecaptcha, imageUrl, loggedUser]);

  const fetchStyleHoldAmount = async (addr: string, chain: string) => {
    try {
      const resp = await fetch(
        `/api/tokenbalance?walletAddress=${addr}&chain=${chain}`
      );
      if (resp.ok) {
        const data: any = await resp.json();
        if (data && data?.balance && parseInt(data?.balance) > 1000) {
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
    if (walletAddress) {
      fetchStyleHoldAmount(walletAddress, networkChain?.name);
    }
  }, [walletAddress, networkChain]);
  return (
    <div className="mt-4 space-y-2">
      <Label className="tracking-widest" htmlFor="choose">
        {step === 0 ? "WHAT IS YOUR IDEA?" : "YOUR AVATAR:"}
      </Label>
      {step === 0 && (
        <Input
          className="w-full"
          type="text"
          placeholder=""
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      )}

      {loading ? (
        <div className="w-full flex flex-col justify-center items-center gap-4 text-center">
          {!modelLoading && (
            <div className="animate-spin rounded-full h-9 w-9 border-4 border-gray-300 border-t-gray-900 _motion-reduce:animate-[spin_5s_linear_infinite] mt-3"></div>
          )}
          {modelLoading && (
            <div className="text-base text-gray-600">
              <p className="text-xs">
                The creation of the 3D asset takes up to 5min.
                <br />
                You can come back to this page soon!
              </p>
              <p className="text-xs mt-3">{modelProccess}% </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {image ? (
            <div className="w-full flex flex-col justify-start items-center">
              {modelUrl && !modelHasError && step === 1 ? (
                <>
                  <p className="text-xs">
                    (This is an approximation. The final, usable model will get
                    additional details, a clean render and manual approval from
                    our team.)
                  </p>
                  <div className="w-full mt-3 h-[260px] rounded-lg">
                    <ModelViewer gltfModelUrl={modelUrl} />
                  </div>
                </>
              ) : (
                modelHasError &&
                step === 1 && (
                  <Button
                    onClick={handleImageTo3D}
                    className="w-3/4"
                    type="button"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    REGENERATE 3D
                  </Button>
                )
              )}

              {step === 0 && image && (
                <>
                  <img src={image} alt="" className="object-cover rounded-lg" />
                  <div className="w-full flex justify-between items-center mt-2">
                    {tryAgainCount > 0 ? (
                      <div
                        onClick={() => {
                          setImage(imageBackupsArray[tryAgainCount - 1]);
                          setCustomAsset(imageBackupsArray[tryAgainCount - 1]);
                          setImageUrl(imageURLBackupsArray[tryAgainCount - 1]);
                          // setImage64Base(
                          //   imageBackupsArray[tryAgainCount - 1]
                          //     .split("data:image/png;base64,")
                          //     .pop() as string
                          // );
                          // setImageBackup("");
                          setModelUrl(modelUrlBackup);
                          setModelUrlBackup("");
                          setTryAgainCount((prevIndex) => prevIndex - 1);
                        }}
                        className="text-sm flex flex-row tracking-widest items-center justify-center cursor-pointer"
                      >
                        <ChevronLeft className="h-5 w-5" />
                        PREVIOUS
                      </div>
                    ) : (
                      <div />
                    )}

                    <div
                      onClick={() => {
                        setTryAgainCount((prevIndex) => prevIndex + 1);
                        handleGenerateAvatar();
                      }}
                      className="text-sm flex flex-row tracking-widest items-center justify-center cursor-pointer"
                    >
                      TRY AGAIN
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="py-10 mx-0 min-w-full flex flex-col items-center">
                    <Button onClick={handleImageTo3D} className="w-3/4">
                      PROCEED TO 3D
                    </Button>
                  </div>
                </>
              )}

              {step === 1 && modelUrl && !modelHasError && (
                <FormProvider {...form}>
                  <form
                    className="w-full py-5"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <div className="grid w-full max-w-sm items-center gap-2 mb-3">
                      <FormField
                        control={form.control}
                        name="world"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="tracking-widest">
                              SELECT WORLD
                            </FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} {...field}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent
                                  style={{
                                    position: "absolute",
                                    zIndex: 100,
                                    top: "auto",
                                    bottom: 0,
                                  }}
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
                      <div className="flex flex-col items-start">
                        <Label className="tracking-widest" htmlFor="fee">
                          ACCESS:
                        </Label>
                      </div>
                      <div className="flex flex-col items-end">
                        <Label className="tracking-widest" htmlFor="eth">
                          <Label htmlFor="eth">2.500 STYLE</Label>
                        </Label>
                      </div>
                    </div>
                    <div className="my-2 flex justify-between relative">
                      <div className="flex flex-col items-start">
                        <Label className="tracking-widest" htmlFor="fee">
                          PROCEED OPTIONS:
                        </Label>
                      </div>
                      {/* <Label
                        className="tracking-widest absolute  left-[11.1rem] top-2 whitespace-nowrap"
                        htmlFor="eth"
                      >
                        <span className="tracking-widest text-destructive text-clip  line-through mr-2">
                          0.05Eth
                        </span>
                        {getConvertedCost(networkChain?.name).toFixed(2)}
                        {getSymbolByChain(networkChain?.name)} {"// "}
                        <span className="tracking-widest">
                          LISTING WEEK DISCOUNT
                        </span>
                      </Label> */}
                    </div>

                    <div className="mt-7 mx-0 min-w-full flex flex-col items-center">
                      {hasStyle ? (
                        <div className="w-full flex flex-row items-center justify-between">
                          <Button
                            disabled={isPending ? true : false}
                            className="font-bold w-28"
                            type="submit"
                            name="submitButton1"
                            value="submit1"
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
                          {styleBalance > styleValueInUSDT ? (
                            <Button
                              disabled={isPending ? true : false}
                              className="font-bold w-28"
                              type="submit"
                              name="submitButton2"
                              value="submit2"
                            >
                              {isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              {invite_code ? "50$" : "60$"}{" "}
                              <span className="font-light ml-0.5">
                                IN STYLE
                              </span>
                            </Button>
                          ) : (
                            <Dialog>
                              <DialogTrigger>
                                <Button
                                  disabled={isPending ? true : false}
                                  className="font-bold w-28"
                                  type="button"
                                >
                                  {isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  )}
                                  {invite_code ? "50$" : "60$"}{" "}
                                  <span className="font-light ml-0.5">
                                    IN STYLE
                                  </span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className=" bg-white py-4 max-w-md">
                                {/* <SwapWidget
                        tokenList={data.tokens}
                        defaultOutputTokenAddress={
                          networkChain?.name === "Arbitrum One" ? WBTCARB : WBTC
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
                      /> */}
                                {networkChain?.name === "Arbitrum One" ? (
                                  <iframe
                                    src={`https://app.uniswap.org/#/swap?exactField=input&exactAmount=10&inputCurrency=0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9&outputCurrency=${WBTCARB}&theme=light`}
                                    className="iframewidth"
                                  />
                                ) : (
                                  <iframe
                                    src={`https://app.uniswap.org/#/swap?exactField=input&exactAmount=10&inputCurrency=0xdAC17F958D2ee523a2206206994597C13D831ec7&outputCurrency=${WBTC}&theme=light`}
                                    className="iframewidth"
                                  />
                                )}
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      ) : (
                        <div className="w-full flex flex-row items-center justify-between">
                          <Dialog>
                            <DialogTrigger>
                              <Button
                                disabled={isPending ? true : false}
                                className="font-bold w-28"
                                type="button"
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
                            </DialogTrigger>
                            <DialogContent className=" bg-white py-4 max-w-md">
                              {/* <SwapWidget
                        tokenList={data.tokens}
                        defaultOutputTokenAddress={
                          networkChain?.name === "Arbitrum One" ? WBTCARB : WBTC
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
                      /> */}
                              {networkChain?.name === "Arbitrum One" ? (
                                <iframe
                                  src={`https://app.uniswap.org/#/swap?exactField=input&exactAmount=10&inputCurrency=0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9&outputCurrency=${WBTCARB}&theme=light`}
                                  className="iframewidth"
                                />
                              ) : (
                                <iframe
                                  src={`https://app.uniswap.org/#/swap?exactField=input&exactAmount=10&inputCurrency=0xdAC17F958D2ee523a2206206994597C13D831ec7&outputCurrency=${WBTC}&theme=light`}
                                  className="iframewidth"
                                />
                              )}
                            </DialogContent>
                          </Dialog>

                          <p className="text-xs font-light">OR</p>
                          <Dialog>
                            <DialogTrigger>
                              <Button
                                disabled={isPending ? true : false}
                                className="font-bold w-28"
                                type="button"
                              >
                                {isPending && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {invite_code ? "50$" : "60$"}{" "}
                                <span className="font-light ml-0.5">
                                  IN STYLE
                                </span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className=" bg-white py-4 max-w-md">
                              {/* <SwapWidget
                        tokenList={data.tokens}
                        defaultOutputTokenAddress={
                          networkChain?.name === "Arbitrum One" ? WBTCARB : WBTC
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
                      /> */}
                              {networkChain?.name === "Arbitrum One" ? (
                                <iframe
                                  src={`https://app.uniswap.org/#/swap?exactField=input&exactAmount=10&inputCurrency=0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9&outputCurrency=${WBTCARB}&theme=light`}
                                  className="iframewidth"
                                />
                              ) : (
                                <iframe
                                  src={`https://app.uniswap.org/#/swap?exactField=input&exactAmount=10&inputCurrency=0xdAC17F958D2ee523a2206206994597C13D831ec7&outputCurrency=${WBTC}&theme=light`}
                                  className="iframewidth"
                                />
                              )}
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
              )}
            </div>
          ) : null}

          {!image && step === 0 ? (
            <div className="mt-5 mx-0 min-w-full flex flex-col items-center">
              {image64HasError ? (
                <Button
                  onClick={handleGenerateAvatar}
                  disabled={!prompt ? true : false}
                  className="w-2/4"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  TRY AGAIN
                </Button>
              ) : (
                <Button
                  onClick={handleGenerateAvatar}
                  disabled={!prompt ? true : false}
                  className="w-2/4"
                >
                  GENERATE
                </Button>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default NftUploadGenerate;
