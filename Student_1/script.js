// Function for handling form submission
export function handleDonationFormSubmit(event) {
  event.preventDefault(); // Prevent the default form submission

  const formData = {
    charityName: document.getElementById('charity-name').value.trim(),
    donationAmount: parseFloat(document.getElementById('donation-amount').value.trim()),
    donationDate: document.getElementById('donation-date').value.trim(),
    donorMessage: document.getElementById('donor-message').value.trim(),
  };

  // Validate the form data
  try {
    validateDonationForm(formData);
    console.log('Form data is valid:', formData); // Log valid form data

    // Display a success message
    displaySuccessMessage(); 

    return formData; // Return valid data
  } catch (error) {
    alert(error.message); // Display error message to user
    return null; // Return null value on validation failure
  }
}

// Validation function for the form
export function validateDonationForm(data) {
  const { charityName, donationAmount, donationDate, donorMessage } = data;

  // Check whether the name of charity is empty
  if (!charityName) {
    throw new Error('Charity Name is required.');
  }

  // Check if donation amount is valid, must be a positive number only
  if (isNaN(donationAmount) || donationAmount <= 0) {
    throw new Error('Donation Amount must be a valid positive number.');
  }

  // Check if donation date is valid
  if (!donationDate || isNaN(new Date(donationDate).getTime())) {
    throw new Error('Invalid Donation Date.');
  }

  // Check if donor message length does not exceed 255 characters
  if (donorMessage.length > 255) {
    throw new Error('Message should not exceed 255 characters.');
  }

  // All validations passed
  return true;
}

// Function to display success message after successful form submission
function displaySuccessMessage() {
  const messageContainer = document.getElementById('form-message');
  messageContainer.textContent = "Donation submitted successfully! Thank you for your contribution.";
  messageContainer.style.color = 'green';
}

// Attach event listener to form submission
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('donation-form');
  if (form) {
    form.addEventListener('submit', handleDonationFormSubmit);
  }
});
