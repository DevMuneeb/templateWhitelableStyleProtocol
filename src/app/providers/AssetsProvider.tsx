"use client";
import { IdToChainNameAlchemy } from "@/lib/utils";
import { Alchemy, Network } from "alchemy-sdk";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
// @ts-ignore
import { ErcType, EvmChain, NftscanEvm, NftscanSolana } from "nftscan-api";
import { v4 as uuidv4 } from "uuid";
enum EvmChain {
  Ethereum = "eth",
  "BNB Smart Chain" = "bnb",
  Polygon = "polygon",
  "Arbitrum One" = "arbitrum",
  OPTIMISM = "optimism",
  "zkSync Era" = "zksync",
  LINEA = "linea",
  Base = "base",
  AVALANCHE = "avalanche",
  MOONBEAM = "moonbeam",
  PLATON = "platon",
  CRONOS = "cronos",
  FANTOM = "fantom",
  GNOSIS = "gnosis",
  VICTION = "viction",
  STARKNET = "starknet",
  Solana = "solana",
}

// Define the shape of your assets context
interface AssetsContextType {
  assets: any[]; // Update this type according to your asset structure
  loading: boolean;
  error: any | null;
  fetchAssets: (address: string, chain: any) => Promise<void>;
}

// Create the context
const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

// Define a custom hook to consume the context
export const useAssets = () => {
  const context = useContext(AssetsContext);
  if (!context) {
    throw new Error("useAssets must be used within an AssetsProvider");
  }
  return context;
};

interface AssetsProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AssetsProvider: React.FC<AssetsProviderProps> = ({ children }) => {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);

  const exampleWalletAddress = (
    chain: keyof typeof IdToChainNameAlchemy | any
  ) => {
    switch (chain) {
      case "Ethereum":
        return "0x9757f2d2b135150bbeb65308d4a91804107cd8d6";
      case "Polygon":
        return "0x1EFEcb61A2f80Aa34d3b9218B564a64D05946290";

      case "Arbitrum One":
        return "0xa805e1b42590be85d2c74e09c0e1c1b6063ea1a7";

      case "BNB Smart Chain":
        return "0xE26a9Fdc620Fd1331Ef98098F346941A2497F669";

      case "Solana":
        return "4Qzi1RHo3gnQ4oQrq3UccHehqA7nKo7DpMbnZUy1zpHG";

      case "zkSync Era":
        return "0xeb71d303a6cee4ba28e9c5adc1af308892fb681b";

      default:
        return null;
    }
  };

  const isIpfsUri = (uri: any) => uri.includes("ipfs");

  const transformIpfsUri = (uri: any) => {
    if (uri.startsWith("ipfs://")) {
      return `https://ipfs.io/${uri.slice(7)}`;
    } else if (uri.startsWith("/ipfs/")) {
      return `https://ipfs.io${uri}`;
    } else if (!uri.includes("://")) {
      // assuming it's just an id
      return `https://ipfs.io/ipfs/${uri}`;
    } else {
      return uri; // return as it is if none of the conditions are met
    }
  };

  const fetchAssets = async (
    address: string,
    chain: keyof typeof IdToChainNameAlchemy
  ) => {
    console.log({ chain });
    if (!address) return;
    setAssets([]);
    setLoading(true);
    setError(null);
    try {
      let data: any = [];

      const response = await fetch(
        `https://restapi.nftscan.com/api/v2/assets/chain/${address}?erc_type=erc721&chain=eth;bnb;polygon;arbitrum;optimism;zksync;avalanche`,
        {
          method: "GET",
          headers: {
            "X-API-KEY": "6NbzG8zjaQE1dohdyfgrL76E",
          },
        }
      );
      const responseData = await response.json();

      // Assuming responseData.data is an array of objects for each chain
      responseData.data.forEach((chain: any, index: any) => {
        chain.collection_assets.forEach((collection: any) => {
          collection.assets.forEach((asset: any, idx: any) => {
            if (
              asset.content_type?.toLowerCase()?.includes("image") &&
              asset.name
            ) {
              let imageUri = asset.image_uri;
              if (asset.token_uri && isIpfsUri(asset.token_uri)) {
                imageUri = transformIpfsUri(imageUri);
              }
              const nftMeta = JSON.stringify({
                tokenId: asset?.token_id || "",
                contract: asset?.contract_address || "",
                collection: collection?.contract_name || "",
                chain: chain?.chain,
                mint_transaction_hash: asset?.mint_transaction_hash,
              });
              data.push({
                idx: uuidv4(),
                nftId: nftMeta,
                nftname: asset.name || "Unnamed NFT",
                nft_url: imageUri,
              });
            }
          });
        });
      });

      setAssets(data);
      // eg: "0x9757f2d2b135150bbeb65308d4a91804107cd8d6" eth
      // 0xa805e1b42590be85d2c74e09c0e1c1b6063ea1a7 arb
      // polygon 0x1EFEcb61A2f80Aa34d3b9218B564a64D05946290
      // if (
      //   chain === ("BNB Smart Chain" as any) ||
      //   chain === ("zkSync Era" as any) ||
      //   chain === ("Polygon" as any) ||
      //   chain === ("Arbitrum One" as any)
      // ) {
      //   config = {
      //     ...config,
      //     chain: EvmChain[chain],
      //   };
      //   const evm = new NftscanEvm(config);
      //   data = await evm.asset.getMultiChainAssets(address, {
      //     erc_type: ErcType.ERC_721, // Can be erc721 or erc1155
      //   });

      //   if (data && data?.content?.length > 0) {
      //     const content = data?.content;
      //     const filtered = content.filter((nft: any) => {
      //       return (
      //         nft?.content_type &&
      //         nft?.content_type?.toLowerCase()?.includes("image")
      //       );
      //     });
      //     const nfts = filtered?.map((nft: any, idx: any) => {
      //       let image: string | null = nft?.image_uri;

      //       if (isIpfsUri(nft?.token_uri)) {
      //         image = transformIpfsUri(image);
      //       }
      //       return {
      //         idx,
      //         nftId: JSON.stringify({
      //           tokenId: nft?.tokenId || "",
      //           contract: nft?.contract?.address || "",
      //           collection: nft?.collection || "",
      //         }),
      //         nftname: nft.name,
      //         nft_url: image,
      //         nftValue: "",
      //       };
      //     });

      //     setAssets(nfts || []);
      //   }
      // } else if (chain === ("Solana" as any)) {
      //   console.log("inside solana nfts");

      //   const solana = new NftscanSolana({ ...config });
      //   data = await solana.asset.getAssetsByAccount(address);

      //   if (data && data?.content?.length > 0) {
      //     const content = data?.content;
      //     const filtered = content.filter((nft: any) => {
      //       return (
      //         nft?.content_type &&
      //         nft?.content_type?.toLowerCase()?.includes("image")
      //       );
      //     });
      //     setAssets(
      //       filtered?.map((nft: any, idx: any) => {
      //         let image: string | null = nft?.image_uri;

      //         if (isIpfsUri(nft?.token_uri)) {
      //           image = transformIpfsUri(image);
      //         }
      //         return {
      //           idx,
      //           nftId: JSON.stringify({
      //             tokenId: nft?.tokenId || "",
      //             contract: nft?.contract?.address || "",
      //             collection: nft?.collection || "",
      //           }),
      //           nftname: nft?.name,
      //           nft_url: image,
      //           nftValue: "",
      //         };
      //       }) || []
      //     );
      //   }
      // } else {
      //   const alchemy = new Alchemy({
      //     apiKey: "HIxZU6bIhwHaJOi6jRK98CImzKrsAGVu",
      //     network: IdToChainNameAlchemy[chain] as Network,
      //   });
      //   data = await alchemy.nft.getNftsForOwner(address);
      //   const ownedNFTs = data?.ownedNfts || [];
      //   setAssets(
      //     ownedNFTs.map((nft: any, idx: any) => {
      //       return {
      //         idx,
      //         nftId: JSON.stringify({
      //           tokenId: nft?.tokenId || "",
      //           contract: nft?.contract?.address || "",
      //           collection: nft?.collection || "",
      //         }),
      //         nftname: nft.name,
      //         nft_url: nft?.image?.cachedUrl,
      //         nftValue: "",
      //       };
      //     }) || []
      //   );
      // }

      setLoading(false);
    } catch (error) {
      console.log("error here");
      console.log(error);
      setError(error);
      setLoading(false);
      setAssets([]);
    }
  };

  //   useEffect(() => {
  //     // Example: Fetch assets on component mount
  //     // fetchAssets("ADDRESS", "CHAIN");
  //   }, []);

  const contextValue = {
    assets,
    loading,
    error,
    fetchAssets,
  };

  return (
    <AssetsContext.Provider value={contextValue}>
      {children}
    </AssetsContext.Provider>
  );
};
