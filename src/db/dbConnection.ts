import { Client } from "pg";
import { db } from "../config/appSetttings.json";

let client: Client;

async function connect(): Promise<boolean> {
  console.log("Connecting to PostgreSQL");
  let retries = 5;
  while (retries) {
    try {
      client = new Client(db);
      await client.connect();
      console.log("Connected to PostgreSQL");
      return true;
    } catch (error) {
      console.error("Error connecting to PostgreSQL:", error);
      retries--;
      console.log("Retiries left:", retries);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  return false;
}

async function disconnect() {
  if (client != null) {
    await client.end();
    console.log("Disconnected from PostgreSQL");
  } else {
    console.log("There was no connection to PostgreSQL");
  }
}

export { connect, disconnect, client };
