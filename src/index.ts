import {
  launchTokenTemplate,
  tokenDetailsTemplate,
} from "./templates/template";
import {
  ITokenDetails,
  ITokenLaunchInfo,
  IWhiteListedTokenDetails,
} from "./interfaces/interface";
import {
  validateLaunchWhiteListTokenDetails,
  validateTokenDetails,
  validateWhiteListTokenDetails,
} from "./validation/TypeValidation";

import cors from "cors";
import { config } from "dotenv";
import { Telegraf, Context } from "telegraf";
import express, { NextFunction, Request, Response } from "express";
import { errorHandler, logger } from "./middleware/logger";
config(); // loading .env file

const PORT = process.env.PORT || 8080;
const BOT_TOKEN = process.env.BOT_TOKEN || "";
const PUBLIC_GROUP_ID = process.env.PUBLIC_GROUP_ID || "";
const PRIVATE_GROUP_ID = process.env.PRIVATE_GROUP_ID || "";
const MESSAGE_DELAY = Number(process.env.MESSAGE_DELAY) || 10000;

const app = express();
const bot = new Telegraf(BOT_TOKEN);

app.use(cors());
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res: Response) => {
  res.send("Proof Bot");
});

app.post(
  "/api/webhook/token",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenDetails: ITokenDetails = req.body;

      // validating token details Types
      validateTokenDetails(tokenDetails);

      const tempalte = tokenDetailsTemplate<ITokenDetails>(tokenDetails);

      bot.telegram.sendMessage(PRIVATE_GROUP_ID, tempalte, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });

      setTimeout(() => {
        bot.telegram.sendMessage(PUBLIC_GROUP_ID, tempalte, {
          parse_mode: "HTML",
          disable_web_page_preview: true,
        });
      }, MESSAGE_DELAY);

      res.status(201).json("Stealth Notification has been sent to the group");
    } catch (error) {
      next(error);
    }
  }
);

app.post(
  "/api/webhook/whiteListToken",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenDetails: IWhiteListedTokenDetails = req.body;

      // validating token details Types
      validateWhiteListTokenDetails(tokenDetails);

      const tempalte = tokenDetailsTemplate<IWhiteListedTokenDetails>(
        tokenDetails,
        true
      );

      bot.telegram.sendMessage(PRIVATE_GROUP_ID, tempalte, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });

      setTimeout(() => {
        bot.telegram.sendMessage(PUBLIC_GROUP_ID, tempalte, {
          parse_mode: "HTML",
          disable_web_page_preview: true,
        });
      }, MESSAGE_DELAY);

      res
        .status(201)
        .json("WhiteList token notification has been sent to the group");
    } catch (error) {
      next(error);
    }
  }
);

app.post(
  "/api/webhook/launchWhiteListToken",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenDetails: ITokenLaunchInfo = req.body;

      // validating token details Types
      validateLaunchWhiteListTokenDetails(tokenDetails);

      const tempalte = launchTokenTemplate(tokenDetails);

      bot.telegram.sendMessage(PRIVATE_GROUP_ID, tempalte, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });

      bot.telegram.sendMessage(PUBLIC_GROUP_ID, tempalte, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });

      res
        .status(201)
        .json("Launch token notification has been sent to the group");
    } catch (error) {
      next(error);
    }
  }
);

app.use(errorHandler);

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
