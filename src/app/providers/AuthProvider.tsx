"use client";
import { authenticate } from "@/services/authService";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAccount, useChainId, useNetwork } from "wagmi";
import { jwtDecode } from "jwt-decode";
import {
  createCookie,
  createIsAuthenticatedCookie,
  deleteCookie,
  navigate,
} from "@/actions";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "sonner";
import { getOrders } from "@/services/appService";
import { OrderHistoryType } from "@/components/ui/order-history-content";

// Define the shape of your authentication context
interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  loginOrSignup: (email: string, address: string) => void;
  logout: () => void;
  getCurrentUser: () => any;
  loadOrderHistory: (id: string | number, token: any) => any;
  orderHistories: OrderHistoryType[];
  setOrderHistories: (value: OrderHistoryType[]) => void;
  loggedUser: any;
  email: string | null;
  setEmail: (value: string) => void;
  walletAddress: string | null;
  setWalletAddress: (address: string) => void;
  networkChain: any | null;
  setNetworkChain: (chain: any) => void;
  walletConnector: any | null;
  setWalletConnector: (chain: any) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define a custom hook to consume the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Create the provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { select, wallets, publicKey, disconnect } = useWallet();
  const { address, connector, isDisconnected } = useAccount();
  const { chain } = useNetwork();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const { openAccountModal } = useAccountModal();
  const { openConnectModal } = useConnectModal();
  const [loggedUser, setLoggedUser] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [networkChain, setNetworkChain] = useState<any | null>(null);
  const [walletConnector, setWalletConnector] = useState<any | null>(null);
  const [orderHistories, setOrderHistories] = useState<OrderHistoryType[]>([]);

  const invite_code = searchParams.get("invite_code");

  const loginOrSignup = useCallback(
    (email: string, address: any) => {
      if (!executeRecaptcha) return;
      (async () => {
        try {
          const token = await executeRecaptcha("login");
          let body = {};

          if (invite_code) {
            body = {
              email: email,
              walletAddress: address,
              grToken: token,
              invite_code,
            };
          } else {
            body = {
              email: email,
              walletAddress: address,
              grToken: token,
            };
          }

          if (address && email) {
            setIsLoading(true);
            const response = await authenticate(body);
            if (response.ok) {
              await createIsAuthenticatedCookie("true");
              setLoggedUser(response.data.token);
              localStorage.setItem("authToken", response.data.token);
              // localStorage.setItem(
              //   "styleSelectedPage",
              //   JSON.stringify({
              //     id: 1,
              //     title: "MVP 2.0 (PUBLIC BETA)",
              //     path: "/mvp/dashboard",
              //   })
              // );
              setWalletAddress(address);
              setEmail(email);
              setIsAuthenticated(true);
              setIsLoading(false);

              if (invite_code) {
                await navigate(`/dashboard?invite_code=${invite_code}`);
              } else {
                await navigate(`/dashboard`);
              }
            } else {
              setWalletAddress(null);
              setEmail(null);
              setIsAuthenticated(false);
              setIsLoading(false);
              throw new Error("Authentication error, try later!");
            }
          }
        } catch (e: any) {
          console.log(e);
          logout();
          toast(e.message);
        }
      })();
    },
    [executeRecaptcha, pathname]
  );

  const loadOrderHistory = async (id: string | number, token: any) => {
    try {
      setIsLoading(true);
      const response = await getOrders(id, token);
      if (!response.ok) throw new Error("Issue occured! Try later");
      setOrderHistories(response.data.orders);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // setTimeout(() => {
    const user: any = getCurrentUser();
    if (user) {
      loadOrderHistory(user.userId, loggedUser);
    }
    // }, 1000);
  }, [loggedUser]);

  const getCurrentUser = () => {
    try {
      const user = localStorage.getItem("authToken");
      if (!user) return null;
      return jwtDecode(user);
    } catch (error) {
      return null;
    }
  };
  const logout = async () => {
    try {
      setWalletAddress(null);
      setEmail(null);
      setIsAuthenticated(false);
      localStorage.removeItem("authToken");
      // localStorage.removeItem("styleSelectedPage");
      await deleteCookie("accessToken");
      await disconnect();
      navigate(`/`);
      // invite_code ? navigate(`/?invite_code=${invite_code}`) : navigate(`/`);
    } catch (error) {}
  };

  useEffect(() => {
    if (address || publicKey) {
      setWalletAddress(address as string);
      if (publicKey) {
        setNetworkChain({ name: "Solana" });
        setWalletAddress(publicKey.toString());
      }
    }
  }, [address, publicKey]);

  useEffect(() => {
    if (address || publicKey) {
      //   setWalletAddress(address as string);
      //   if (publicKey) {
      //     setNetworkChain({ name: "Solana" });
      //     setWalletAddress(publicKey.toString());
      //   }
      let emailAddress = email;
      if (!emailAddress) {
        const user: any = getCurrentUser();
        if (user && user?.email) {
          emailAddress = user?.email;
        }
      }
      if (emailAddress) {
        loginOrSignup(emailAddress, address || publicKey?.toString());
      }
    }
    // if ((!address && !email) || (!publicKey && !email)) {
    //   logout();
    // }
  }, [email, address, publicKey]);

  useEffect(() => {
    if (isDisconnected) {
      logout();
    }
  }, [isDisconnected]);

  useEffect(() => {
    if (chain && connector) {
      setWalletConnector(connector);
      setNetworkChain(chain);
    }
    if (publicKey && connector) {
      setWalletConnector({ name: "Phantom" });
      setNetworkChain({ name: "Solana" });
    }
  }, [chain, connector, publicKey]);

  const contextValue = React.useMemo(
    () => ({
      isLoading,
      isAuthenticated,
      loginOrSignup,
      logout,
      getCurrentUser,
      loadOrderHistory,
      orderHistories,
      setOrderHistories,
      loggedUser,
      email,
      walletAddress,
      setEmail,
      setWalletAddress,
      networkChain,
      setNetworkChain,
      walletConnector,
      setWalletConnector,
    }),
    [
      isLoading,
      isAuthenticated,
      orderHistories,
      loggedUser,
      email,
      walletAddress,
      networkChain,
      walletConnector,
    ] // Include address as a dependency
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
