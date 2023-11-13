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
  sensorErrorForLongTime: boolean;
}

export interface SendData extends CommonData {}

export type OptionalSendData = Partial<SendData>;

interface CommonData {
  collectorExchangerDelta: number;
  exchangerBoilerDelta: number;
  collectorExchangerHysteresis: number;
  exchangerBoilerHysteresis: number;
  haltT: number;
  auxHeatingDelayTimeMs: number;
  forceDegass: boolean;
  forceSystemHalt: boolean;
}
