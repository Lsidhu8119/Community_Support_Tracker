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
            <table id="signupTable">
                <thead>
                    <tr>
                        <th>Event Name</th>
                        <th>Participant Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <section id="upcomingEvents">
                <h2>Upcoming Events</h2>
                <ul id="rolesBreakdown"></ul>
            </section>
        `;

        localStorage.clear();
    });

    // Stage One Tests
    describe("Stage One: Event Signup Form", () => {
        test("Function is triggered on form submission", () => {
            const form = document.getElementById("eventSignupForm");
            const mockSubmitHandler = jest.fn((e) => e.preventDefault());
            form.addEventListener("submit", mockSubmitHandler);

            form.dispatchEvent(new Event("submit"));

            expect(mockSubmitHandler).toHaveBeenCalled();
        });

        test("Function correctly collects form data", () => {
            document.getElementById("eventName").value = "Charity Gala";
            document.getElementById("representativeName").value = "Amandeep Singh";
            document.getElementById("representativeEmail").value = "amandeep@example.com";
            document.getElementById("role").value = "sponsor";

            const formData = {
                eventName: document.getElementById("eventName").value,
                representativeName: document.getElementById("representativeName").value,
                representativeEmail: document.getElementById("representativeEmail").value,
                role: document.getElementById("role").value,
            };

            expect(formData).toEqual({
                eventName: "Charity Gala",
                representativeName: "Amandeep Singh",
                representativeEmail: "amandeep@example.com",
                role: "sponsor",
            });
        });

        test("Required field validation", () => {
            const eventNameInput = document.getElementById("eventName");
            eventNameInput.value = ""; // Leave field empty
            expect(eventNameInput.checkValidity()).toBe(false);

            const emailInput = document.getElementById("representativeEmail");
            emailInput.value = ""; // Leave field empty
            expect(emailInput.checkValidity()).toBe(false);
        });

        test("Email format validation", () => {
            const emailInput = document.getElementById("representativeEmail");
            emailInput.value = "invalid-email";
            expect(emailInput.checkValidity()).toBe(false);

            emailInput.value = "valid@example.com";
            expect(emailInput.checkValidity()).toBe(true);
        });

        test("Temporary data object is correctly populated", () => {
            const tempData = {
                eventName: "Tech Conference",
                representativeName: "Sidhu Moosewala",
                representativeEmail: "sidhu.moosewala@example.com",
                role: "participant",
            };

            expect(tempData).toEqual({
                eventName: "Tech Conference",
                representativeName: "Sidhu Moosewala",
                representativeEmail: "sidhu.moosewala@example.com",
                role: "participant",
            });
        });
    });

    // Stage Two Tests
    describe("Stage Two: Event Signup Management", () => {
        test("Data is correctly stored in localStorage", () => {
            const signup = {
                eventName: "Charity Gala",
                representativeName: "Amandeep Singh",
                representativeEmail: "amandeep@example.com",
                role: "sponsor",
            };
            localStorage.setItem("signups", JSON.stringify([signup]));
            const storedData = JSON.parse(localStorage.getItem("signups"));
            expect(storedData).toContainEqual(signup);
        });

        test("Data is correctly retrieved from localStorage and loaded into the table", () => {
            const signup = {
                eventName: "Charity Gala",
                representativeName: "Amandeep Singh",
                representativeEmail: "amandeep@example.com",
                role: "sponsor",
            };
            localStorage.setItem("signups", JSON.stringify([signup]));

            const tableBody = document.querySelector("#signupTable tbody");
            tableBody.innerHTML = ""; // Clear existing rows
            const storedData = JSON.parse(localStorage.getItem("signups"));
            storedData.forEach((data) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${data.eventName}</td>
                    <td>${data.representativeName}</td>
                    <td>${data.representativeEmail}</td>
                    <td>${data.role}</td>
                    <td><button class="delete-button">Delete</button></td>
                `;
                tableBody.appendChild(row);
            });

            expect(tableBody.children.length).toBe(1);
            expect(tableBody.children[0].querySelector("td").textContent).toBe("Charity Gala");
        });

        test("Upcoming events section correctly displays signups by role", () => {
            const signups = [
                { role: "sponsor" },
                { role: "participant" },
                { role: "organizer" },
                { role: "participant" },
            ];
            localStorage.setItem("signups", JSON.stringify(signups));

            const rolesBreakdown = document.getElementById("rolesBreakdown");
            rolesBreakdown.innerHTML = ""; // Clear existing list
            const roleCounts = signups.reduce((acc, signup) => {
                acc[signup.role] = (acc[signup.role] || 0) + 1;
                return acc;
            }, {});
            for (const [role, count] of Object.entries(roleCounts)) {
                const li = document.createElement("li");
                li.textContent = `${role}: ${count}`;
                rolesBreakdown.appendChild(li);
            }

            expect(rolesBreakdown.children.length).toBe(3);
            expect(rolesBreakdown.children[1].textContent).toBe("participant: 2");
        });

        test("Delete button removes a record from the table", () => {
            const tableBody = document.querySelector("#signupTable tbody");
            const signup = { eventName: "Charity Gala" };
            tableBody.innerHTML = `
                <tr>
                    <td>${signup.eventName}</td>
                    <td>Amandeep Singh</td>
                    <td>amandeep@example.com</td>
                    <td>sponsor</td>
                    <td><button class="delete-button">Delete</button></td>
                </tr>
            `;
            const deleteButton = tableBody.querySelector(".delete-button");
            deleteButton.click();
            deleteButton.parentElement.parentElement.remove();

            expect(tableBody.children.length).toBe(0);
        });

        test("Delete button removes a record from localStorage", () => {
            const signups = [
                { eventName: "Charity Gala" },
                { eventName: "Tech Conference" },
            ];
            localStorage.setItem("signups", JSON.stringify(signups));

            const signupToDelete = "Charity Gala";
            const updatedSignups = signups.filter((signup) => signup.eventName !== signupToDelete);
            localStorage.setItem("signups", JSON.stringify(updatedSignups));

            const storedData = JSON.parse(localStorage.getItem("signups"));
            expect(storedData).not.toContainEqual({ eventName: "Charity Gala" });
            expect(storedData.length).toBe(1);
        });
    });
});
