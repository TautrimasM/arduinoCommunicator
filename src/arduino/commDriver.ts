import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import schedule, { Job } from "node-schedule";
import { EventEmitter } from "events";
import { arduino } from "../config/appSetttings.json";

let port: SerialPort;
let parser: ReadlineParser;
let job: Job;
const events = new EventEmitter();

function openPort() {
  try {
    console.log("Opening Port " + port);
    port = new SerialPort({
      path: arduino.comPort,
      baudRate: arduino.baudRate,
    });
    port.open;
    parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
    console.log(`Serial port ${arduino.comPort} is open`);

    parser.on("data", (line: string) => {
      events.emit("data", line);
    });

    port.on("error", (err) => {
      console.error("Error: ", err);
      events.emit("error", err);
      if (port.closed) {
        open();
      }
    });
  } catch (e) {
    console.error("Error: ", e);
  }
}

function startComm() {
  if (port == undefined || port.closed) {
    console.warn("Port Not opened");
    openPort();
  }
  port.write("0");
  job = schedule.scheduleJob(`*/${arduino.readInterval} * * * * *`, () => {
    port.write("0");
  });
}

function startMockComm() {
  const line =
    "50000,45000,52.3,40.6,30.1,50000,8,5,9.5,6.0,5.5,7200000,1,1,1,0,0,0";
  events.emit("data", line);
  job = schedule.scheduleJob(`*/${arduino.readInterval} * * * * *`, () => {
    events.emit("data", line);
  });
}

function writeData(data: string) {
  if (port == undefined || port.closed) {
    console.warn("Port Not opened");
    openPort();
  }
  stopComm();
  port.write(data);
  startComm();
}

function stopComm() {
  if (job == undefined) {
    console.warn("Comm not defined");
    return;
  }
  schedule.cancelJob(job);
  job == undefined;
}

function closePort() {
  if (port == undefined) {
    console.warn("Port Not Defined");
    return;
  }
  if (port.closed) {
    console.warn("Port Not Open");
    return;
  }
  port.close();
}

export {
  events,
  writeData,
  startComm,
  stopComm,
  openPort,
  closePort,
  startMockComm,
};
