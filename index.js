document.addEventListener('DOMContentLoaded', function() {
    fetchProfileData();
});

function fetchProfileData() {
    const username = "coalition";
    const password = "skills-test";
    const headers = new Headers();
    headers.append("Authorization", "Basic " + btoa(username + ":" + password));

    fetch("https://fedskillstest.coalitiontechnologies.workers.dev", { headers })
        .then(response => response.json())
        .then(data => {
        populateProfileList(data);
        // populateProfileAside(data[3]);
         labResults(data[3].lab_results)
         renderChart(data[3].diagnosis_history.slice(0,6).reverse());
         populateTable(data[3].diagnostic_list)
        //  console.log(data[3].diagnosis_history)
        })
        .catch(error => console.error("Error:", error));
}

function populateProfileAside(data) {
    const aside = document.getElementById('profile');
    
    const img = document.createElement('img');
    img.src = data.profile_picture;
    img.alt = data.name;
    img.className = 'profile-pic';
    
    const profileInfoDiv = document.createElement('div');
    profileInfoDiv.className = 'profile-info';
    
    const nameElement = document.createElement('p');
    nameElement.textContent = data.name;
    profileInfoDiv.appendChild(img);
    profileInfoDiv.appendChild(nameElement);
    
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'details';
    
    const dobElement = document.createElement('p');
    dobElement.className = 'label';
    dobElement.textContent = 'Date of Birth';
    const dobInfo = document.createElement('p');
    let dateObj = new Date(data.date_of_birth);
    let options = { year: 'numeric', month: 'short', day: 'numeric' };
    dobInfo.textContent = dateObj.toLocaleDateString('en-US', options);
    dobInfo.className = 'value';
    
    const genderElement = document.createElement('p');
    genderElement.className = 'label';
    genderElement.textContent = 'Gender';
    const genderInfo = document.createElement('p');
    genderInfo.textContent = data.gender;
    genderInfo.className = 'value';
    
    const contactElement = document.createElement('p');
    contactElement.className = 'label';
    contactElement.textContent = 'Contact Info';
    const contactInfo = document.createElement('p');
    contactInfo.textContent = data.phone_number;
    contactInfo.className = 'value';
    
    const emergencyElement = document.createElement('p');
    emergencyElement.className = 'label';
    emergencyElement.textContent = 'Emergency Contact';
    const emergencyInfo = document.createElement('p');
    emergencyInfo.textContent = data.emergency_contact;
    emergencyInfo.className = 'value';
    
    const insuranceElement = document.createElement('p');
    insuranceElement.className = 'label';
    insuranceElement.textContent = 'Insurance Provider';
    const insuranceInfo = document.createElement('p');
    insuranceInfo.textContent = data.insurance_type;
    insuranceInfo.className = 'value';
    
    detailsDiv.appendChild(dobElement);
    detailsDiv.appendChild(dobInfo);
    detailsDiv.appendChild(genderElement);
    detailsDiv.appendChild(genderInfo);
    detailsDiv.appendChild(contactElement);
    detailsDiv.appendChild(contactInfo);
    detailsDiv.appendChild(emergencyElement);
    detailsDiv.appendChild(emergencyInfo);
    detailsDiv.appendChild(insuranceElement);
    detailsDiv.appendChild(insuranceInfo);
    
    const showMoreButton = document.createElement('button');
    showMoreButton.className = 'show-more';
    showMoreButton.textContent = 'Show All Information';
    
    aside.appendChild(profileInfoDiv);
    aside.appendChild(detailsDiv);
    aside.appendChild(showMoreButton);
}

function populateProfileList(profiles) {
    const profileList = document.getElementById("profileList");
    profileList.innerHTML = ''; // Clear previous content

    profiles.forEach(profile => {
        const listItem = document.createElement("li");
        const img = document.createElement("img");
        img.src = profile.profile_picture;
        img.alt = profile.name;
        const nameSpan = document.createElement("span");
        nameSpan.className = "name";
        nameSpan.textContent = profile.name;
        const dotsSpan = document.createElement("span");
        dotsSpan.className = "dots";
        dotsSpan.textContent = "...";
        listItem.appendChild(img);
        listItem.appendChild(nameSpan);
        listItem.appendChild(dotsSpan);
        profileList.appendChild(listItem);
    });
}

function labResults(report) {
    const element = document.getElementById('reports');
    
    const downloadIconUrl = 'downloadicon.png'; 
    
    report.forEach((reportItem) => {
        // Create list item
        const listItem = document.createElement("li");
        listItem.className = 'labResultElement';
        
        // Create text node for the report
        const textNode = document.createTextNode(reportItem);
        
        // Create download icon
        const downloadIcon = document.createElement("img");
        downloadIcon.src = downloadIconUrl;
        downloadIcon.alt = 'Download';
        downloadIcon.style.cursor = 'pointer';
        downloadIcon.style.marginLeft = '10px'; // Add some space between the text and icon

        // Append text and icon to list item
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

    labResults.forEach(entry => {
        labels.push(`${entry.month.slice(0,3)} ${entry.year}`);
        systolicData.push(entry.blood_pressure.systolic.value);
        diastolicData.push(entry.blood_pressure.diastolic.value);
    });

    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    data: systolicData,
                    borderColor: 'rgb(75, 192, 192)',
                    fill: false,
                    tension: 0.4
                },
                {
                    data: diastolicData,
                    borderColor: 'rgb(255, 99, 132)',
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            plugins: {
                legend: {
                  display: false
                }
              },
            responsive: true,
            scales: {
                x: {
                    beginAtZero: false,
                    grid:{
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    suggestedMin: 60,
                    suggestedMax: 180,
                    ticks: {
                        stepSize: 20
                    }
                }
            }
        }
    });
}


function populateTable(diagnostics) {
    // Select the first <tbody> element
    const tbody = document.getElementsByTagName('tbody')[0];

    diagnostics.forEach(diagnostic => {
        const tr = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.textContent = diagnostic.name;
        tr.appendChild(tdName);

        const tdDescription = document.createElement('td');
        tdDescription.className = 'description-cell';
        tdDescription.textContent = diagnostic.description;
        tr.appendChild(tdDescription);

        const tdStatus = document.createElement('td');
        tdStatus.textContent = diagnostic.status;
        tr.appendChild(tdStatus);

        tbody.appendChild(tr);
    });
}