require("dotenv").config();
import { ethers } from "ethers";
import { INetwork } from "./../interfaces/interface";
import { tokenDetails } from "../interfaces/interface";
import { FACTORY_ABI } from "../constants/abi.constant";

import ProofABI from "../contract/abi/proof.json";
import TokenABI from "../contract/abi/token.json";
const Network: INetwork = require("../contract/network/network.json");

const CURRENT_NETWORK = process.env.CURRENT_NETWORK || "";
const PROVIDER_URL = process.env.PROVIDER_URL || "";
const CONTRACT_ADDRESS = Network[CURRENT_NETWORK]?.contract || "";

const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);

const contract = new ethers.Contract(CONTRACT_ADDRESS, ProofABI, provider);

export async function getTokenDetails(address: string): Promise<tokenDetails> {
  // creating a token contract instance
  const tokenContract = new ethers.Contract(address, TokenABI, provider);

  const chain = CURRENT_NETWORK === "ETH" ? "ETH" : "BNB";

  const [name, symbol, decimals, owner, totalSupply, tax, initialLiquidity] =
    await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals(),
      tokenContract.tokenOwner(),
      tokenContract.totalSupply(),
      tokenContract.totalFee(),
      getInitialLiquidity(address),
    ]);

  const maxBuy = totalSupply.mul(1).div(100);
  const maxBuyFormatted = ethers.utils.formatUnits(maxBuy, decimals);
  const tokenSupplyFormatted = ethers.utils.formatUnits(totalSupply, decimals);

  // Todo : team allocation

  const taxFormatted = `${tax}%`;
  console.log("tax: ", +tax);

  // const tax =
  // "Buy 5% | Sell 5% (includes PROOF’s fee — 2% in first 72h, 1% after that)";

  return {
    chain,
    name,
    tax: taxFormatted,
    symbol,
    owner,
    address,
    initialLiquidity,
    teamAllocation: "0",
    maxBuy: maxBuyFormatted,
    totalSupply: tokenSupplyFormatted,
  };
}

export async function getInitialLiquidity(address: string): Promise<string> {
  try {
    const factoryAddress = Network[CURRENT_NETWORK].factory; // Uniswap V2 Factory

    const wethAddress = Network[CURRENT_NETWORK].weth; // WETH address

    const factoryContract = new ethers.Contract(
      factoryAddress,
      FACTORY_ABI,
      provider
    );

    const pairAddress = await factoryContract.getPair(address, wethAddress);
    console.log("pairAddress: ", pairAddress);

    // Handle Nonexistent Pair
    if (pairAddress === "0x0000000000000000000000000000000000000000") {
      throw new Error("Pair does not exist.");
    }

    const WethContract = new ethers.Contract(wethAddress, TokenABI, provider);
    const balance = await WethContract.balanceOf(pairAddress);
    const decimals = await WethContract.decimals();
    const balanceFormatted = ethers.utils.formatUnits(balance, decimals);

    return balanceFormatted;
  } catch (error: any) {
    console.error("Error: ", error.message);
  }
  return "";
}

export async function getLiquidityLocked(finalizeTokenAddress: string) {
  const validatedPairData = await contract.validatedPairs(finalizeTokenAddress);
  const liquidityLocked = validatedPairData.unlockTime;

  return liquidityLocked;
}
