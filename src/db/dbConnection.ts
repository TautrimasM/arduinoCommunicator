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
      createTablesIfNotExists();
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

async function createTablesIfNotExists() {
  console.log("checking tables");
  client.query(`
  CREATE TABLE IF NOT EXISTS system_data (
    id serial PRIMARY KEY,
    system_uptime numeric,
    sensor_fail_time numeric,
    solar_collector_temperature numeric,
    heat_exchanger_temperature numeric,
    boiler_temperature numeric,
    aux_heating_stop_time numeric,
    collector_pump_on boolean,
    boiler_pump_on boolean,
    degassing_valve_open boolean,
    aux_heating_on boolean,
    created_at timestamptz DEFAULT current_timestamp
  )
  `);
  console.log("DB tables ok");
}

export { connect, disconnect, client };
