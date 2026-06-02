const dns = require("node:dns");
const mongoose = require("mongoose");

const parseDnsServers = (value) =>
  value
    ? value
        .split(",")
        .map((server) => server.trim())
        .filter(Boolean)
    : [];

const isLoopbackDnsServer = (server) =>
  server === "::1" || server === "127.0.0.1" || server.startsWith("127.");

const configureMongoSrvDns = (mongoUri) => {
  if (!mongoUri.startsWith("mongodb+srv://")) {
    return;
  }

  const configuredServers = parseDnsServers(process.env.MONGODB_DNS_SERVERS);

  if (configuredServers.length > 0) {
    dns.setServers(configuredServers);
    return;
  }

  const currentServers = dns.getServers();

  if (
    currentServers.length > 0 &&
    currentServers.every(isLoopbackDnsServer)
  ) {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "Missing MONGODB_URI or MONGO_URI in environment variables",
    );
  }

  configureMongoSrvDns(mongoUri);

  const connection = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: Number(process.env.MONGODB_TIMEOUT_MS) || 10000,
  });
  console.log(`MongoDB connected: ${connection.connection.host}`);

  return connection;
};

module.exports = connectDB;
