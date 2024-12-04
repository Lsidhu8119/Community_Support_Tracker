// Temporary storage for donations
let donations = JSON.parse(localStorage.getItem('donations')) || [];

// This function is responsible for handling form submission
export function handleDonationFormSubmit(event) {
  event.preventDefault();

  const formData = {
    charityName: document.getElementById('charity-name').value.trim(),
    donationAmount: parseFloat(document.getElementById('donation-amount').value.trim()),
    donationDate: document.getElementById('donation-date').value.trim(),
    donorMessage: document.getElementById('donor-message').value.trim(),
  };

  try {
    validateDonationForm(formData);

    donations.push(formData);
    saveDonationsToLocalStorage();
    displayDonations();
    displayTotalDonated();

    clearFormInputs();
  } catch (error) {
    alert(error.message);
  }
}

// Validates function for donation form
export function validateDonationForm(data) {
  const { charityName, donationAmount, donationDate, donorMessage } = data;

  if (!charityName) throw new Error('Charity Name is required.');
  if (isNaN(donationAmount) || donationAmount <= 0) throw new Error('Donation Amount must be a valid positive number.');
  if (!donationDate || isNaN(new Date(donationDate).getTime())) throw new Error('Invalid Donation Date.');
  if (donorMessage.length > 255) throw new Error('Message should not exceed 255 characters.');

  return true;
}

// This functions is made to save donations to localStorage
function saveDonationsToLocalStorage() {
  localStorage.setItem('donations', JSON.stringify(donations));
}

// Function for  displaying  all donations in the table
function displayDonations() {
  const tableBody = document.querySelector('#donation-table tbody');
  tableBody.innerHTML = '';

  donations.forEach((donation, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${donation.charityName}</td>
      <td>$${donation.donationAmount.toFixed(2)}</td>
      <td>${donation.donationDate}</td>
      <td>${donation.donorMessage}</td>
      <td><button class="delete-button" data-index="${index}">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });

  // It attachees event listeners to delete buttons
  document.querySelectorAll('.delete-button').forEach((button) =>
    button.addEventListener('click', (event) => {
      const index = parseInt(event.target.dataset.index, 10);
      deleteDonation(index);
    })
  );
}

// Function for calculating and display the total donation amount
function displayTotalDonated() {
  const total = donations.reduce((sum, donation) => sum + donation.donationAmount, 0);
  document.getElementById('total-donation').textContent = `Total Donated: $${total.toFixed(2)}`;
}

// Function for deleting a donation
export function deleteDonation(index) {
  donations.splice(index, 1);
  saveDonationsToLocalStorage();
  displayDonations();
  displayTotalDonated();
}

// Function for clearing form inputs
function clearFormInputs() {
  document.getElementById('charity-name').value = '';
  document.getElementById('donation-amount').value = '';
  document.getElementById('donation-date').value = '';
  document.getElementById('donor-message').value = '';
}

// Initial rendering when the page loads
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('donation-form').addEventListener('submit', handleDonationFormSubmit);
  displayDonations();
  displayTotalDonated();
});
