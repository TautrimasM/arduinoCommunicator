import * as commDriver from "./commDriver";
import {
  OptionalSendData,
  SendData,
  ReceivedData,
} from "../types/commDataTypes";
import { EventEmitter } from "events";
import { insertData } from "../db/dbHandler";
import { areObjectsEqual } from "../utils/dataTools";

let existingData: ReceivedData;
const events = new EventEmitter();

commDriver.events.on("data", (line: string) => {
  existingData = parseReceivedData(line);
  insertData(existingData);
  events.emit("dataParsed", existingData);
});

commDriver.events.on("error", (err) => {
  // Handle error event
  console.error("Received error:", err);
});

export function getCurrentData(): ReceivedData {
  return existingData;
}

export async function writeData(data: OptionalSendData): Promise<boolean> {
  const dataToWrite: SendData = {
    forceDegass: data.forceDegass ?? false,
    forceSystemHalt: data.forceSystemHalt ?? false,
    collectorExchangerDelta:
      data.collectorExchangerDelta ?? existingData.collectorExchangerDelta,
    exchangerBoilerDelta:
      data.exchangerBoilerDelta ?? existingData.exchangerBoilerDelta,
    collectorExchangerHysteresis:
      data.collectorExchangerHysteresis ??
      existingData.collectorExchangerHysteresis,
    exchangerBoilerHysteresis:
      data.exchangerBoilerHysteresis ?? existingData.exchangerBoilerHysteresis,
    haltT: data.haltT ?? existingData.haltT,
    auxHeatingDelayTimeMs:
      data.auxHeatingDelayTimeMs ?? existingData.auxHeatingDelayTimeMs,
  };

  const parsedData = parseSendData(dataToWrite);

  try {
    commDriver.writeData(parsedData);
  } catch (e) {
    throw new Error("Arduino Comm driver error");
  }

  const received = await new Promise((resolve) => {
    const onDataReceived = (existingData: ReceivedData) => {
      resolve(existingData);
    };
    events.on("dataParsed", onDataReceived);
    setTimeout(() => {
      events.off("dataParsed", onDataReceived);
      resolve(null);
    }, 5000);
  });

  if (received == undefined) {
    throw new Error("Arduino Comm Timeout reached");
  }

  if (existingData != undefined && dataToWrite != undefined) {
    const areEqual = areObjectsEqual(dataToWrite, existingData);
    if (areEqual) {
      return true;
    }
  }
  return false;
}

function parseReceivedData(input: string): ReceivedData {
  const values = input.split(",").map((value) => value.trim());
  const data: ReceivedData = {
    systemUptime: +values[0],
    sensorFailTime: +values[1],
    solarCollectorTemperature: +values[2],
    heatExchangerTemperature: +values[3],
    boilerTemperature: +values[4],
    auxHeatingStopTime: +values[5],
    collectorExchangerDelta: +values[6],
    exchangerBoilerDelta: +values[7],
    collectorExchangerHysteresis: +values[8],
    exchangerBoilerHysteresis: +values[9],
    haltT: +values[10],
    auxHeatingDelayTimeMs: +values[11],
    collectorPumpOn: values[12] === "1",
    boilerPumpOn: values[13] === "1",
    degassingValveOpen: values[14] === "1",
    auxHeatingOn: values[15] === "1",
    degassingInProgress: values[16] === "1",
    sensorErrorForLongTime: values[17] === "1",
  };

  return data;
}

function parseSendData(sendData: SendData): string {
  const values = [
    "1",
    sendData.collectorExchangerDelta.toString(),
    sendData.exchangerBoilerDelta.toString(),
    sendData.collectorExchangerHysteresis.toString(),
    sendData.exchangerBoilerHysteresis.toString(),
    sendData.haltT.toString(),
    sendData.auxHeatingDelayTimeMs.toString(),
    sendData.forceDegass ? "1" : "0",
    sendData.forceSystemHalt ? "1" : "0",
  ];

  return values.join(",");
}