// ==========================================================
// HAZARDSHIELD AI
// FIREBASE-FREE DUMMY SAFETY SIMULATION
// ==========================================================


// ==========================================================
// GLOBAL DATA
// ==========================================================

let currentWorkerIndex = 0;

let lastAlertKey = "";

let alertHistory = [];

let simulationTick = 0;


// ==========================================================
// 10 WORKERS
// ==========================================================

const workers = [

    {
        id: "Worker-01",
        name: "Rahul Kumar",
        zone: "A",
        battery: 96
    },

    {
        id: "Worker-02",
        name: "Amit Sharma",
        zone: "A",
        battery: 91
    },

    {
        id: "Worker-03",
        name: "Vikas Rawat",
        zone: "A",
        battery: 87
    },

    {
        id: "Worker-04",
        name: "Rohit Singh",
        zone: "B",
        battery: 94
    },

    {
        id: "Worker-05",
        name: "Deepak Joshi",
        zone: "B",
        battery: 82
    },

    {
        id: "Worker-06",
        name: "Arjun Bisht",
        zone: "B",
        battery: 89
    },

    {
        id: "Worker-07",
        name: "Karan Negi",
        zone: "C",
        battery: 95
    },

    {
        id: "Worker-08",
        name: "Mohit Thakur",
        zone: "C",
        battery: 84
    },

    {
        id: "Worker-09",
        name: "Sahil Rana",
        zone: "D",
        battery: 92
    },

    {
        id: "Worker-10",
        name: "Naveen Mehta",
        zone: "D",
        battery: 88
    }

];


// ==========================================================
// SENSOR DATA
// ==========================================================

let sensorData = {

    temperature: 29,

    humidity: 58,

    gas: 350,

    pressure: 970,

    motion: true,

    heartRate: 72,

    impact: false,

    noMotion: false

};


// ==========================================================
// TAB SYSTEM
// ==========================================================

function showTab(tabId) {

    const tabs =
        document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {

        tab.classList.remove("active");

    });


    const buttons =
        document.querySelectorAll(".nav-btn");

    buttons.forEach(button => {

        button.classList.remove("active");

    });


    const selected =
        document.getElementById(tabId);

    if (selected) {

        selected.classList.add("active");

    }


    buttons.forEach(button => {

        const text =
            button.getAttribute("onclick");

        if (
            text &&
            text.includes("'" + tabId + "'")
        ) {

            button.classList.add("active");

        }

    });

}


// ==========================================================
// HELPER
// ==========================================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.innerText = value;

    }

}


// ==========================================================
// RANDOM NUMBER
// ==========================================================

function randomBetween(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


// ==========================================================
// KEEP VALUE IN RANGE
// ==========================================================

function clamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );

}


// ==========================================================
// GENERATE SENSOR VALUES
// ==========================================================

function generateDummySensors() {

    simulationTick++;


    // ------------------------------------------
    // NORMAL SMALL CHANGES
    // ------------------------------------------

    sensorData.temperature =
        clamp(
            sensorData.temperature +
            randomBetween(-2, 2),
            25,
            38
        );


    sensorData.humidity =
        clamp(
            sensorData.humidity +
            randomBetween(-3, 3),
            40,
            78
        );


    sensorData.gas =
        clamp(
            sensorData.gas +
            randomBetween(-50, 50),
            200,
            700
        );


    sensorData.pressure =
        clamp(
            sensorData.pressure +
            randomBetween(-5, 5),
            900,
            995
        );


    sensorData.heartRate =
        clamp(
            sensorData.heartRate +
            randomBetween(-4, 4),
            60,
            105
        );


    sensorData.motion =
        Math.random() > 0.12;


    sensorData.impact = false;

    sensorData.noMotion = false;


    // ======================================================
    // AUTOMATIC HAZARD SCENARIOS
    // ======================================================

    // Every ~25 seconds gas danger
    if (simulationTick % 25 === 0) {

        sensorData.gas = randomBetween(
            1250,
            1450
        );

    }


    // Every ~40 seconds high temperature
    if (simulationTick % 40 === 0) {

        sensorData.temperature =
            randomBetween(41, 47);

    }


    // Every ~55 seconds abnormal heart rate
    if (simulationTick % 55 === 0) {

        sensorData.heartRate =
            randomBetween(115, 135);

    }


    // Every ~70 seconds impact
    if (simulationTick % 70 === 0) {

        sensorData.impact = true;

    }


    // Every ~85 seconds no motion
    if (simulationTick % 85 === 0) {

        sensorData.motion = false;

        sensorData.noMotion = true;

    }


    // Pressure event
    if (simulationTick % 100 === 0) {

        sensorData.pressure =
            randomBetween(820, 840);

    }

}


// ==========================================================
// CURRENT WORKER
// ==========================================================

function getCurrentWorker() {

    return workers[currentWorkerIndex];

}


// ==========================================================
// UPDATE WORKER INFO
// ==========================================================

function updateCurrentWorker() {

    const worker =
        getCurrentWorker();


    setText(
        "workerId",
        worker.id
    );


    setText(
        "workerName",
        worker.name
    );


    setText(
        "workerZone",
        "Zone " + worker.zone
    );


    setText(
        "battery",
        worker.battery + "%"
    );


    setText(
        "currentZone",
        "ZONE " + worker.zone
    );


    setText(
        "heartWorker",
        worker.id
    );

}


// ==========================================================
// DASHBOARD SENSOR UI
// ==========================================================

function updateSensorUI() {

    const temperature =
        sensorData.temperature;

    const humidity =
        sensorData.humidity;

    const gas =
        sensorData.gas;

    const pressure =
        sensorData.pressure;

    const motion =
        sensorData.motion;

    const heart =
        sensorData.heartRate;


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


    setText(
        "heartRate",
        heart + " BPM"
    );


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


    setText(
        "dashboardHeart",
        heart + " BPM"
    );


    setText(
        "heartRateDetail",
        heart + " BPM"
    );


    setText(
        "heartCurrent",
        heart + " BPM"
    );


    updateHeartStatus();

}


// ==========================================================
// HEART STATUS
// ==========================================================

function updateHeartStatus() {

    const heart =
        sensorData.heartRate;

    let status =
        "NORMAL";

    let color =
        "#22c55e";


    if (heart >= 120) {

        status =
            "HIGH HEART RATE";

        color =
            "#ef4444";

    }

    else if (heart >= 105) {

        status =
            "ELEVATED";

        color =
            "#f59e0b";

    }

    else if (heart < 55) {

        status =
            "LOW HEART RATE";

        color =
            "#f59e0b";

    }


    const statusElement =
        document.getElementById(
            "heartStatus"
        );


    const healthElement =
        document.getElementById(
            "heartHealth"
        );


    if (statusElement) {

        statusElement.innerText =
            status;

        statusElement.style.color =
            color;

    }


    if (healthElement) {

        healthElement.innerText =
            status;

        healthElement.style.color =
            color;

    }

}


// ==========================================================
// ALERT CALCULATION
// ==========================================================

function calculateAlert() {

    const t =
        sensorData.temperature;

    const gas =
        sensorData.gas;

    const heart =
        sensorData.heartRate;

    const pressure =
        sensorData.pressure;

    const impact =
        sensorData.impact;

    const noMotion =
        sensorData.noMotion;


    let status =
        "SAFE";

    let reason =
        "No Hazard Detected";


    // Highest priority

    if (gas >= 1200) {

        status =
            "DANGER";

        reason =
            "Dangerous Gas Level Detected";

    }

    else if (t >= 40) {

        status =
            "DANGER";

        reason =
            "High Temperature Detected";

    }

    else if (impact) {

        status =
            "DANGER";

        reason =
            "Worker Impact Detected";

    }

    else if (heart >= 120) {

        status =
            "DANGER";

        reason =
            "Abnormal Heart Rate Detected";

    }

    else if (pressure < 850) {

        status =
            "WARNING";

        reason =
            "Abnormal Pressure Detected";

    }

    else if (heart >= 105) {

        status =
            "WARNING";

        reason =
            "Elevated Heart Rate";

    }

    else if (noMotion) {

        status =
            "WARNING";

        reason =
            "No Worker Motion Detected";

    }


    return {
        status,
        reason
    };

}


// ==========================================================
// ALERT UI
// ==========================================================

function updateAlertUI(alert) {

    const statusElement =
        document.getElementById("status");


    const reasonElement =
        document.getElementById("reason");


    if (statusElement) {

        statusElement.innerText =
            alert.status;


        if (alert.status === "DANGER") {

            statusElement.style.color =
                "#ef4444";

        }

        else if (alert.status === "WARNING") {

            statusElement.style.color =
                "#facc15";

        }

        else {

            statusElement.style.color =
                "#22c55e";

        }

    }


    if (reasonElement) {

        reasonElement.innerText =
            alert.reason;

    }


    setText(
        "dashboardAlert",
        alert.reason
    );


    setText(
        "dashboardAlertStatus",

        alert.status === "DANGER"
            ? "🔴 DANGER"
            : alert.status === "WARNING"
                ? "🟡 WARNING"
                : "🟢 SAFE"

    );

}


// ==========================================================
// AI RISK SCORE
// ==========================================================

function calculateRisk() {

    const t =
        sensorData.temperature;

    const humidity =
        sensorData.humidity;

    const gas =
        sensorData.gas;

    const pressure =
        sensorData.pressure;

    const heart =
        sensorData.heartRate;

    const impact =
        sensorData.impact;

    const noMotion =
        sensorData.noMotion;


    let score = 0;

    let hazard =
        "No Hazard";

    let confidence =
        90;

    let action =
        "Normal Monitoring";


    // GAS

    if (gas >= 1200) {

        score += 40;

        hazard =
            "Dangerous Gas Level";

        confidence =
            95;

        action =
            "Evacuate affected zone";

    }

    else if (gas >= 800) {

        score += 25;

        hazard =
            "Rising Gas Level";

        confidence =
            83;

        action =
            "Monitor gas level closely";

    }

    else if (gas >= 500) {

        score += 12;

    }


    // TEMPERATURE

    if (t >= 45) {

        score += 30;

        hazard =
            "Extreme Temperature";

        confidence =
            94;

        action =
            "Move worker to safer area";

    }

    else if (t >= 40) {

        score += 20;

        hazard =
            "High Temperature";

        action =
            "Monitor temperature";

    }

    else if (t >= 35) {

        score += 10;

    }


    // PRESSURE

    if (
        pressure < 850 ||
        pressure > 1000
    ) {

        score += 15;

        if (hazard === "No Hazard") {

            hazard =
                "Abnormal Pressure";

        }

    }


    // HUMIDITY

    if (humidity >= 85) {

        score += 8;

    }

    else if (humidity >= 75) {

        score += 4;

    }


    // HEART RATE

    if (heart >= 120) {

        score += 25;

        hazard =
            "Abnormal Heart Rate";

        confidence =
            94;

        action =
            "Check worker immediately";

    }

    else if (heart >= 105) {

        score += 12;

        if (hazard === "No Hazard") {

            hazard =
                "Elevated Heart Rate";

        }

        action =
            "Monitor worker health";

    }


    // IMPACT

    if (impact) {

        score += 30;

        hazard =
            "Worker Impact Detected";

        confidence =
            97;

        action =
            "Check worker immediately";

    }


    // NO MOTION

    if (noMotion) {

        score += 20;

        hazard =
            "Possible Worker Inactivity";

        confidence =
            90;

        action =
            "Check worker condition";

    }


    score =
        Math.min(score, 100);


    let level =
        "LOW RISK";


    if (score >= 75) {

        level =
            "CRITICAL RISK";

    }

    else if (score >= 50) {

        level =
            "HIGH RISK";

    }

    else if (score >= 25) {

        level =
            "MEDIUM RISK";

    }


    return {
        score,
        level,
        hazard,
        confidence,
        action
    };

}


// ==========================================================
// UPDATE RISK UI
// ==========================================================

function updateRiskUI(risk) {

    setText(
        "riskScore",
        risk.score
    );


    setText(
        "riskLevel",
        risk.level
    );


    setText(
        "predictedHazard",
        risk.hazard
    );


    setText(
        "riskConfidence",
        risk.confidence + "%"
    );


    setText(
        "recommendedAction",
        risk.action
    );


    setText(
        "riskScoreDetail",
        risk.score
    );


    setText(
        "riskLevelDetail",
        risk.level
    );


    setText(
        "predictedHazardDetail",
        risk.hazard
    );


    setText(
        "riskConfidenceDetail",
        risk.confidence + "%"
    );


    setText(
        "recommendedActionDetail",
        risk.action
    );


    let color =
        "#22c55e";


    if (risk.score >= 75) {

        color =
            "#ef4444";

    }

    else if (risk.score >= 50) {

        color =
            "#f97316";

    }

    else if (risk.score >= 25) {

        color =
            "#facc15";

    }


    const scoreElement =
        document.getElementById("riskScore");

    const levelElement =
        document.getElementById("riskLevel");

    const detailScore =
        document.getElementById("riskScoreDetail");

    const detailLevel =
        document.getElementById("riskLevelDetail");


    [
        scoreElement,
        levelElement,
        detailScore,
        detailLevel
    ].forEach(element => {

        if (element) {

            element.style.color =
                color;

        }

    });

}


// ==========================================================
// ZONE MONITORING
// ==========================================================

function updateZones(alert) {

    const zones =
        ["A", "B", "C", "D"];


    zones.forEach(zone => {

        setZone(
            zone,
            "SAFE"
        );

    });


    const worker =
        getCurrentWorker();


    let currentStatus =
        "SAFE";


    if (
        alert.status === "DANGER"
    ) {

        currentStatus =
            "DANGER";

    }

    else if (
        alert.status === "WARNING"
    ) {

        currentStatus =
            "WARNING";

    }


    setZone(
        worker.zone,
        currentStatus
    );


    updateZoneWorkerCounts();

}


// ==========================================================
// ZONE HELPER
// ==========================================================

function setZone(
    zoneLetter,
    status
) {

    const zone =
        document.getElementById(
            "zone" + zoneLetter
        );

    const statusText =
        document.getElementById(
            "zone" + zoneLetter + "Status"
        );


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

    }

    else if (status === "WARNING") {

        zone.classList.add("warning");

        statusText.innerText =
            "🟡 WARNING";

    }

    else {

        zone.classList.add("safe");

        statusText.innerText =
            "🟢 SAFE";

    }

}


// ==========================================================
// WORKER COUNT
// ==========================================================

function updateZoneWorkerCounts() {

    const counts = {
        A: 0,
        B: 0,
        C: 0,
        D: 0
    };


    workers.forEach(worker => {

        counts[worker.zone]++;

    });


    setText(
        "zoneAWorker",
        "Workers: " + counts.A
    );

    setText(
        "zoneBWorker",
        "Workers: " + counts.B
    );

    setText(
        "zoneCWorker",
        "Workers: " + counts.C
    );

    setText(
        "zoneDWorker",
        "Workers: " + counts.D
    );

}


// ==========================================================
// EVACUATION
// ==========================================================

function updateEvacuation(alert) {

    const worker =
        getCurrentWorker();


    let required =
        false;

    let reason =
        "No evacuation required.";


    if (alert.status === "DANGER") {

        required =
            true;

        reason =
            alert.reason;

    }


    const safeZone =
        getSafeZone(
            worker.zone
        );


    setText(
        "currentZone",
        "ZONE " + worker.zone
    );


    setText(
        "safeZone",
        safeZone
    );


    setText(
        "evacuationReason",
        reason
    );


    const status =
        document.getElementById(
            "evacuationStatus"
        );


    const card =
        document.querySelector(
            ".evacuation-status-card"
        );


    if (required) {

        status.innerText =
            "🚨 EVACUATION REQUIRED";

        status.style.color =
            "#ef4444";

        if (card) {

            card.style.borderColor =
                "#ef4444";

        }

    }

    else {

        status.innerText =
            "NO EVACUATION";

        status.style.color =
            "#22c55e";

        if (card) {

            card.style.borderColor =
                "#22c55e";

        }

    }

}


// ==========================================================
// SAFE ZONE
// ==========================================================

function getSafeZone(zone) {

    const map = {

        A: "ZONE D",

        B: "ZONE A",

        C: "ZONE D",

        D: "ZONE B"

    };


    return map[zone] || "ZONE D";

}


// ==========================================================
// ALERT HISTORY
// ==========================================================

function updateAlertHistory(alert) {

    const key =
        alert.status + "-" +
        alert.reason;


    if (
        key === lastAlertKey
    ) {

        return;

    }


    lastAlertKey =
        key;


    // Don't flood table with SAFE updates

    if (
        alert.status === "SAFE"
    ) {

        return;

    }


    const worker =
        getCurrentWorker();


    const entry = {

        time:
            new Date().toLocaleTimeString(),

        worker:
            worker.id,

        zone:
            "Zone " + worker.zone,

        alert:
            alert.reason,

        status:
            alert.status

    };


    alertHistory.unshift(
        entry
    );


    if (
        alertHistory.length > 10
    ) {

        alertHistory.pop();

    }


    renderAlertHistory();

}


// ==========================================================
// RENDER ALERT HISTORY
// ==========================================================

function renderAlertHistory() {

    const table =
        document.getElementById(
            "historyTable"
        );


    if (!table) {

        return;

    }


    table.innerHTML = "";


    alertHistory.forEach(entry => {

        const row =
            document.createElement("tr");


        const statusText =
            entry.status === "DANGER"
                ? "🔴 DANGER"
                : "🟡 WARNING";


        row.innerHTML = `

            <td>${entry.time}</td>

            <td>${entry.worker}</td>

            <td>${entry.zone}</td>

            <td>${entry.alert}</td>

            <td>${statusText}</td>

        `;


        table.appendChild(row);

    });


    if (
        alertHistory.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td>--:--</td>

                <td>System</td>

                <td>--</td>

                <td>No Alerts</td>

                <td>🟢 SAFE</td>

            </tr>

        `;

    }

}


// ==========================================================
// WORKER CARDS
// ==========================================================

function renderWorkers() {

    const grid =
        document.getElementById(
            "workerGrid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML = "";


    workers.forEach(
        (worker, index) => {

            const card =
                document.createElement(
                    "div"
                );


            let workerStatus =
                "SAFE";

            let statusClass =
                "worker-safe";


            if (
                index === currentWorkerIndex
            ) {

                if (
                    sensorData.impact ||
                    sensorData.heartRate >= 120
                ) {

                    workerStatus =
                        "DANGER";

                    statusClass =
                        "worker-danger";

                }

                else if (
                    sensorData.heartRate >= 105 ||
                    sensorData.noMotion
                ) {

                    workerStatus =
                        "WARNING";

                    statusClass =
                        "worker-warning";

                }

            }


            card.className =
                "worker-card " +
                statusClass;


            card.innerHTML = `

                <h2>👷 ${worker.id}</h2>

                <div class="worker-info">

                    <div>
                        <span>Name</span>
                        <b>${worker.name}</b>
                    </div>

                    <div>
                        <span>Zone</span>
                        <b>ZONE ${worker.zone}</b>
                    </div>

                    <div>
                        <span>Battery</span>
                        <b>${worker.battery}%</b>
                    </div>

                    <div>
                        <span>Heart Rate</span>
                        <b>
                            ${
                                index === currentWorkerIndex
                                ? sensorData.heartRate + " BPM"
                                : randomBetween(65, 90) + " BPM"
                            }
                        </b>
                    </div>

                    <div>
                        <span>Status</span>
                        <b>${workerStatus}</b>
                    </div>

                    <div>
                        <span>Helmet</span>
                        <b>🟢 Connected</b>
                    </div>

                </div>

            `;


            grid.appendChild(card);

        }
    );

}


// ==========================================================
// CHART VARIABLES
// ==========================================================

let tempChart = null;

let gasChart = null;

let pressureChart = null;

let heartChart = null;


// ==========================================================
// INITIALIZE CHARTS
// ==========================================================

function initializeCharts() {

    const tempCanvas =
        document.getElementById(
            "tempChart"
        );

    const gasCanvas =
        document.getElementById(
            "gasChart"
        );

    const pressureCanvas =
        document.getElementById(
            "pressureChart"
        );

    const heartCanvas =
        document.getElementById(
            "heartChart"
        );


    if (
        !tempCanvas ||
        !gasCanvas ||
        !pressureCanvas ||
        !heartCanvas
    ) {

        return;

    }


    tempChart =
        createChart(
            tempCanvas,
            "Temperature (°C)"
        );


    gasChart =
        createChart(
            gasCanvas,
            "Gas Level"
        );


    pressureChart =
        createChart(
            pressureCanvas,
            "Pressure (hPa)"
        );


    heartChart =
        createChart(
            heartCanvas,
            "Heart Rate (BPM)"
        );

}


// ==========================================================
// CREATE CHART
// ==========================================================

function createChart(
    canvas,
    label
) {

    return new Chart(
        canvas.getContext("2d"),
        {

            type: "line",

            data: {

                labels: [],

                datasets: [{

                    label: label,

                    data: [],

                    borderWidth: 3,

                    tension: .3,

                    fill: false

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                animation: false

            }

        }
    );

}


// ==========================================================
// UPDATE CHARTS
// ==========================================================

function updateCharts() {

    if (
        !tempChart ||
        !gasChart ||
        !pressureChart ||
        !heartChart
    ) {

        return;

    }


    const time =
        new Date().toLocaleTimeString();


    addChartPoint(
        tempChart,
        time,
        sensorData.temperature
    );


    addChartPoint(
        gasChart,
        time,
        sensorData.gas
    );


    addChartPoint(
        pressureChart,
        time,
        sensorData.pressure
    );


    addChartPoint(
        heartChart,
        time,
        sensorData.heartRate
    );

}


// ==========================================================
// CHART POINT
// ==========================================================

function addChartPoint(
    chart,
    time,
    value
) {

    chart.data.labels.push(time);

    chart.data.datasets[0]
        .data.push(value);


    if (
        chart.data.labels.length > 15
    ) {

        chart.data.labels.shift();

        chart.data.datasets[0]
            .data.shift();

    }


    chart.update("none");

}


// ==========================================================
// CLOCK
// ==========================================================

function updateClock() {

    setText(
        "clock",
        new Date().toLocaleTimeString()
    );

}


// ==========================================================
// MAIN SIMULATION
// ==========================================================

function runSimulation() {

    generateDummySensors();

    updateCurrentWorker();

    updateSensorUI();


    const alert =
        calculateAlert();


    const risk =
        calculateRisk();


    updateAlertUI(alert);

    updateRiskUI(risk);

    updateZones(alert);

    updateEvacuation(alert);

    updateAlertHistory(alert);

    renderWorkers();

    updateCharts();

}


// ==========================================================
// CHANGE CURRENT WORKER
// ==========================================================

function rotateWorker() {

    currentWorkerIndex++;

    if (
        currentWorkerIndex >= workers.length
    ) {

        currentWorkerIndex = 0;

    }

}


// ==========================================================
// START
// ==========================================================

window.addEventListener(
    "load",
    () => {

        initializeCharts();

        renderWorkers();

        updateClock();

        runSimulation();


        // Sensor updates every 2 seconds

        setInterval(
            runSimulation,
            2000
        );


        // Switch monitored worker every 12 seconds

        setInterval(
            () => {

                rotateWorker();

                updateCurrentWorker();

                renderWorkers();

            },
            12000
        );


        // Clock

        setInterval(
            updateClock,
            1000
        );

    }
);