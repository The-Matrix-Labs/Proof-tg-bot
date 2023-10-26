require("dotenv").config();
import { ethers } from "ethers";
import { tokenDetails } from "../interfaces/interface";
import { FACTORY_ABI, PAIR_ABI } from "../constants/abi.constant";

const TokenABI = require("../contract/abi/token.json");
const Network = require("../contract/network/network.json");

const network = process.env.CURRENT_NETWORK || "";
const PROVIDER_URL = process.env.PROVIDER_URL || "";

const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);

export async function getTokenDetails(address: string): Promise<tokenDetails> {
  // creating a token contract instance
  const tokenContract = new ethers.Contract(address, TokenABI, provider);

  const chain = "ETH";

  const [name, symbol, decimals, owner, totalSupply, initialLiquidity] =
    await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals(),
      tokenContract.tokenOwner(),
      tokenContract.totalSupply(),
      getInitialLiquidity(address),
    ]);

  const maxBuy = totalSupply.mul(1).div(100);
  const maxBuyFormatted = ethers.utils.formatUnits(maxBuy, decimals);
  const tokenSupplyFormatted = ethers.utils.formatUnits(totalSupply, decimals);

  // Todo : team allocation

  const tax =
    "Buy 5% | Sell 5% (includes PROOF’s fee — 2% in first 72h, 1% after that)";

  return {
    chain,
    name,
    tax,
    symbol,
    owner,
    address,
    initialLiquidity,
    maxBuy: maxBuyFormatted,
    totalSupply: tokenSupplyFormatted,
  };
}

export async function getInitialLiquidity(address: string): Promise<string> {
  try {
    const factoryAddress = Network[network].factory; // Uniswap V2 Factory

    const wethAddress =
      network === "ETH" ? Network[network].weth : Network[network].wbnb; // WETH address

    const factoryContract = new ethers.Contract(
      factoryAddress,
      FACTORY_ABI,
      provider
    );

    const pairAddress = await factoryContract.getPair(address, wethAddress);

    // Handle Nonexistent Pair
    if (pairAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error("Pair does not exist.");
    }

    const pairContract = new ethers.Contract(pairAddress, PAIR_ABI, provider);

    // Fetch reserves
    const [reserves, token0Address, token1Address] = await Promise.all([
      pairContract.getReserves(),
      pairContract.token0(),
      pairContract.token1(),
    ]);
    console.log("token1Address: ", token1Address);
    console.log("token0Address: ", token0Address);

    // Correct handling of decimals
    const token0Contract = new ethers.Contract(
      token0Address,
      ["function decimals() view returns (uint8)"],
      provider
    );
    const token1Contract = new ethers.Contract(
      token1Address,
      ["function decimals() view returns (uint8)"],
      provider
    );

    const [token0Decimals, token1Decimals] = await Promise.all([
      token0Contract.decimals(),
      token1Contract.decimals(),
    ]);

    const token0Reserve = ethers.utils.formatUnits(
      reserves.reserve0,
      token0Decimals
    );
    const token1Reserve = ethers.utils.formatUnits(
      reserves.reserve1,
      token1Decimals
    );

    console.log(
      `Initial liquidity of the token in the liquidity pool: Token0 - ${token0Reserve}, Token1 - ${token1Reserve}`
    );
    return token0Reserve;
  } catch (error: any) {
    console.error("Error: ", error.message);
  }
  return "";
}
