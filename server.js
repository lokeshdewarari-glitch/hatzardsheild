const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

let sensorData = {
  workerId: "Worker-01",
  temperature: 0,
  humidity: 0,
  gas: 0,
  pressure: 0,
  motion: false,
  battery: 100,
  alert: false,
  reason: "SAFE"
};

// ESP32 se data receive
app.post("/api/data", (req, res) => {

  sensorData = req.body;

  console.log(sensorData);

  res.json({
    success: true
  });

});

// Dashboard ko data bhejna
app.get("/api/data", (req, res) => {

  res.json(sensorData);

});

app.listen(PORT, () => {

  console.log("================================");
  console.log("🚀 SafeMine AI Server Started");
  console.log("🌐 http://localhost:3000");
  console.log("================================");

});