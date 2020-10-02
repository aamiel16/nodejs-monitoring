import { STATUS_CODES } from "http";
import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import client from "prom-client";

const server = express();
const PORT = +(process.env.PORT || 8080);

// Start monitoring
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Settings
server.set('trust proxy', 1);
server.disable("x-powered-by");

// Middlewares
server.use(helmet());
server.use(cors());
server.use(morgan("combined"));

server.get("/heartbeat", (_: Request, res: Response) => {
  res.status(200).send(STATUS_CODES[200]);
});

server.get("/metrics", (_: Request, res: Response) => {
  res.contentType(register.contentType);
  res.end(register.metrics());
});

server.listen(PORT, () => {
  console.log("Server started. Listening at port: ", PORT);
});
