import { tokenDetails } from "./interfaces/interface";
import { ethers } from "ethers";
import { Telegraf, Context } from "telegraf";
import { getTokenDetails } from "./utils/detail.util";
import { tokenDetailsTemplate } from "./templates/template";

const Network = require("./contract/network/network.json");
const ProofABI = require("./contract/abi/proof.json");

const BOT_TOKEN = process.env.BOT_TOKEN || "";
const network = process.env.CURRENT_NETWORK || "";
const PROVIDER_URL = process.env.PROVIDER_URL || "";
const PRIVATE_CHATID = process.env.PRIVATE_CHATID || "";
const CONTRACT_ADDRESS = Network[network].contract || "";

interface CustomContext extends Context {
  session?: any;
}

const bot = new Telegraf<CustomContext>(BOT_TOKEN);
const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ProofABI, provider);

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
  const token = "0xd41cA32626BbF092908381B657D72C44Ddd10F6B";
  const tokenDetails = await getTokenDetails(token);
  ctx.telegram.sendMessage(PRIVATE_CHATID, tokenDetailsTemplate(tokenDetails), {
    parse_mode: "HTML",
  });
});

bot.launch();
console.log("Bot is running");
