document.addEventListener("DOMContentLoaded", function () {
  fetchProfileData();
});

function fetchProfileData() {
  const username = "coalition";
  const password = "skills-test";
  const headers = new Headers();
  headers.append("Authorization", "Basic " + btoa(username + ":" + password));

  fetch("https://fedskillstest.coalitiontechnologies.workers.dev", { headers })
    .then((response) => response.json())
    .then((data) => {
      populateProfileList(data);
      labResults(data[3].lab_results);
      renderChart(data[3].diagnosis_history.slice(0, 6).reverse());
      populateTable(data[3].diagnostic_list);
      populateVitals(data[3].diagnosis_history[0]);
      populateBloodPressure(data[3].diagnosis_history[0].blood_pressure);
      updateProfile(data[3]);
    })
    .catch((error) => console.error("Error:", error));
}

function populateVitals(obj) {
  const respiratory = document.getElementById("res");
  const respiratoryResult = document.getElementById("resRes");
  const temp = document.getElementById("temp");
  const tempResult = document.getElementById("tempResult");
  const heart = document.getElementById("heart");
  const hearResult = document.getElementById("heartResult");
  respiratory.textContent = `${obj.respiratory_rate.value} bpm`;
  respiratoryResult.textContent = obj.respiratory_rate.levels;
  temp.textContent = `${obj.temperature.value} °F`;
  tempResult.textContent = obj.temperature.levels;
  heart.textContent = `${obj.heart_rate.value} bpm`;
  hearResult.textContent = obj.heart_rate.levels;
}

function updateProfile(obj) {
    document.querySelector(".profile-picture").src = obj.profile_picture;
    document.querySelector(".profileName").textContent = obj.name;
    document.getElementById("date-of-birth").textContent = new Date(obj.date_of_birth).toDateString();
    document.getElementById("gender").textContent = obj.gender;
    document.getElementById("phone-number").textContent = obj.phone_number;
    document.getElementById("emergency-contact").textContent = obj.emergency_contact;
    document.getElementById("insurance-type").textContent = obj.insurance_type;
  }
function populateBloodPressure(obj) {
  const systolicValue = document.getElementById("systolicValue");
  const systolicLevel = document.getElementById("systolicLevel");
  const DiastolicValue = document.getElementById("DiastolicValue");
  const DiastolicLevel = document.getElementById("DiastolicLevel");
  systolicValue.textContent = obj.systolic.value;
  systolicLevel.textContent = obj.systolic.levels;
  DiastolicValue.textContent = obj.diastolic.value;
  DiastolicLevel.textContent = obj.diastolic.levels;
}
function populateProfileList(profiles) {
  const profileList = document.getElementById("profileList");
  profiles.forEach((profile) => {
    const listItem = document.createElement("li");
    const img = document.createElement("img");
    img.src = profile.profile_picture;
    img.alt = profile.name;

    const infoContainer = document.createElement("div");
    infoContainer.className = "info-container";

    const nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.textContent = profile.name;

    const genderAgeSpan = document.createElement("p");
    genderAgeSpan.className = "gender-age";
    genderAgeSpan.textContent = `${profile.gender}, ${profile.age}`;

    const dotsSpan = document.createElement("span");
    dotsSpan.className = "dots";
    dotsSpan.textContent = "...";

    infoContainer.appendChild(nameSpan);
    infoContainer.appendChild(genderAgeSpan);

    listItem.appendChild(img);
    listItem.appendChild(infoContainer);
    listItem.appendChild(dotsSpan);

    profileList.appendChild(listItem);
  });
}

function labResults(report) {
  const element = document.getElementById("reports");

  const downloadIconUrl = "./assets/downloadicon.png";

  report.forEach((reportItem) => {
    const listItem = document.createElement("li");
    listItem.className = "labResultElement";

    const textNode = document.createTextNode(reportItem);

    const downloadIcon = document.createElement("img");
    downloadIcon.src = downloadIconUrl;
    downloadIcon.alt = "Download";
    downloadIcon.style.cursor = "pointer";
    downloadIcon.style.marginLeft = "10px";
    listItem.appendChild(textNode);
    listItem.appendChild(downloadIcon);

    // Append list item to the element
    element.appendChild(listItem);
  });
}

function renderChart(labResults) {
  const labels = [];
  const systolicData = [];
  const diastolicData = [];

  labResults.forEach((entry) => {
    labels.push(`${entry.month.slice(0, 3)} ${entry.year}`);
    systolicData.push(entry.blood_pressure.systolic.value);
    diastolicData.push(entry.blood_pressure.diastolic.value);
  });

  const ctx = document.getElementById("myChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          data: systolicData,
          borderColor: "rgb(75, 192, 192)",
          fill: false,
          tension: 0.4,
        },
        {
          data: diastolicData,
          borderColor: "rgb(255, 99, 132)",
          fill: false,
          tension: 0.4,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      responsive: true,
      scales: {
        x: {
          beginAtZero: false,
          grid: {
            display: false,
          },
        },
        y: {
          beginAtZero: false,
          suggestedMin: 60,
          suggestedMax: 180,
          ticks: {
            stepSize: 20,
          },
        },
      },
    },
  });
}

function populateTable(diagnostics) {
  const tbody = document.getElementsByTagName("tbody")[0];

  diagnostics.forEach((diagnostic) => {
    const tr = document.createElement("tr");

    const tdName = document.createElement("td");
    tdName.textContent = diagnostic.name;
    tr.appendChild(tdName);

    const tdDescription = document.createElement("td");
    tdDescription.className = "description-cell";
    tdDescription.textContent = diagnostic.description;
    tr.appendChild(tdDescription);

    const tdStatus = document.createElement("td");
    tdStatus.textContent = diagnostic.status;
    tr.appendChild(tdStatus);

    tbody.appendChild(tr);
  });
}
