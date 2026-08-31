const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 3000;

app.use(cors());

app.use(express.json());


// Serve dashboard files

app.use(
    express.static(__dirname)
);


// Simple health check

app.get("/api/status", (req, res) => {

    res.json({

        success: true,

        system:
            "HazardShield AI",

        mode:
            "Dummy Simulation",

        status:
            "ONLINE"

    });

});


app.listen(PORT, () => {

    console.log("================================");
    console.log("🚀 HazardShield AI Server Started");
    console.log("🌐 http://localhost:3000");
    console.log("📡 Mode: Dummy Sensor Simulation");
    console.log("🔥 Firebase: Disabled");
    console.log("👷 Workers: 10");
    console.log("❤️ Heart Sensor: Enabled");
    console.log("================================");

});