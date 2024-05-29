"use client";

import { createContext, ReactNode, useContext } from "react";

export interface ConfigContextType {
  logo: string;
  bgImage: string;
  labelColor: string;
  inputColor: string;
  tokenAddress: string;
  tokenABI: string;
  cost: string;
  navTitle: string;
  identifier: string;
  slogan: string;
  currencySymbol: string;
  collectionContract: string;
}

// Create the context
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  value: {
    logo: string;
    bgImage: string;
    labelColor: string;
    inputColor: string;
    tokenAddress: string;
    tokenABI: string;
    cost: string;
    navTitle: string;
    identifier: string;
    slogan: string;
    currencySymbol: string;
    collectionContract: string;
  };
  children: ReactNode;
}

// Create the provider component
export const ConfigProvider: React.FC<ConfigProviderProps> = ({
  value,
  children,
}) => {
  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

// Define a custom hook to consume the context
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within an AuthProvider");
  }
  return context;
};
