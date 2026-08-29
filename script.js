// ==========================================================
// HAZARDSHIELD AI - FIREBASE + DASHBOARD + AI RISK SYSTEM
// ==========================================================


// ==========================================================
// FIREBASE CONFIGURATION
// ==========================================================

const firebaseConfig = {
    apiKey: "AIzaSyAcC2qEXujPTLwy1O7QYNBY6XZHrXqMAw",
    authDomain: "safemine-smart-helmet.firebaseapp.com",
    databaseURL: "https://safemine-smart-helmet-default-rtdb.firebaseio.com",
    projectId: "safemine-smart-helmet",
    storageBucket: "safemine-smart-helmet.firebasestorage.app",
    messagingSenderId: "188214160498",
    appId: "1:188214160498:web:ffea2fbd04bc2e366e66eb",
    measurementId: "G-L2Y7Z4V3M1"
};


// ==========================================================
// INITIALIZE FIREBASE
// ==========================================================

firebase.initializeApp(firebaseConfig);


// ==========================================================
// REALTIME DATABASE
// ==========================================================

const db = firebase.database();


// Existing ESP32 data path
const safeMineRef = db.ref("SafeMine");


// ==========================================================
// GLOBAL SETTINGS
// ==========================================================

let currentWorkerZone = "A";

let lastAlert = "";


// ==========================================================
// TAB SYSTEM
// ==========================================================

function showTab(tabId) {

    const tabs = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.classList.remove("active");
    });


    const buttons = document.querySelectorAll(".nav-btn");

    buttons.forEach(button => {
        button.classList.remove("active");
    });


    const selectedTab = document.getElementById(tabId);

    if (selectedTab) {
        selectedTab.classList.add("active");
    }


    buttons.forEach(button => {

        const onclickText =
            button.getAttribute("onclick");

        if (
            onclickText &&
            onclickText.includes("'" + tabId + "'")
        ) {
            button.classList.add("active");
        }

    });
}


// ==========================================================
// FIREBASE REALTIME DATA
// ==========================================================

safeMineRef.on("value", (snapshot) => {

    const data = snapshot.val();


    if (!data) {

        console.log("No Firebase data found");

        // If there is no Firebase data,
        // ESP32 should NOT appear connected.
        updateDeviceStatus("OFFLINE");

        return;
    }


    console.log("Firebase Data:", data);


    // ======================================================
    // SENSOR VALUES
    // ======================================================

    const temperature =
        Number(data.temperature) || 0;

    const humidity =
        Number(data.humidity) || 0;

    const gas =
        Number(data.gas) || 0;

    const pressure =
        Number(data.pressure) || 0;

    const motion =
        data.motion === true;

    const impact =
        data.impact === true;

    const noMotion =
        data.noMotion === true;


    // ======================================================
    // UPDATE MAIN SENSOR VALUES
    // ======================================================

    setText(
        "temp",
        temperature.toFixed(1) + "°C"
    );


    setText(
        "hum",
        humidity.toFixed(0) + "%"
    );


    setText(
        "gas",
        gas.toFixed(0)
    );


    setText(
        "pressure",
        pressure.toFixed(1) + " hPa"
    );


    setText(
        "motion",
        motion ? "YES" : "NO"
    );


    // ======================================================
    // DASHBOARD SENSOR SUMMARY
    // ======================================================

    setText(
        "dashboardTemp",
        temperature.toFixed(1) + "°C"
    );


    setText(
        "dashboardHum",
        humidity.toFixed(0) + "%"
    );


    setText(
        "dashboardGas",
        gas.toFixed(0)
    );


    setText(
        "dashboardPressure",
        pressure.toFixed(1) + " hPa"
    );


    setText(
        "dashboardMotion",
        motion ? "YES" : "NO"
    );


    // ======================================================
    // WORKER ZONE
    // ======================================================

    if (data.zone !== undefined) {

        const firebaseZone =
            String(data.zone)
                .toUpperCase()
                .replace("ZONE", "")
                .trim();

        if (
            ["A", "B", "C", "D"].includes(firebaseZone)
        ) {
            currentWorkerZone = firebaseZone;
        }
    }


    updateWorkerZone();


    // ======================================================
    // BATTERY
    // ======================================================

    if (data.battery !== undefined) {

        const battery =
            Number(data.battery);

        setText(
            "battery",
            battery.toFixed(0) + "%"
        );

        setText(
            "workerBattery",
            battery.toFixed(0) + "%"
        );
    }


    // ======================================================
    // ESP32 SYSTEM STATUS
    // ======================================================

    updateDeviceStatus(
        data.systemStatus
    );


    // ======================================================
    // ALERT SYSTEM
    // ======================================================

    const alertInfo =
        calculateAlert(
            temperature,
            gas,
            impact,
            noMotion
        );


    updateAlertUI(
        alertInfo.status,
        alertInfo.reason
    );


    // ======================================================
    // AI RISK SCORE
    // ======================================================

    const riskInfo =
        calculateRiskScore(
            temperature,
            humidity,
            gas,
            pressure,
            motion,
            impact,
            noMotion
        );


    updateRiskUI(riskInfo);


    // ======================================================
    // ZONES
    // ======================================================

    updateZones(
        temperature,
        gas,
        pressure,
        impact,
        noMotion
    );


    // ======================================================
    // EVACUATION
    // ======================================================

    updateEvacuation(
        temperature,
        gas,
        pressure,
        impact,
        noMotion
    );


    // ======================================================
    // ALERT HISTORY
    // ======================================================

    updateAlertHistory(
        alertInfo.status,
        alertInfo.reason
    );


    // ======================================================
    // CHARTS
    // ======================================================

    updateCharts(
        temperature,
        gas,
        pressure
    );

});


// ==========================================================
// SAFE TEXT HELPER
// ==========================================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.innerText = value;
    }
}


// ==========================================================
// WORKER ZONE UPDATE
// ==========================================================

function updateWorkerZone() {

    setText(
        "workerZone",
        "Zone " + currentWorkerZone
    );

    setText(
        "workerZoneDetail",
        "Zone " + currentWorkerZone
    );

    setText(
        "currentZone",
        "ZONE " + currentWorkerZone
    );
}


// ==========================================================
// DEVICE STATUS
// ==========================================================

function updateDeviceStatus(systemStatus) {

    const device =
        document.getElementById("device");

    const dashboardDevice =
        document.getElementById("dashboardDevice");

    const workerDevice =
        document.getElementById("workerDevice");

    const statusBox =
        document.querySelector(".header-right .status");


    // IMPORTANT:
    // Default is DISCONNECTED.
    // It will become CONNECTED only when
    // Firebase systemStatus is exactly ONLINE.

    let online = false;


    if (
        systemStatus !== undefined &&
        systemStatus !== null
    ) {

        online =
            String(systemStatus)
                .toUpperCase()
                .trim() === "ONLINE";
    }


    const text =
        online
            ? "ESP32 Connected"
            : "ESP32 Disconnected";


    // Header
    if (device) {
        device.innerText = text;
    }


    // Dashboard
    if (dashboardDevice) {
        dashboardDevice.innerText = text;
    }


    // Worker page
    if (workerDevice) {
        workerDevice.innerText = text;
    }


    // Header status box
    if (statusBox) {

        if (online) {

            statusBox.style.background = "#166534";

            statusBox.innerHTML =
                '🟢 <span id="device">ESP32 Connected</span>';

        } else {

            statusBox.style.background = "#991b1b";

            statusBox.innerHTML =
                '🔴 <span id="device">ESP32 Disconnected</span>';
        }
    }
}


// ==========================================================
// ALERT CALCULATION
// ==========================================================

function calculateAlert(
    temperature,
    gas,
    impact,
    noMotion
) {

    let status = "SAFE";

    let reason = "No Hazard Detected";


    // Dangerous gas
    if (gas >= 1200) {

        status = "DANGER";

        reason =
            "Dangerous Gas Level Detected";
    }


    // Temperature
    else if (temperature >= 40) {

        status = "DANGER";

        reason =
            "High Temperature Detected";
    }


    // Impact
    else if (impact) {

        status = "DANGER";

        reason =
            "Worker Impact Detected";
    }


    // No motion
    else if (noMotion) {

        status = "WARNING";

        reason =
            "No Motion Detected";
    }


    return {
        status,
        reason
    };
}


// ==========================================================
// ALERT UI
// ==========================================================

function updateAlertUI(
    status,
    reason
) {

    const statusElement =
        document.getElementById("status");

    const reasonElement =
        document.getElementById("reason");


    if (statusElement) {

        statusElement.innerText =
            status;


        if (status === "DANGER") {

            statusElement.style.color =
                "#ef4444";

        } else if (status === "WARNING") {

            statusElement.style.color =
                "#facc15";

        } else {

            statusElement.style.color =
                "#22c55e";
        }
    }


    if (reasonElement) {
        reasonElement.innerText =
            reason;
    }


    // Dashboard latest alert
    setText(
        "dashboardAlert",
        reason
    );


    setText(
        "dashboardAlertStatus",
        status === "DANGER"
            ? "🔴 DANGER"
            : status === "WARNING"
                ? "🟡 WARNING"
                : "🟢 SAFE"
    );
}


// ==========================================================
// AI RISK SCORE
// ==========================================================

function calculateRiskScore(
    temperature,
    humidity,
    gas,
    pressure,
    motion,
    impact,
    noMotion
) {

    let score = 0;

    let predictedHazard =
        "No Hazard";

    let confidence = 90;

    let recommendedAction =
        "Normal Monitoring";


    // ======================================================
    // GAS
    // ======================================================

    if (gas >= 1200) {

        score += 40;

        predictedHazard =
            "Dangerous Gas Level";

        confidence = 94;

        recommendedAction =
            "Evacuate affected zone";

    } else if (gas >= 800) {

        score += 25;

        predictedHazard =
            "Rising Gas Level";

        confidence = 82;

        recommendedAction =
            "Monitor gas level closely";

    } else if (gas >= 500) {

        score += 12;
    }


    // ======================================================
    // TEMPERATURE
    // ======================================================

    if (temperature >= 45) {

        score += 30;

        predictedHazard =
            "Extreme Temperature";

        confidence = 92;

        recommendedAction =
            "Move worker to safer area";

    } else if (temperature >= 40) {

        score += 20;

        if (
            predictedHazard === "No Hazard"
        ) {

            predictedHazard =
                "High Temperature";
        }

        recommendedAction =
            "Monitor temperature";

    } else if (temperature >= 35) {

        score += 10;
    }


    // ======================================================
    // PRESSURE
    // ======================================================

    if (
        pressure > 1000 ||
        (pressure > 0 && pressure < 850)
    ) {

        score += 15;

        if (
            predictedHazard === "No Hazard"
        ) {

            predictedHazard =
                "Abnormal Pressure";
        }
    }


    // ======================================================
    // HUMIDITY
    // ======================================================

    if (humidity >= 85) {

        score += 8;

    } else if (humidity >= 75) {

        score += 4;
    }


    // ======================================================
    // IMPACT
    // ======================================================

    if (impact) {

        score += 25;

        predictedHazard =
            "Worker Impact Detected";

        confidence = 96;

        recommendedAction =
            "Check worker immediately";
    }


    // ======================================================
    // NO MOTION
    // ======================================================

    if (noMotion) {

        score += 20;

        predictedHazard =
            "Possible Worker Inactivity";

        confidence = 88;

        recommendedAction =
            "Check worker condition";
    }


    // ======================================================
    // MOTION
    // ======================================================

    if (!motion && !noMotion) {

        score += 5;
    }


    // ======================================================
    // LIMIT SCORE
    // ======================================================

    score =
        Math.min(score, 100);


    // ======================================================
    // RISK LEVEL
    // ======================================================

    let riskLevel =
        "LOW RISK";


    if (score >= 75) {

        riskLevel =
            "CRITICAL RISK";

    } else if (score >= 50) {

        riskLevel =
            "HIGH RISK";

    } else if (score >= 25) {

        riskLevel =
            "MEDIUM RISK";
    }


    return {
        score,
        riskLevel,
        predictedHazard,
        confidence,
        recommendedAction
    };
}


// ==========================================================
// UPDATE RISK UI
// ==========================================================

function updateRiskUI(risk) {

    // Dashboard
    setText(
        "riskScore",
        risk.score
    );

    setText(
        "riskLevel",
        risk.riskLevel
    );

    setText(
        "predictedHazard",
        risk.predictedHazard
    );

    setText(
        "riskConfidence",
        risk.confidence + "%"
    );

    setText(
        "recommendedAction",
        risk.recommendedAction
    );


    // AI Risk page
    setText(
        "riskScoreDetail",
        risk.score
    );

    setText(
        "riskLevelDetail",
        risk.riskLevel
    );

    setText(
        "predictedHazardDetail",
        risk.predictedHazard
    );

    setText(
        "riskConfidenceDetail",
        risk.confidence + "%"
    );

    setText(
        "recommendedActionDetail",
        risk.recommendedAction
    );


    // Risk colors
    const scoreElement =
        document.getElementById("riskScore");

    const levelElement =
        document.getElementById("riskLevel");

    const scoreDetail =
        document.getElementById("riskScoreDetail");

    const levelDetail =
        document.getElementById("riskLevelDetail");


    let color =
        "#22c55e";


    if (risk.score >= 75) {

        color =
            "#ef4444";

    } else if (risk.score >= 50) {

        color =
            "#f97316";

    } else if (risk.score >= 25) {

        color =
            "#facc15";
    }


    if (scoreElement) {
        scoreElement.style.color = color;
    }

    if (levelElement) {
        levelElement.style.color = color;
    }

    if (scoreDetail) {
        scoreDetail.style.color = color;
    }

    if (levelDetail) {
        levelDetail.style.color = color;
    }
}


// ==========================================================
// ZONE MONITORING
// ==========================================================

function updateZones(
    temperature,
    gas,
    pressure,
    impact,
    noMotion
) {

    let zoneStatus =
        "SAFE";


    if (
        gas >= 1200 ||
        temperature >= 45 ||
        impact
    ) {

        zoneStatus =
            "DANGER";

    } else if (
        gas >= 800 ||
        temperature >= 40 ||
        pressure > 1000 ||
        (pressure > 0 && pressure < 850) ||
        noMotion
    ) {

        zoneStatus =
            "WARNING";
    }


    // Reset zones
    setZone(
        "zoneA",
        "zoneAStatus",
        "SAFE"
    );

    setZone(
        "zoneB",
        "zoneBStatus",
        "SAFE"
    );

    setZone(
        "zoneC",
        "zoneCStatus",
        "SAFE"
    );

    setZone(
        "zoneD",
        "zoneDStatus",
        "SAFE"
    );


    // Apply current zone status
    setZone(
        "zone" + currentWorkerZone,
        "zone" + currentWorkerZone + "Status",
        zoneStatus
    );
}


// ==========================================================
// ZONE HELPER
// ==========================================================

function setZone(
    zoneId,
    statusId,
    status
) {

    const zone =
        document.getElementById(zoneId);

    const statusText =
        document.getElementById(statusId);


    if (!zone || !statusText) {
        return;
    }


    zone.classList.remove(
        "safe",
        "warning",
        "danger"
    );


    if (status === "DANGER") {

        zone.classList.add("danger");

        statusText.innerText =
            "🔴 DANGER";

    } else if (status === "WARNING") {

        zone.classList.add("warning");

        statusText.innerText =
            "🟡 WARNING";

    } else {

        zone.classList.add("safe");

        statusText.innerText =
            "🟢 SAFE";
    }
}


// ==========================================================
// EVACUATION SYSTEM
// ==========================================================

function updateEvacuation(
    temperature,
    gas,
    pressure,
    impact,
    noMotion
) {

    let evacuationRequired =
        false;

    let reason =
        "No evacuation required.";

    let safeZone =
        getSafeZone(currentWorkerZone);


    // Dangerous gas
    if (gas >= 1200) {

        evacuationRequired =
            true;

        reason =
            "Dangerous gas concentration detected.";

    }


    // Extreme temperature
    else if (temperature >= 45) {

        evacuationRequired =
            true;

        reason =
            "Extreme temperature detected.";

    }


    // Impact
    else if (impact) {

        evacuationRequired =
            true;

        reason =
            "Worker impact detected.";

    }


    // No motion
    else if (noMotion) {

        evacuationRequired =
            true;

        reason =
            "No worker motion detected.";

    }


    // Abnormal pressure
    else if (
        pressure > 1000 ||
        (pressure > 0 && pressure < 850)
    ) {

        evacuationRequired =
            true;

        reason =
            "Abnormal pressure detected.";
    }


    setText(
        "currentZone",
        "ZONE " + currentWorkerZone
    );


    setText(
        "safeZone",
        safeZone
    );


    setText(
        "evacuationReason",
        reason
    );


    const statusElement =
        document.getElementById(
            "evacuationStatus"
        );


    if (statusElement) {

        if (evacuationRequired) {

            statusElement.innerText =
                "🚨 EVACUATION REQUIRED";

            statusElement.style.color =
                "#ef4444";

        } else {

            statusElement.innerText =
                "NO EVACUATION";

            statusElement.style.color =
                "#22c55e";
        }
    }
}


// ==========================================================
// SAFE ZONE
// ==========================================================

function getSafeZone(currentZone) {

    const safeZoneMap = {

        A: "ZONE D",

        B: "ZONE A",

        C: "ZONE D",

        D: "ZONE B"
    };


    return safeZoneMap[currentZone]
        || "ZONE D";
}


// ==========================================================
// ALERT HISTORY
// ==========================================================

function updateAlertHistory(
    status,
    reason
) {

    const table =
        document.getElementById(
            "historyTable"
        );


    if (!table) {
        return;
    }


    // Only add a new row when alert changes
    const alertKey =
        status + "-" + reason;


    if (lastAlert === alertKey) {
        return;
    }


    lastAlert = alertKey;


    // For SAFE
    if (status === "SAFE") {

        table.innerHTML = `
            <tr>
                <td>${new Date().toLocaleTimeString()}</td>
                <td>Worker-01</td>
                <td>Zone ${currentWorkerZone}</td>
                <td>No Alerts</td>
                <td>🟢 SAFE</td>
            </tr>
        `;

        return;
    }


    const row =
        document.createElement("tr");


    const statusText =
        status === "DANGER"
            ? "🔴 DANGER"
            : "🟡 WARNING";


    row.innerHTML = `
        <td>${new Date().toLocaleTimeString()}</td>
        <td>Worker-01</td>
        <td>Zone ${currentWorkerZone}</td>
        <td>${reason}</td>
        <td>${statusText}</td>
    `;


    table.prepend(row);


    // Keep latest 10 alerts
    while (table.rows.length > 10) {

        table.deleteRow(
            table.rows.length - 1
        );
    }
}


// ==========================================================
// CLOCK
// ==========================================================

function updateClock() {

    const clock =
        document.getElementById("clock");


    if (clock) {

        clock.innerText =
            new Date().toLocaleTimeString();
    }
}


setInterval(
    updateClock,
    1000
);


updateClock();


// ==========================================================
// CHART VARIABLES
// ==========================================================

let tempChart = null;

let gasChart = null;

let pressureChart = null;


// ==========================================================
// INITIALIZE CHARTS
// ==========================================================

function initializeCharts() {

    const tempCanvas =
        document.getElementById("tempChart");

    const gasCanvas =
        document.getElementById("gasChart");

    const pressureCanvas =
        document.getElementById("pressureChart");


    if (
        !tempCanvas ||
        !gasCanvas ||
        !pressureCanvas
    ) {
        return;
    }


    const tempCtx =
        tempCanvas.getContext("2d");

    const gasCtx =
        gasCanvas.getContext("2d");

    const pressureCtx =
        pressureCanvas.getContext("2d");


    // ======================================================
    // TEMPERATURE CHART
    // ======================================================

    tempChart =
        new Chart(tempCtx, {

            type: "line",

            data: {

                labels: [],

                datasets: [{

                    label: "Temperature (°C)",

                    data: [],

                    borderWidth: 3,

                    tension: 0.3,

                    fill: false
                }]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: false,

                scales: {

                    y: {

                        beginAtZero: false
                    }
                }
            }
        });


    // ======================================================
    // GAS CHART
    // ======================================================

    gasChart =
        new Chart(gasCtx, {

            type: "line",

            data: {

                labels: [],

                datasets: [{

                    label: "Gas Level",

                    data: [],

                    borderWidth: 3,

                    tension: 0.3,

                    fill: false
                }]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: false
            }
        });


    // ======================================================
    // PRESSURE CHART
    // ======================================================

    pressureChart =
        new Chart(pressureCtx, {

            type: "line",

            data: {

                labels: [],

                datasets: [{

                    label: "Pressure (hPa)",

                    data: [],

                    borderWidth: 3,

                    tension: 0.3,

                    fill: false
                }]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: false
            }
        });
}


// ==========================================================
// UPDATE CHARTS
// ==========================================================

function updateCharts(
    temperature,
    gas,
    pressure
) {

    if (
        !tempChart ||
        !gasChart ||
        !pressureChart
    ) {
        return;
    }


    const time =
        new Date().toLocaleTimeString();


    // ======================================================
    // TEMPERATURE
    // ======================================================

    tempChart.data.labels.push(time);

    tempChart.data.datasets[0]
        .data.push(temperature);


    if (
        tempChart.data.labels.length > 10
    ) {

        tempChart.data.labels.shift();

        tempChart.data.datasets[0]
            .data.shift();
    }


    tempChart.update("none");


    // ======================================================
    // GAS
    // ======================================================

    gasChart.data.labels.push(time);

    gasChart.data.datasets[0]
        .data.push(gas);


    if (
        gasChart.data.labels.length > 10
    ) {

        gasChart.data.labels.shift();

        gasChart.data.datasets[0]
            .data.shift();
    }


    gasChart.update("none");


    // ======================================================
    // PRESSURE
    // ======================================================

    pressureChart.data.labels.push(time);

    pressureChart.data.datasets[0]
        .data.push(pressure);


    if (
        pressureChart.data.labels.length > 10
    ) {

        pressureChart.data.labels.shift();

        pressureChart.data.datasets[0]
            .data.shift();
    }


    pressureChart.update("none");
}


// ==========================================================
// START CHARTS AFTER PAGE LOAD
// ==========================================================

window.addEventListener(
    "load",
    () => {

        initializeCharts();

    }
);