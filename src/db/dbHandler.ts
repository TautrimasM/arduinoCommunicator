import { ReceivedData } from "../types/commDataTypes";
import { areObjectsEqual } from "../utils/dataTools";
import { client } from "./dbConnection";

let cachedData: ReceivedData;
export async function insertData(data: ReceivedData) {
  if (cachedData != undefined) {
    const areEqual = areObjectsEqual(cachedData, data);
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

//export async function getData()
