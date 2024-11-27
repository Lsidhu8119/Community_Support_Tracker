let formSubmitted = false; // Track the form submission status

function setupFormListener() {
    document.getElementById("volunteer-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from reloading the page

        // Collect form data
        const charityName = document.getElementById("charity-name").value.trim();
        const hoursVolunteered = parseFloat(document.getElementById("hours-volunteered").value);
        const date = document.getElementById("date").value;
        const experienceRating = parseInt(document.getElementById("experience-rating").value);

        // Validate form inputs
        if (!charityName || isNaN(hoursVolunteered) || hoursVolunteered <= 0 || !date || isNaN(experienceRating) || experienceRating < 1 || experienceRating > 5) {
            alert("Please fill out the form correctly.");
            return;
        }

        // Temporary data object
        const formData = {
            charityName,
            hoursVolunteered,
            date,
            experienceRating,
        };

        console.log("Form Submitted Successfully:", formData);

        // Mark the form as submitted
        formSubmitted = true;

        // Optionally, clear the form
        document.getElementById("volunteer-form").reset();
    });
}

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

// Function to check if the form was submitted
function checkFormSubmission() {
    if (formSubmitted) {
        console.log("The form has been submitted!");
    } else {
        console.log("The form has not been submitted yet.");
    }
}

// You can call checkFormSubmission() anywhere in your code to check the submission status.
// For example, you can use it in intervals to check periodically.
setInterval(checkFormSubmission, 1000); // Check every second (for demonstration)

// Export functions to be used in Jest or Node.js environment
module.exports = { validateForm, setupFormListener };
