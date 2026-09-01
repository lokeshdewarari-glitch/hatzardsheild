const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 3000;

app.use(cors());

app.use(express.json());

app.use(express.static(__dirname));


let sensorData = {

    systemStatus: "ONLINE",

    workerId: "Worker-01",

    temperature: 29,

    humidity: 58,

    gas: 350,

    pressure: 970,

    motion: true,

    heartRate: 72,

    battery: 96,

    impact: false,

    noMotion: false,

    alert: false,

    reason: "SAFE"

};


app.post(
    "/api/data",
    (req, res) => {

        sensorData = {
            ...sensorData,
            ...req.body
        };

        console.log(
            "Received sensor data:",
            sensorData
        );

        res.json({
            success: true
        });

    }
);


app.get(
    "/api/data",
    (req, res) => {

        res.json(sensorData);

    }
);


app.listen(
    PORT,
    () => {

        console.log(
            "================================"
        );

        console.log(
            "🚀 HazardShield AI Server Started"
        );

        console.log(
            "🔥 Firebase: Disabled"
        );

        console.log(
            "👷 Workers: 10"
        );

        console.log(
            "❤️ Heart Sensor: Enabled"
        );

        console.log(
            "📍 Live Worker Map: Enabled"
        );

        console.log(
            "🌐 http://localhost:3000"
        );

        console.log(
            "================================"
        );

    }
);