// ===============================
// SafeMine AI - Firebase Connection
// ===============================

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAc2C2qEXujPTLwy1O7QYNBY6XZHrXqMAw",
    authDomain: "safemine-smart-helmet.firebaseapp.com",
    databaseURL: "https://safemine-smart-helmet-default-rtdb.firebaseio.com",
    projectId: "safemine-smart-helmet",
    storageBucket: "safemine-smart-helmet.firebasestorage.app",
    messagingSenderId: "188214160498",
    appId: "1:188214160498:web:ffea2fbd04bc2e366e66eb",
    measurementId: "G-L2Y7Z4V3M1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Realtime Database
const db = firebase.database();

// SafeMine data location
const safeMineRef = db.ref("SafeMine");


// ===============================
// DASHBOARD DATA
// ===============================

safeMineRef.on("value", (snapshot) => {

    const data = snapshot.val();

    if (!data) {
        console.log("No SafeMine data found");
        return;
    }

    console.log("Firebase Data:", data);


    // -------------------------------
    // Temperature
    // -------------------------------
    if (data.temperature !== undefined) {
        document.getElementById("temp").innerText =
            Number(data.temperature).toFixed(1) + "°C";
    }


    // -------------------------------
    // Humidity
    // -------------------------------
    if (data.humidity !== undefined) {
        document.getElementById("hum").innerText =
            Number(data.humidity).toFixed(0) + "%";
    }


    // -------------------------------
    // Gas
    // -------------------------------
    if (data.gas !== undefined) {
        document.getElementById("gas").innerText =
            Number(data.gas).toFixed(0);
    }


    // -------------------------------
    // Pressure
    // -------------------------------
    if (data.pressure !== undefined) {
        document.getElementById("pressure").innerText =
            Number(data.pressure).toFixed(1) + " hPa";
    }


    // -------------------------------
    // Motion
    // -------------------------------
    if (data.motion !== undefined) {

        const motionValue =
            data.motion === true ? "YES" : "NO";

        document.getElementById("motion").innerText =
            motionValue;
    }


    // -------------------------------
    // ESP32 / System Status
    // -------------------------------
    if (data.systemStatus !== undefined) {

        const deviceElement =
            document.getElementById("device");

        if (String(data.systemStatus).toUpperCase() === "ONLINE") {

            deviceElement.innerText = "ESP32 Connected";

        } else {

            deviceElement.innerText = "ESP32 Disconnected";
        }
    }


    // -------------------------------
    // Alert Logic
    // -------------------------------

    let alertStatus = "SAFE";
    let alertReason = "No Hazard Detected";


    // Temperature danger
    if (Number(data.temperature) >= 40) {

        alertStatus = "DANGER";
        alertReason = "High Temperature Detected";
    }


    // Gas danger
    else if (Number(data.gas) >= 1200) {

        alertStatus = "DANGER";
        alertReason = "Dangerous Gas Level Detected";
    }


    // Impact
    else if (data.impact === true) {

        alertStatus = "DANGER";
        alertReason = "Impact Detected";
    }


    // No motion
    else if (data.noMotion === true) {

        alertStatus = "WARNING";
        alertReason = "No Motion Detected";
    }


    document.getElementById("status").innerText =
        alertStatus;

    document.getElementById("reason").innerText =
        alertReason;


    // Change alert color
    const statusElement =
        document.getElementById("status");

    if (alertStatus === "DANGER") {

        statusElement.style.color = "red";

    } else if (alertStatus === "WARNING") {

        statusElement.style.color = "orange";

    } else {

        statusElement.style.color = "limegreen";
    }


    // -------------------------------
    // Graph Data
    // -------------------------------

    updateCharts(
        Number(data.temperature) || 0,
        Number(data.gas) || 0,
        Number(data.pressure) || 0
    );

});


// ===============================
// CLOCK
// ===============================

function updateClock() {

    const now = new Date();

    document.getElementById("clock").innerText =
        now.toLocaleTimeString();
}

setInterval(updateClock, 1000);

updateClock();


// ===============================
// CHARTS
// ===============================

const tempCtx =
    document.getElementById("tempChart").getContext("2d");

const gasCtx =
    document.getElementById("gasChart").getContext("2d");

const pressureCtx =
    document.getElementById("pressureChart").getContext("2d");


const tempChart = new Chart(tempCtx, {

    type: "line",

    data: {

        labels: [],

        datasets: [{
            label: "Temperature",
            data: [],
            borderWidth: 2,
            tension: 0.3
        }]

    },

    options: {
        responsive: true
    }

});


const gasChart = new Chart(gasCtx, {

    type: "line",

    data: {

        labels: [],

        datasets: [{
            label: "Gas",
            data: [],
            borderWidth: 2,
            tension: 0.3
        }]

    },

    options: {
        responsive: true
    }

});


const pressureChart = new Chart(pressureCtx, {

    type: "line",

    data: {

        labels: [],

        datasets: [{
            label: "Pressure",
            data: [],
            borderWidth: 2,
            tension: 0.3
        }]

    },

    options: {
        responsive: true
    }

});


// ===============================
// UPDATE CHARTS
// ===============================

function updateCharts(temp, gas, pressure) {

    const time =
        new Date().toLocaleTimeString();


    // Temperature
    tempChart.data.labels.push(time);
    tempChart.data.datasets[0].data.push(temp);

    if (tempChart.data.labels.length > 10) {

        tempChart.data.labels.shift();
        tempChart.data.datasets[0].data.shift();
    }

    tempChart.update();


    // Gas
    gasChart.data.labels.push(time);
    gasChart.data.datasets[0].data.push(gas);

    if (gasChart.data.labels.length > 10) {

        gasChart.data.labels.shift();
        gasChart.data.datasets[0].data.shift();
    }

    gasChart.update();


    // Pressure
    pressureChart.data.labels.push(time);
    pressureChart.data.datasets[0].data.push(pressure);

    if (pressureChart.data.labels.length > 10) {

        pressureChart.data.labels.shift();
        pressureChart.data.datasets[0].data.shift();
    }

    pressureChart.update();
}