import express, { Request, Response } from "express";
import * as commDriver from "./arduino/commDriver";
import * as commDataHandler from "./arduino/commDataHandler";
import * as db from "./db/dbConnection";
import { parseWriteDataRequest } from "./requestParser";

const app = express();
app.use(express.json());

db.connect().then(() => {
  //commDriver.startComm();
  commDriver.startMockComm();
  console.log("commStarted");

  app.get("/params", (req: Request, res: Response) => {
    const params = commDataHandler.getCurrentData();
    return res.json(params);
  });

  app.get("/history", (req: Request, res: Response) => {
    return res.json({
      status: "sucess",
    });
  });

  app.post("/write", async (req: Request, res: Response) => {
    try {
      const optionalSendData = parseWriteDataRequest(req);

      if (optionalSendData === null) {
        return res
          .status(415)
          .send(
            "Data write failed, Check content-type, it should be application/json"
          );
      }

      const result = await commDataHandler.writeData(optionalSendData);
      if (result) {
        res.send("Data write successful");
      } else {
        res.status(500).send("Data write failed");
      }
    } catch (e) {
      if (e instanceof Error && e.toString().indexOf("Comm") > 0) {
        res.status(500);
      } else {
        res.status(400);
      }

      res.send("Data write failed. " + e);
    }
  });
  app.listen(4000, () => console.log("listening on port 4000"));
});
