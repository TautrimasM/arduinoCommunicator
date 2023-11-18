import { Client } from "pg";
import { db } from "../config/appSetttings.json";

let client: Client;

async function connect(): Promise<boolean> {
  console.log("[ DB Connection ] connecting to PostgreSQL");
  let retries = 5;
  while (retries) {
    try {
      client = new Client(db);
      await client.connect();
      console.log("[ DB Connection ] connected to PostgreSQL");
      return true;
    } catch (error) {
      console.error("[ DB Connection ] error connecting to PostgreSQL:", error);
      retries--;
      console.log("[ DB Connection ] retiries left:", retries);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
  return false;
}

async function disconnect() {
  if (client != null) {
    await client.end();
    console.log("[ DB Connection ] disconnected from PostgreSQL");
  } else {
    console.log("[ DB Connection ] there was no connection to PostgreSQL");
  }
}

export { connect, disconnect, client };
