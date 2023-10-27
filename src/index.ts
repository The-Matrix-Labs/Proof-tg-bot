import { ethers } from "ethers";
import { Telegraf, Context } from "telegraf";
import { tokenDetailsTemplate } from "./templates/template";
import { getLiquidityLocked, getTokenDetails } from "./utils/detail.util";

const ProofABI = require("./contract/abi/proof.json");
const Network = require("./contract/network/network.json");

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const PROVIDER_URL = process.env.PROVIDER_URL || "";
const PRIVATE_CHATID = process.env.PRIVATE_CHATID || "";
const CURRENT_NETWORK = process.env.CURRENT_NETWORK || "";
const WSS_PROVIDER_URL = process.env.WSS_PROVIDER_URL || "";
const CONTRACT_ADDRESS = Network[CURRENT_NETWORK].contract || "";

interface CustomContext extends Context {
  session?: any;
}

const bot = new Telegraf<CustomContext>(BOT_TOKEN);
const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ProofABI, provider);
const webSocketProvider = new ethers.providers.WebSocketProvider(
  WSS_PROVIDER_URL
);

async function memPool() {
  webSocketProvider.on("pending", async (tx) => {
    try {
      const txInfo = await webSocketProvider.getTransaction(tx);
      if (txInfo?.to !== CONTRACT_ADDRESS) return; // checking if tx is to the contract

      const inter = new ethers.utils.Interface(ProofABI); // creating an interface of the contract
      const decodedinput = inter.parseTransaction({ data: txInfo.data });

      if (decodedinput.name !== "finalizeToken") return; // checking if tx is finalizeToken
      const finalizeTokenAddress = decodedinput.args[0];
      console.log("finalizeTokenAddress: ", finalizeTokenAddress);

      const receipt = await txInfo.wait();
      if (receipt.status !== 1) return; // checking if tx is successful

      const tokenDetails = await getTokenDetails(finalizeTokenAddress);
      const liquidityLocked = await getLiquidityLocked(finalizeTokenAddress);
      console.log("liquidityLocked: ", liquidityLocked);

      bot.telegram.sendMessage(
        PRIVATE_CHATID,
        tokenDetailsTemplate(tokenDetails),
        { parse_mode: "HTML" }
      );
    } catch (error) {
      console.log("error: ", error);
    }
  });
}

memPool();

async function tokenCreatedListener(token: string, event: any) {
  console.log("_tokenAddress: ", token);
  const tokenDetails = await getTokenDetails(token);
  bot.telegram.sendMessage(PRIVATE_CHATID, tokenDetailsTemplate(tokenDetails), {
    parse_mode: "HTML",
  });
}

contract.on("TokenCreated", tokenCreatedListener);

bot.start(async (ctx: CustomContext) => {
  try {
    ctx.reply("Hello World");
    console.log("ctx: ", ctx.chat?.id);
  } catch (error) {
    console.log("error: ", error);
  }
});

bot.command("token", async (ctx: CustomContext) => {
  const token = "0x9fF17BeD75C4C50020Bb6865814537482aAA2CE6";
  // const token = "0xcbC7904b5F09d3768323b1361be54faA5FE01c8f";
  const tokenDetails = await getTokenDetails(token);
  ctx.telegram.sendMessage(PRIVATE_CHATID, tokenDetailsTemplate(tokenDetails), {
    parse_mode: "HTML",
  });
});

bot.launch();
console.log("Bot is running");
