// Function to set up form listener and handle form submission
function setupFormListener() {
    const form = document.getElementById("volunteer-form");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const charityName = document.getElementById("charity-name").value.trim();
            const hoursVolunteered = parseFloat(document.getElementById("hours-volunteered").value);
            const date = document.getElementById("date").value;
            const experienceRating = parseInt(document.getElementById("experience-rating").value);

            if (!validateForm({ charityName, hoursVolunteered, date, experienceRating })) {
                alert("Please fill out the form correctly.");
                return;
            }

            const formData = { charityName, hoursVolunteered, date, experienceRating };
            saveDataToLocalStorage(formData);
            addRowToTable(formData);
            updateTotalHours();

            form.reset();
        });
    }
}

// Function to validate the form data
function validateForm({ charityName, hoursVolunteered, date, experienceRating }) {
    return (
        charityName.trim() !== "" &&
        !isNaN(hoursVolunteered) &&
        hoursVolunteered > 0 &&
        date.trim() !== "" &&
        !isNaN(experienceRating) &&
        experienceRating >= 1 &&
        experienceRating <= 5
    );
}

// Function to save data to localStorage
function saveDataToLocalStorage(data) {
    const logs = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
    logs.push(data);
    localStorage.setItem("volunteerLogs", JSON.stringify(logs));
}

// Function to load data from localStorage and update the table and total hours
function loadDataFromLocalStorage() {
    const logs = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
    logs.forEach(addRowToTable);
    updateTotalHours();
}

// Function to add a row to the volunteer table
function addRowToTable({ charityName, hoursVolunteered, date, experienceRating }) {
    const tableBody = document.getElementById("volunteer-table").querySelector("tbody");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${charityName}</td>
        <td>${hoursVolunteered}</td>
        <td>${date}</td>
        <td>${experienceRating}</td>
        <td><button class="delete-btn">Delete</button></td>
    `;

    row.querySelector(".delete-btn").addEventListener("click", () => deleteLog(row, charityName, date));
    tableBody.appendChild(row);
}

// Function to update the total hours in the summary section
function updateTotalHours() {
    const logs = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
    const totalHours = logs.reduce((sum, log) => sum + log.hoursVolunteered, 0);
    document.getElementById("total-hours").textContent = totalHours;
}

// Function to delete a log from the table and localStorage
function deleteLog(row, charityName, date) {
    const logs = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
    const updatedLogs = logs.filter(log => !(log.charityName === charityName && log.date === date));
    localStorage.setItem("volunteerLogs", JSON.stringify(updatedLogs));
    row.remove();
    updateTotalHours();
}

// Initialize the page when the DOM is loaded
document.addEventListener("DOMContentLoaded", loadDataFromLocalStorage);
setupFormListener();

// Export the functions for testing
module.exports = {
    validateForm,
    saveDataToLocalStorage,
    loadDataFromLocalStorage,
    updateTotalHours,
    deleteLog,
    setupFormListener
};
