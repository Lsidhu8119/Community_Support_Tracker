// volunteerForm.test.js
const { validateForm, setupFormListener } = require("./script");

describe("Volunteer Form Tests", () => {
    beforeEach(() => {
        // Set up a mock DOM for testing
        document.body.innerHTML = `
            <form id="volunteer-form">
                <input type="text" id="charity-name" />
                <input type="number" id="hours-volunteered" />
                <input type="date" id="date" />
                <input type="number" id="experience-rating" />
            </form>
        `;
    });

    test("validateForm works with valid data", () => {
        const formData = {
            charityName: "Charity ABC",
            hoursVolunteered: 5,
            date: "2024-11-26",
            experienceRating: 4,
        };

        expect(validateForm(formData)).toBe(true);
    });

    test("validateForm rejects invalid data (negative hours)", () => {
        const formData = {
            charityName: "Charity XYZ",
            hoursVolunteered: -5,
            date: "2024-11-26",
            experienceRating: 3,
        };

        expect(validateForm(formData)).toBe(false);
    });

    test("validateForm rejects invalid data (empty charity name)", () => {
        const formData = {
            charityName: "",
            hoursVolunteered: 3,
            date: "2024-11-26",
            experienceRating: 5,
        };

        expect(validateForm(formData)).toBe(false);
    });

    test("setupFormListener attaches the event listener", () => {
        const form = document.getElementById("volunteer-form");

        // Spy on addEventListener
        const spy = jest.spyOn(form, "addEventListener");

        setupFormListener();

        expect(spy).toHaveBeenCalledWith("submit", expect.any(Function));

        spy.mockRestore(); 
    });
});
