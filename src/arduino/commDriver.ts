import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import schedule, { Job } from "node-schedule";
import { EventEmitter } from "events";
import { arduino } from "../config/appSetttings.json";

let port: SerialPort;
let parser: ReadlineParser;
let job: Job;
let dataTimestamp = new Date().getTime();
const events = new EventEmitter();

function openPort() {
  try {
    console.log("[ Comm Driver ] opening serial port " + arduino.comPort);
    port = new SerialPort({
      path: arduino.comPort,
      baudRate: arduino.baudRate,
    });
    port.open;
    parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

    parser.on("data", (line: string) => {
      console.log("data received: " + line);
      dataTimestamp = new Date().getTime();
      events.emit("data", line);
    });

    port.on("open", () => {
      console.log(`[ Comm Driver ] serial port ${arduino.comPort} is open`);
    });
    port.on("close", (err: any) => {
      console.log("[ Comm Driver ] device has disconnected");
      events.emit("error", err);
      setTimeout(openPort, 5000);
    });

    port.on("error", (err) => {
      console.error("[ Comm Driver ] error: ", err);
      events.emit("error", err);
      if (err.message.includes("File not found")) {
        console.log("[ Comm Driver ] device is not connected");
        setTimeout(openPort, 5000);
      }
    });
  } catch (e) {
    console.error("error: ", e);
  }
}

function startComm() {
  if (port == undefined || !port.isOpen) {
    console.warn("[ Comm Driver ] serial port not open");
    openPort();
  }
  requestData();
  job = schedule.scheduleJob(`*/${arduino.readInterval} * * * * *`, () => {
    requestData();
  });
  console.log("[ Comm Driver ] comm has started");
}

function startMockComm() {
  const line =
    "50000,45000,52.3,40.6,30.1,0,8,5,9.5,6.0,5.5,7200000,1,1,1,0,0,0,0";
  events.emit("data", line);
  job = schedule.scheduleJob(`*/${arduino.readInterval} * * * * *`, () => {
    events.emit("data", line);
  });
}
function requestData() {
  console.log("[ Comm Driver ] requesting data");
  port.write("0");
}
function writeData(data: string) {
  if (port == undefined || !port.isOpen) {
    console.warn("[ Comm Driver ] serial port is not open");
    openPort();
  }
  stopComm();
  port.write(data);
  startComm();
}

function stopComm() {
  if (job == undefined) {
    console.warn("[ Comm Driver ] comm not defined");
    return;
  }
  schedule.cancelJob(job);
  job == undefined;
}

function closePort() {
  if (port != undefined && port.isOpen) {
    console.warn("[ Comm Driver ] closing serial port");
    port.close();
  }
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
