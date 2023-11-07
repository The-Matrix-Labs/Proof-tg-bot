import { appendFile } from "fs";
import { NextFunction, Request, Response } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userAgent = req.get("User-Agent");
    const messageHeader = `${userAgent} ${req.method} ${req.path}`;
    const message = `Request: [${getTime()}] ${messageHeader}`;
    appendDataInFile("logs.txt", message);
    next();
  } catch (error) {
    console.log("error: ", error);
  }
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (err instanceof Error) {
      const message = `Error: [${getTime()}] ${req.path} ${err.message}`;
      appendDataInFile("logs.txt", message);
      res
        .status(400)
        .json({ error: "Validation failed", message: err.message });
    } else {
      const messageHeader = `${req.headers.host} ${req.path} `;
      const message = `Error: [${getTime()}] ${messageHeader} ${err}`;
      appendDataInFile("logs.txt", message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.log("error: ", error);
  }
};

function getTime() {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function appendDataInFile(path: string, message: string) {
  appendFile("logs/" + path, message + "\n", function (err) {
    if (err) {
      console.log("err: in logs ", err);
    }
  });
}
