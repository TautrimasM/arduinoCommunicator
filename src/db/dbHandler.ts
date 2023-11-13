import { ReceivedData } from "../types/commDataTypes";
import { areObjectsEqual } from "../utils/dataTools";
import { client } from "./dbConnection";
import { general, params } from "../config/appSetttings.json";

let cachedData: ReceivedData;
export async function insertData(data: ReceivedData) {
  if (general.init) {
    createTablesIfNotExists();
  }
  if (cachedData != undefined) {
    const areEqual = areObjectsEqual(cachedData, data, params.deadband);
    if (areEqual) {
      console.log("value unchanged");
      return;
    }
  }

  try {
    const query = {
      text: `INSERT INTO system_data (
            system_uptime, sensor_fail_time, solar_collector_temperature, 
            heat_exchanger_temperature, boiler_temperature, aux_heating_stop_time, 
            collector_pump_on, boiler_pump_on, degassing_valve_open, aux_heating_on
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
          )`,
      values: [
        data.systemUptime,
        data.sensorFailTime,
        data.solarCollectorTemperature,
        data.heatExchangerTemperature,
        data.boilerTemperature,
        data.auxHeatingStopTime,
        data.collectorPumpOn,
        data.boilerPumpOn,
        data.degassingValveOpen,
        data.auxHeatingOn,
      ],
    };

    await client.query(query);
    cachedData = { ...data };
  } catch (error) {
    console.error("Error inserting data:", error);
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

//export async function getData()
