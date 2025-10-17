const express = require("express");
const { WebSocketServer } = require("ws");
const net = require("net");

const app = express();
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log("Bridge online on port " + port);
});

const wss = new WebSocketServer({ server });

const MINECRAFT_SERVER_HOST = "toxide.aternos.me";
const MINECRAFT_SERVER_PORT = 40472;

wss.on("connection", (ws) => {
  console.log("Eaglercraft player connected");
  const mc = net.connect(MINECRAFT_SERVER_PORT, MINECRAFT_SERVER_HOST);
  ws.on("message", (msg) => mc.write(msg));
  mc.on("data", (data) => ws.send(data));
  ws.on("close", () => mc.destroy());
  mc.on("close", () => ws.close());
});
