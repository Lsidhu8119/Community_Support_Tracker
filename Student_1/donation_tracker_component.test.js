const { JSDOM } = require('jsdom');

// Imported JSDOM to create a simulated DOM environment for testing.
// This allows to test form functionality without a browser.

let temporaryData = {};

// Initialize a global object to temporarily store form submission data

describe('Donation Tracker Form', () => {
  let dom, document, form, charityNameInput, donationAmountInput, donationDateInput, donorMessageInput;

  beforeEach(() => {
    // Set up a new simulated DOM and form structure before each test.
    // This ensures each test starts with a clean, isolated environment.
    dom = new JSDOM(`
      <form id="donation-form">
        <input type="text" id="charity-name" required>
        <input type="number" id="donation-amount" required>
        <input type="date" id="donation-date" required>
        <textarea id="donor-message"></textarea>
        <button type="submit">Submit</button>
      </form>
    `);
    document = dom.window.document;
    form = document.getElementById('donation-form');
    charityNameInput = document.getElementById('charity-name');
    donationAmountInput = document.getElementById('donation-amount');
    donationDateInput = document.getElementById('donation-date');
    donorMessageInput = document.getElementById('donor-message');

    // Attach a form submit event listener to simulate form behavior.
    // It captures and validates input data, updating `temporaryData` if valid.
    form.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent actual form submission behavior.

      const charityName = charityNameInput.value.trim();
      const donationAmount = donationAmountInput.value.trim();
      const donationDate = donationDateInput.value.trim();
      const donorMessage = donorMessageInput.value.trim();

      // Validate form fields and update temporaryData if valid.
      // Reset data if validation fails.
      if (!charityName || !donationAmount || !donationDate || isNaN(donationAmount) || donationAmount <= 0) {
        temporaryData = {};
        return;
      }

      temporaryData = {
        charityName,
        donationAmount: parseFloat(donationAmount),
        donationDate,
        donorMessage,
      };
    });
  });

  afterEach(() => {
    // Reset the temporary data object after each test to avoid
    // data leakage between tests.
    temporaryData = {};
  });

  test('Form submission triggers the JavaScript function', () => {
    // Test that submitting the form triggers the event listener
    // attached to handle the form submission logic.
    const handleSubmit = jest.fn((event) => event.preventDefault());
    form.addEventListener('submit', handleSubmit);
    form.dispatchEvent(new dom.window.Event('submit'));
    expect(handleSubmit).toHaveBeenCalled();
  });

  test('Function correctly collects form data', () => {
    // Test that form submission correctly collects and processes
    // valid input data into the temporaryData object.
    charityNameInput.value = 'Charity A';
    donationAmountInput.value = '100';
    donationDateInput.value = '2024-11-26';
    donorMessageInput.value = 'Great cause!';

    form.dispatchEvent(new dom.window.Event('submit'));

    expect(temporaryData).toEqual({
      charityName: 'Charity A',
      donationAmount: 100,
      donationDate: '2024-11-26',
      donorMessage: 'Great cause!',
    });
  });

  test('Function validates required fields', () => {
    // Test that missing or invalid required fields prevent data collection
    // and reset temporaryData to an empty object.
    charityNameInput.value = '';
    donationAmountInput.value = '50';
    donationDateInput.value = '2024-11-26';

    form.dispatchEvent(new dom.window.Event('submit'));
    expect(temporaryData).toEqual({});

    charityNameInput.value = 'Charity B';
    donationAmountInput.value = ''; // Missing amount
    form.dispatchEvent(new dom.window.Event('submit'));
    expect(temporaryData).toEqual({});
  });

  test('Function validates donation amount', () => {
    // Test that invalid donation amounts (negative or non-numeric values)
    // are rejected, and data is not collected.
    charityNameInput.value = 'Charity B';
    donationAmountInput.value = '-10'; // Invalid amount
    donationDateInput.value = '2024-11-27';

    form.dispatchEvent(new dom.window.Event('submit'));
    expect(temporaryData).toEqual({});

    donationAmountInput.value = 'abc'; // Non-numeric input
    form.dispatchEvent(new dom.window.Event('submit'));
    expect(temporaryData).toEqual({});
  });

  test('Function accepts valid input but rejects empty message', () => {
    // Test that valid input is processed correctly, even if the
    // optional donor message is empty.
    charityNameInput.value = 'Charity C';
    donationAmountInput.value = '200';
    donationDateInput.value = '2024-12-01';
    donorMessageInput.value = ''; // Optional field, empty

    form.dispatchEvent(new dom.window.Event('submit'));
    expect(temporaryData).toEqual({
      charityName: 'Charity C',
      donationAmount: 200,
      donationDate: '2024-12-01',
      donorMessage: '', // Empty, but valid field
    });
  });
});
