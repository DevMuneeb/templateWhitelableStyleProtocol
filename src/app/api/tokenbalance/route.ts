import { create } from "apisauce";
import { Web3 } from "web3";
// define the api
const apiEth = create({
  baseURL: "https://eth-mainnet.alchemyapi.io/v2",
});

const apiARB = create({
  baseURL: "https://arb-mainnet.alchemyapi.io/v2",
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");
    const chain = searchParams.get("chain");

    const usdcContractARB = "0x9500Ba777560daf9d3AB148ea1cf1ED39Df9eBDb";
    const usdcERC20 = "0x9e91F79070926A191e41367d40aD582686f9e66D";

    if (!walletAddress)
      return new Response("Invalid Wallet Address", {
        status: 400,
      });
    const apiKey = "o4bym1cZRM7aYJ0WM7KbZdUdC5lJEtVW";
    const url = `/${apiKey}`;

    const data = JSON.stringify({
      jsonrpc: "2.0",
      method: "alchemy_getTokenBalances",
      params: [
        walletAddress,
        [chain === "Arbitrum One" ? usdcContractARB : usdcERC20], // USDC contract address
      ],
      id: 1,
    });

    let response: any = null;
    if (chain === "Arbitrum One") {
      response = await apiARB.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      response = await apiEth.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (
      response &&
      response?.ok &&
      response?.data &&
      response?.data?.result &&
      response?.data?.result?.tokenBalances?.length > 0
    ) {
      const tokenBalanceHex =
        response.data.result.tokenBalances[0].tokenBalance;
      console.log(tokenBalanceHex);

      const tokenBalanceBigNumber = Web3.utils.toBigInt(tokenBalanceHex);

      // Convert the token balance to a human-readable string
      const tokenBalanceHumanReadable = Web3.utils.fromWei(
        tokenBalanceBigNumber,
        "ether" // or 'wei', 'gwei', etc., depending on the token decimals
      );

      return new Response(
        JSON.stringify({
          balance: tokenBalanceHumanReadable,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }
      );
    } else {
      return new Response(JSON.stringify({ balance: "0" }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error fetching and calculating token balance:", error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}
