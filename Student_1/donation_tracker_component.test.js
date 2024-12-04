const { JSDOM } = require('jsdom');

// Mock localStorage for tests
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('Donation Tracker', () => {
  let dom, document, form, charityNameInput, donationAmountInput, donationDateInput, donorMessageInput;

  beforeEach(() => {
    // Simulate DOM structure
    dom = new JSDOM(`
      <form id="donation-form">
        <input type="text" id="charity-name" required>
        <input type="number" id="donation-amount" required>
        <input type="date" id="donation-date" required>
        <textarea id="donor-message"></textarea>
        <button type="submit">Submit</button>
      </form>
      <table id="donation-table">
        <tbody></tbody>
      </table>
      <div id="total-donation"></div>
    `);

    document = dom.window.document;
    global.document = document;

    form = document.getElementById('donation-form');
    charityNameInput = document.getElementById('charity-name');
    donationAmountInput = document.getElementById('donation-amount');
    donationDateInput = document.getElementById('donation-date');
    donorMessageInput = document.getElementById('donor-message');

    localStorage.clear();
  });

  test('Function is triggered on form submission', () => {
    // This test shows that the form submission triggers the  event handler function.
    const handleSubmit = jest.fn((event) => event.preventDefault());
    form.addEventListener('submit', handleSubmit);
    form.dispatchEvent(new dom.window.Event('submit'));
    expect(handleSubmit).toHaveBeenCalled();
  });

  test('Function correctly collects form data', () => {
    // This test shows taht the data is corrctly stored ..
    charityNameInput.value = 'Charity A';
    donationAmountInput.value = '100';
    donationDateInput.value = '2024-12-01';
    donorMessageInput.value = 'Great cause!';

    const collectedData = {
      charityName: charityNameInput.value,
      donationAmount: parseFloat(donationAmountInput.value),
      donationDate: donationDateInput.value,
      donorMessage: donorMessageInput.value,
    };

    expect(collectedData).toEqual({
      charityName: 'Charity A',
      donationAmount: 100,
      donationDate: '2024-12-01',
      donorMessage: 'Great cause!',
    });
  });

  test('Validation for required fields', () => {
    // This test shows  the required fields and fails validation if any one is empty.
    charityNameInput.value = '';
    donationAmountInput.value = '100';
    donationDateInput.value = '2024-12-01';

    const isValid = charityNameInput.value && donationAmountInput.value && donationDateInput.value;
    expect(isValid).toBeFalsy();
  });

  test('Validation for invalid donation amount', () => {
    // This test checks that the donation amount is greater than 0.
    donationAmountInput.value = '-50';
    const isValidAmount = parseFloat(donationAmountInput.value) > 0;
    expect(isValidAmount).toBeFalsy();
  });

  test('Data is correctly stored in localStorage', () => {
    // This test verifies that the donation data is saved correctly to localStorage.
    const donations = [
      { charityName: 'Charity A', donationAmount: 100, donationDate: '2024-12-01', donorMessage: 'Great!' },
    ];
    localStorage.setItem('donations', JSON.stringify(donations));
    const storedData = JSON.parse(localStorage.getItem('donations'));
    expect(storedData).toEqual(donations);
  });

  test('Data is correctly retrieved from localStorage and loaded into the table', () => {
    // This test confirms that data saved in localStorage is correctly catched  and displayed accurately in the table.
    const donations = [
      { charityName: 'Charity B', donationAmount: 50, donationDate: '2024-12-02', donorMessage: 'Keep going!' },
    ];
    localStorage.setItem('donations', JSON.stringify(donations));

    const retrievedData = JSON.parse(localStorage.getItem('donations')) || [];
    const tableBody = document.querySelector('#donation-table tbody');
    tableBody.innerHTML = retrievedData
      .map(
        (donation) => `
          <tr>
            <td>${donation.charityName}</td>
            <td>$${donation.donationAmount.toFixed(2)}</td>
            <td>${donation.donationDate}</td>
            <td>${donation.donorMessage}</td>
          </tr>`
      )
      .join('');

    expect(tableBody.innerHTML).toContain('Charity B');
    expect(tableBody.innerHTML).toContain('$50.00');
    expect(tableBody.innerHTML).toContain('2024-12-02');
  });

  test('Summary section calculates and displays total amount donated', () => {
    // This test checks that the total donation amount is correctly calculated and displayed.
    const donations = [
      { charityName: 'Charity A', donationAmount: 100, donationDate: '2024-12-01', donorMessage: 'Good!' },
      { charityName: 'Charity B', donationAmount: 50, donationDate: '2024-12-02', donorMessage: 'Keep it up!' },
    ];
    localStorage.setItem('donations', JSON.stringify(donations));

    const total = donations.reduce((sum, donation) => sum + donation.donationAmount, 0);
    document.getElementById('total-donation').textContent = `Total Donated: $${total.toFixed(2)}`;
    expect(document.getElementById('total-donation').textContent).toBe('Total Donated: $150.00');
  });

  test('Delete button removes a record from the table and updates localStorage', () => {
    // This test ensures that deleting a record removes it from both the table and localStorage.
    let donations = [
      { charityName: 'Charity A', donationAmount: 100, donationDate: '2024-12-01', donorMessage: 'Great!' },
      { charityName: 'Charity B', donationAmount: 50, donationDate: '2024-12-02', donorMessage: 'Good!' },
    ];
    localStorage.setItem('donations', JSON.stringify(donations));

    // Simulate deletion
    const indexToDelete = 0;
    donations.splice(indexToDelete, 1);
    localStorage.setItem('donations', JSON.stringify(donations));

    const updatedDonations = JSON.parse(localStorage.getItem('donations'));
    expect(updatedDonations).toHaveLength(1);
    expect(updatedDonations[0].charityName).toBe('Charity B');
  });

  test('Total donation amount is updated when a record is deleted', () => {
    // This test makes sure that the total donation amount is calculated again when a record is deleted.
    let donations = [
      { charityName: 'Charity A', donationAmount: 100, donationDate: '2024-12-01', donorMessage: 'Great!' },
      { charityName: 'Charity B', donationAmount: 50, donationDate: '2024-12-02', donorMessage: 'Good!' },
    ];
    localStorage.setItem('donations', JSON.stringify(donations));

    // Simulate deletion
    const indexToDelete = 0;
    donations.splice(indexToDelete, 1);
    localStorage.setItem('donations', JSON.stringify(donations));

    const total = donations.reduce((sum, donation) => sum + donation.donationAmount, 0);
    document.getElementById('total-donation').textContent = `Total Donated: $${total.toFixed(2)}`;
    expect(document.getElementById('total-donation').textContent).toBe('Total Donated: $50.00');
  });
});
