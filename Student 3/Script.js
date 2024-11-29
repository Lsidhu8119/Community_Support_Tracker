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

    // Handle validation errors
    if (errors.length > 0) {
        alert("Errors:\n" + errors.join("\n"));
    } else {
        console.log("Form data:", formData); // Temporary storage of data
        localStorage.setItem("eventSignup", JSON.stringify(formData)); // Save data to localStorage
        alert("Form sign up successfully!");  // Display success message
        // Optional: Clear the form after successful submission
        document.getElementById("eventSignupForm").reset();
    }
});
