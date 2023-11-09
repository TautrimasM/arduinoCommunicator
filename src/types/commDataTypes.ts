export interface ReceivedData extends CommonData {
  systemUptime: number;
  sensorFailTime: number;
  solarCollectorTemperature: number;
  heatExchangerTemperature: number;
  boilerTemperature: number;
  auxHeatingStopTime: number;
  collectorPumpOn: boolean;
  boilerPumpOn: boolean;
  degassingValveOpen: boolean;
  auxHeatingOn: boolean;
  degassingInProgress: boolean;
  sensorErrorForLongTime: boolean;
}

export interface SendData extends CommonData {
  forceDegass: boolean;
  forceSystemHalt: boolean;
}

export type OptionalSendData = Partial<SendData>;

interface CommonData {
  collectorExchangerDelta: number;
  exchangerBoilerDelta: number;
  collectorExchangerHysteresis: number;
  exchangerBoilerHysteresis: number;
  haltT: number;
  auxHeatingDelayTimeMs: number;
}
