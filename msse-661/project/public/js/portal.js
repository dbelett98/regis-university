// public/js/portal.js

// Function to load the user profile (assumes /profile returns { business_name, username })
async function loadUserProfile() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3001/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user profile.');
        }
        const user = await response.json();
        const displayBusinessNameEl = document.getElementById('displayBusinessName');
        if (displayBusinessNameEl) {
            displayBusinessNameEl.textContent = user.business_name;
        } else {
            console.warn('Element with ID "displayBusinessName" not found.');
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        alert('Could not load user profile.');
    }
}

// (Optional) Function to load prior requests; initially empty
async function loadPriorRequests() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:3001/get-requests', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch prior requests.');
        }
        const requests = await response.json();
        const priorRequestsList = document.getElementById('priorRequestsList');
        // Clear the list
        priorRequestsList.innerHTML = "";
        // If there are no requests, show a default message:
        if (requests.length === 0) {
            const li = document.createElement('li');
            li.className = "list-group-item";
            li.textContent = "No prior requests.";
            priorRequestsList.appendChild(li);
        } else {
            // Otherwise, display each request's subject and uploaded date
            requests.forEach(request => {
                const li = document.createElement('li');
                li.className = "list-group-item d-flex justify-content-between align-items-center";
                li.innerHTML = `<span>${request.subject}</span><span class="badge badge-primary badge-pill">${new Date(request.uploaded_date).toLocaleDateString()}</span>`;
                priorRequestsList.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Error fetching prior requests:', error);
        // Optionally, you could alert the user or ignore silently.
    }
}

// Form Validation Function for the Create Request Form
function validateServiceRequestForm() {
    let valid = true;

    // Get all input elements
    const subjectInput = document.getElementById('requestSubject');
    const descriptionInput = document.getElementById('requestDescription');
    const dueDateInput = document.getElementById('requestDate');

    // Validate Subject: at least 5 characters
    if (subjectInput.value.trim().length < 5) {
        subjectInput.classList.add('is-invalid');
        subjectInput.classList.remove('is-valid');
        valid = false;
    } else {
        subjectInput.classList.remove('is-invalid');
        subjectInput.classList.add('is-valid');
    }

    // Validate Description: at least 10 characters
    if (descriptionInput.value.trim().length < 10) {
        descriptionInput.classList.add('is-invalid');
        descriptionInput.classList.remove('is-valid');
        valid = false;
    } else {
        descriptionInput.classList.remove('is-invalid');
        descriptionInput.classList.add('is-valid');
    }

    // Validate Due Date: must be provided and in the future (assumes date in YYYY-MM-DD)
    if (!dueDateInput.value) {
        dueDateInput.classList.add('is-invalid');
        dueDateInput.classList.remove('is-valid');
        valid = false;
    } else {
        const selectedDate = new Date(dueDateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // ignore the time part
        if (selectedDate <= today) {
            dueDateInput.classList.add('is-invalid');
            dueDateInput.classList.remove('is-valid');
            valid = false;
        } else {
            dueDateInput.classList.remove('is-invalid');
            dueDateInput.classList.add('is-valid');
        }
    }

    return valid;
}

// Setup event listeners after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load user profile and prior requests when the page loads
    loadUserProfile();
    loadPriorRequests();

    // Get the Service Request form
    const serviceRequestForm = document.getElementById('serviceRequestForm');
    if (serviceRequestForm) {
        serviceRequestForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Validate the form fields
            if (!validateServiceRequestForm()) {
                alert("Please fill all required fields correctly.");
                return;
            }

            // Prepare the data payload
            const data = {
                subject: document.getElementById('requestSubject').value.trim(),
                description: document.getElementById('requestDescription').value.trim(),
                due_date: document.getElementById('requestDate').value  // should be in correct format
            };

            const token = localStorage.getItem('token');

            try {
                const response = await fetch('http://localhost:3001/create-request', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                    // Reset the form and validation styling
                    serviceRequestForm.reset();
                    const inputs = serviceRequestForm.querySelectorAll('.form-control');
                    inputs.forEach(input => {
                        input.classList.remove('is-valid');
                        input.classList.remove('is-invalid');
                    });
                    // Reload prior requests to show the new submission
                    loadPriorRequests();
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error submitting request:', error);
                alert('An error occurred while creating the request.');
            }
        });
    }
});
