import { appendFile } from "fs";
import { NextFunction, Request, Response } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  try {
    const messageHeader = `Request: ${req.headers.host} ${req.method} ${req.path}`;
    const message = `${messageHeader} at ${getTime()}`;
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
      const message = `Error: ${req.path} ${err.message} at ${getTime()}`;
      appendDataInFile("logs.txt", message);
      res
        .status(400)
        .json({ error: "Validation failed", message: err.message });
    } else {
      const messageHeader = `${req.headers.host} ${req.path} `;
      const message = `Error:${messageHeader} ${err} at ${getTime()}`;
      appendDataInFile("logs.txt", message);
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  } catch (error) {
    console.log("error: ", error);
  }
};

function getTime() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const day = date.getDate();
  const month = date.getMonth();
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
