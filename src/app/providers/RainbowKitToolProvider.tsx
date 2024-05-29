"use client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  walletConnectWallet,
  phantomWallet,
  metaMaskWallet,
  coinbaseWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, arbitrum, bsc, zkSync, sepolia } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
const { chains, publicClient } = configureChains(
  [mainnet],
  [
    alchemyProvider({
      apiKey: process.env.ALCHEMY_ID! || "HIxZU6bIhwHaJOi6jRK98CImzKrsAGVu",
    }),
    publicProvider(),
  ]
);

const projectId = "02af6ff556c94c46bf724cd71d67c0c4";

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      rainbowWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      metaMaskWallet({ projectId, chains }),
      coinbaseWallet({ appName: "$Style Protocol", chains }),
    ],
  },
  // {
  //   groupName: "Others",
  //   wallets: [phantomWallet({ chains })],
  // },
]);

// const { connectors } = getDefaultWallets({
//   appName: "MVP 2.0",
//   projectId: "02af6ff556c94c46bf724cd71d67c0c4",
//   chains,
// });

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
export function RainbowKitToolProvider({ children }: any) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
}
