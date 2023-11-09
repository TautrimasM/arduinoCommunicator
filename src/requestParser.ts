import { Request } from "express";
import { OptionalSendData } from "./types/commDataTypes";

export function parseWriteDataRequest(req: Request): OptionalSendData | null {
  const requestData = req.body;

  if (requestData == undefined || Object.keys(requestData).length == 0) {
    return null;
  }

  const optionalSendData: OptionalSendData = {
    forceDegass: parseBoolean(requestData.forceDegass, "forceDegass"),
    forceSystemHalt: parseBoolean(
      requestData.forceSystemHalt,
      "forceSystemHalt"
    ),
    collectorExchangerDelta: parseNumber(
      requestData.collectorExchangerDelta,
      "collectorExchangerDelta"
    ),
    exchangerBoilerDelta: parseNumber(
      requestData.exchangerBoilerDelta,
      "exchangerBoilerDelta"
    ),
    collectorExchangerHysteresis: parseNumber(
      requestData.collectorExchangerHysteresis,
      "collectorExchangerHysteresis"
    ),
    exchangerBoilerHysteresis: parseNumber(
      requestData.exchangerBoilerHysteresis,
      "exchangerBoilerHysteresis"
    ),
    haltT: parseNumber(requestData.haltT, "haltT"),
    auxHeatingDelayTimeMs: parseNumber(
      requestData.auxHeatingDelayTimeMs,
      "auxHeatingDelayTimeMs"
    ),
  };

  return optionalSendData;
}

function parseBoolean(value: any, param: string): boolean | undefined | never {
  if (typeof value === "boolean" || typeof value === "undefined") {
    return value;
  } else {
    throw new Error(`Value of ${param} must be a boolean`);
  }
}

function parseNumber(value: any, param: string): number | undefined | never {
  if (typeof value === "number" || typeof value === "undefined") {
    return value;
  } else {
    throw new Error(`Value of ${param} must be a number`);
  }
}
