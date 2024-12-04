document.getElementById("eventSignupForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form's default submission behavior

    // Collect form data
    const formData = {
        eventName: document.getElementById("eventName").value.trim(),
        representativeName: document.getElementById("representativeName").value.trim(),
        representativeEmail: document.getElementById("representativeEmail").value.trim(),
        role: document.getElementById("role").value.trim(),
    };

    // Validate inputs
    const errors = [];
    if (!formData.eventName) errors.push("Event name is required.");
    if (!formData.representativeName) errors.push("Representative's name is required.");
    if (!formData.representativeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.representativeEmail)) {
        errors.push("Valid email is required.");
    }
    if (!formData.role) errors.push("Role selection is required.");

    // Handles validation of errors
    if (errors.length > 0) {
        alert("Errors:\n" + errors.join("\n"));
    } else {
        // Save data to localStorage
        let signups = JSON.parse(localStorage.getItem("eventSignups")) || [];
        signups.push(formData);
        localStorage.setItem("eventSignups", JSON.stringify(signups));
        
        alert("Form sign up successfully!");  // Display success message
        document.getElementById("eventSignupForm").reset();
        loadSignups();
    }
});

// Get signups from localStorage and put them in the table.
function loadSignups() {
    const signups = JSON.parse(localStorage.getItem("eventSignups")) || [];
    const tableBody = document.getElementById("signupTable").querySelector("tbody");
    tableBody.innerHTML = ''; // Clear the table before reloading data

    signups.forEach((signup, index) => {
        const row = document.createElement("tr");
        row.innerHTML = 
            `<td>${signup.eventName}</td>
            <td>${signup.representativeName}</td>
            <td>${signup.representativeEmail}</td>
            <td>${signup.role}</td>
            <td><button onclick="deleteSignup(${index})">Delete</button></td>`;
        tableBody.appendChild(row);
    });

    updateUpcomingEvents(signups);
}

// Delete a signup entry from both the table and localStorage
function deleteSignup(index) {
    let signups = JSON.parse(localStorage.getItem("eventSignups")) || [];
    signups.splice(index, 1); // Remove the signup at the specified index
    localStorage.setItem("eventSignups", JSON.stringify(signups));
    loadSignups(); // Reload the signups table after deletion
}

// Update the "Upcoming Events" section with a breakdown of signups by role
function updateUpcomingEvents(signups) {
    const roleCount = {
        sponsor: 0,
        participant: 0,
        organizer: 0
    };

    signups.forEach(signup => {
        roleCount[signup.role]++;
    });

    const upcomingEvents = document.getElementById("upcomingEvents");
    upcomingEvents.innerHTML = 
        `<p>Sponsors: ${roleCount.sponsor}</p>
        <p>Participants: ${roleCount.participant}</p>
        <p>Organizers: ${roleCount.organizer}</p>`;
}

// Initialize the app by loading any saved signups when the page loads
window.onload = loadSignups;
