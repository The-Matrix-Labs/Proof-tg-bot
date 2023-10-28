import {
  ITokenDetails,
  IWhiteListedTokenDetails,
} from "./interfaces/interface";
import { Telegraf, Context } from "telegraf";
import express, { Request, Response } from "express";
import { tokenDetailsTemplate } from "./templates/template";
import { config } from "dotenv";

config(); // loading .env file

const PORT = process.env.PORT || 8080;
const BOT_TOKEN = process.env.BOT_TOKEN || "";
const PUBLIC_GROUP_ID = process.env.PUBLIC_GROUP_ID || "";
const PRIVATE_GROUP_ID = process.env.PRIVATE_GROUP_ID || "";
const MESSAGE_DELAY = Number(process.env.MESSAGE_DELAY) || 10000;

const app = express();
const bot = new Telegraf(BOT_TOKEN);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/api/webhook/createToken", async (req: Request, res: Response) => {
  try {
    const tokenDetails: ITokenDetails = req.body;

    const tempalte = tokenDetailsTemplate(tokenDetails);

    bot.telegram.sendMessage(PRIVATE_GROUP_ID, tempalte, {
      parse_mode: "HTML",
    });

    setTimeout(() => {
      bot.telegram.sendMessage(PUBLIC_GROUP_ID, tempalte, {
        parse_mode: "HTML",
      });
    }, MESSAGE_DELAY);

    res.status(201).json("Notification has been sent to the group");
  } catch (error) {
    res.status(500).json("Something went wrong");
    console.log("error: ", error);
  }
});

app.post(
  "/api/webhook/createWhiteListToken",
  async (req: Request, res: Response) => {
    try {
      const tokenDetails: IWhiteListedTokenDetails = req.body;

      const tempalte = tokenDetailsTemplate(tokenDetails, true);

      bot.telegram.sendMessage(PRIVATE_GROUP_ID, tempalte, {
        parse_mode: "HTML",
      });

      setTimeout(() => {
        bot.telegram.sendMessage(PUBLIC_GROUP_ID, tempalte, {
          parse_mode: "HTML",
        });
      }, MESSAGE_DELAY);

      res.status(201).json("Notification has been sent to the group");
    } catch (error) {
      res.status(500).json("Something went wrong");
      console.log("error: ", error);
    }
  }
);

bot.start((ctx: Context) => {
  console.log("ctx: ", ctx.chat?.id);
  ctx.reply("Welcome");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// launching bot
bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
