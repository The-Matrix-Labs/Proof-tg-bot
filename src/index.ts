import {
  ITokenDetails,
  ITokenLaunchInfo,
  IWhiteListedTokenDetails,
} from "./interfaces/interface";
import { Telegraf, Context } from "telegraf";
import express, { Request, Response } from "express";
import {
  launchTokenTemplate,
  tokenDetailsTemplate,
} from "./templates/template";
import { config } from "dotenv";
import cors from "cors";
import {
  validateLaunchWhiteListTokenDetails,
  validateTokenDetails,
  validateWhiteListTokenDetails,
} from "./validation/TypeValidation";

config(); // loading .env file

const PORT = process.env.PORT || 8080;
const BOT_TOKEN = process.env.BOT_TOKEN || "";
const PUBLIC_GROUP_ID = process.env.PUBLIC_GROUP_ID || "";
const PRIVATE_GROUP_ID = process.env.PRIVATE_GROUP_ID || "";
const MESSAGE_DELAY = Number(process.env.MESSAGE_DELAY) || 10000;

const app = express();
const bot = new Telegraf(BOT_TOKEN);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Proof Bot");
});

app.post("/api/webhook/token", async (req: Request, res: Response) => {
  try {
    const tokenDetails: ITokenDetails = req.body;

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
    if (error instanceof Error) {
      res
        .status(400)
        .json({ error: "Validation failed", message: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

app.post("/api/webhook/whiteListToken", async (req: Request, res: Response) => {
  try {
    const tokenDetails: IWhiteListedTokenDetails = req.body;

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
    if (error instanceof Error) {
      res
        .status(400)
        .json({ error: "Validation failed", message: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

app.post(
  "/api/webhook/launchWhiteListToken",
  async (req: Request, res: Response) => {
    try {
      const tokenDetails: ITokenLaunchInfo = req.body;

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
      if (error instanceof Error) {
        res
          .status(400)
          .json({ error: "Validation failed", message: error.message });
      } else {
        res.status(500).json({ error: "An unexpected error occurred" });
      }
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
