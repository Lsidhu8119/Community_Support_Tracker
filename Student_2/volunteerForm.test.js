const {
    validateForm,
    saveDataToLocalStorage,
    loadDataFromLocalStorage,
    updateTotalHours,
    deleteLog,
    setupFormListener
} = require('./script.js');

// Mocking localStorage in Jest
beforeEach(() => {
    // Clearing localStorage before each test
    localStorage.clear();
    document.body.innerHTML = `
        <form id="volunteer-form">
            <input id="charity-name" value="Charity ABC" />
            <input id="hours-volunteered" value="5" />
            <input id="date" value="2024-12-04" />
            <input id="experience-rating" value="4" />
            <button type="submit">Submit</button>
        </form>
        <table id="volunteer-table">
            <tbody></tbody>
        </table>
        <span id="total-hours"></span>
    `;
});

// Test for validateForm
describe('validateForm', () => {
    test('should return true for valid form data', () => {
        const validData = {
            charityName: 'Charity ABC',
            hoursVolunteered: 5,
            date: '2024-12-04',
            experienceRating: 4
        };
        expect(validateForm(validData)).toBe(true);
    });

    test('should return false for invalid form data', () => {
        const invalidData = {
            charityName: '',
            hoursVolunteered: -1,
            date: '',
            experienceRating: 6
        };
        expect(validateForm(invalidData)).toBe(false);
    });
});

// Test for saveDataToLocalStorage
describe('saveDataToLocalStorage', () => {
    test('should save volunteer data to localStorage', () => {
        const data = {
            charityName: 'Charity ABC',
            hoursVolunteered: 5,
            date: '2024-12-04',
            experienceRating: 4
        };

        saveDataToLocalStorage(data);
        const storedData = JSON.parse(localStorage.getItem('volunteerLogs'));
        expect(storedData.length).toBe(1);
        expect(storedData[0]).toEqual(data);
    });
});

// Test for loadDataFromLocalStorage
describe('loadDataFromLocalStorage', () => {
    test('should load data from localStorage', () => {
        const data = {
            charityName: 'Charity ABC',
            hoursVolunteered: 5,
            date: '2024-12-04',
            experienceRating: 4
        };
        localStorage.setItem('volunteerLogs', JSON.stringify([data]));

        loadDataFromLocalStorage();

        const tableRows = document.querySelectorAll('#volunteer-table tbody tr');
        expect(tableRows.length).toBe(1);
        expect(tableRows[0].cells[0].textContent).toBe(data.charityName);
        expect(tableRows[0].cells[1].textContent).toBe(data.hoursVolunteered.toString());
    });
});

// Test for updateTotalHours
describe('updateTotalHours', () => {
    test('should update the total hours correctly', () => {
        const data = [
            { hoursVolunteered: 5 },
            { hoursVolunteered: 3 },
            { hoursVolunteered: 2 }
        ];
        localStorage.setItem('volunteerLogs', JSON.stringify(data));

        updateTotalHours();
        const totalHours = document.getElementById('total-hours').textContent;
        expect(totalHours).toBe('10');
    });
});

// Test for deleteLog
describe('deleteLog', () => {
    test('should delete a log from localStorage and update the table', () => {
        const data = {
            charityName: 'Charity ABC',
            hoursVolunteered: 5,
            date: '2024-12-04',
            experienceRating: 4
        };

        localStorage.setItem('volunteerLogs', JSON.stringify([data]));

        const deleteButton = document.querySelector('.delete-btn');
        deleteButton.addEventListener('click', () => {
            deleteLog(deleteButton.closest('tr'), data.charityName, data.date);
        });

        deleteButton.click(); // Trigger delete
        const storedData = JSON.parse(localStorage.getItem('volunteerLogs'));
        expect(storedData.length).toBe(0);
    });
});

// Test for setupFormListener (simulating form submission)
describe('setupFormListener', () => {
    test('should handle form submission and save data', () => {
        setupFormListener(); // Activate form listener

        const form = document.getElementById('volunteer-form');
        form.dispatchEvent(new Event('submit')); // Simulate form submission

        const tableRows = document.querySelectorAll('#volunteer-table tbody tr');
        expect(tableRows.length).toBe(1);
        expect(tableRows[0].cells[0].textContent).toBe('Charity ABC');
    });
});
