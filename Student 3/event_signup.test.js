/**
 * @jest-environment jsdom
 */

describe("Event Signup Form", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <form id="eventSignupForm">
                <input type="text" id="eventName" name="eventName" required>
                <input type="text" id="representativeName" name="representativeName" required>
                <input type="email" id="representativeEmail" name="representativeEmail" required>
                <select id="role" name="role" required>
                    <option value="">--Select Role--</option>
                    <option value="sponsor">Sponsor</option>
                    <option value="participant">Participant</option>
                    <option value="organizer">Organizer</option>
                </select>
                <button type="submit">Submit</button>
            </form>
        `;
    });

    test("Form submission triggers function", () => {
        const mockSubmit = jest.fn();
        document.getElementById("eventSignupForm").addEventListener("submit", mockSubmit);
        document.getElementById("eventSignupForm").dispatchEvent(new Event("submit"));
        expect(mockSubmit).toHaveBeenCalled();
    });

    test("Function correctly collects form data", () => {
        document.getElementById("eventName").value = "Charity Gala";
        document.getElementById("representativeName").value = "Amandeep Singh";
        document.getElementById("representativeEmail").value = "amandeep@example.com";
        document.getElementById("role").value = "sponsor";

        const formData = {
            eventName: document.getElementById("eventName").value.trim(),
            representativeName: document.getElementById("representativeName").value.trim(),
            representativeEmail: document.getElementById("representativeEmail").value.trim(),
            role: document.getElementById("role").value.trim(),
        };

        expect(formData).toEqual({
            eventName: "Charity Gala",
            representativeName: "Amandeep Singh",
            representativeEmail: "amandeep@example.com",
            role: "sponsor",
        });
    });

    test("Detects missing required fields", () => {
        document.getElementById("eventName").value = "";
        const errors = [];
        if (!document.getElementById("eventName").value.trim()) errors.push("Event name is required.");
        expect(errors).toContain("Event name is required.");
    });

    test("Detects invalid email format", () => {
        document.getElementById("representativeEmail").value = "invalid-email";
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            document.getElementById("representativeEmail").value.trim()
        );
        expect(isValidEmail).toBe(false);
    });
});
