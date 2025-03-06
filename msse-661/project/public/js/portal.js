// public/js/portal.js

// Function to load user profile
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
        // Update DOM with user data (assuming element with id "displayBusinessName" exists)
        const displayBusinessNameEl = document.getElementById('displayBusinessName');
        if (displayBusinessNameEl) {
            displayBusinessNameEl.textContent = user.business_name;
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
        alert('Could not load user profile.');
    }
}

// Function to validate Service Request form inputs
function validateServiceRequestForm() {
    let valid = true;

    // Get all input elements
    const subjectInput = document.getElementById('requestSubject');
    const descriptionInput = document.getElementById('requestDescription');
    const dateInput = document.getElementById('requestDate');
    const emailInput = document.getElementById('contactEmail');

    // Validate Subject: at least 5 characters
    if (subjectInput.value.trim().length < 5) {
        subjectInput.classList.add('is-invalid');
        valid = false;
    } else {
        subjectInput.classList.remove('is-invalid');
        subjectInput.classList.add('is-valid');
    }

    // Validate Description: at least 10 characters
    if (descriptionInput.value.trim().length < 10) {
        descriptionInput.classList.add('is-invalid');
        valid = false;
    } else {
        descriptionInput.classList.remove('is-invalid');
        descriptionInput.classList.add('is-valid');
    }

    // Validate Preferred Date: must be in the future
    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignore time part
    if (!dateInput.value || selectedDate <= today) {
        dateInput.classList.add('is-invalid');
        valid = false;
    } else {
        dateInput.classList.remove('is-invalid');
        dateInput.classList.add('is-valid');
    }

    // Validate Contact Email using a simple regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
        emailInput.classList.add('is-invalid');
        valid = false;
    } else {
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
    }

    return valid;
}

// Add event listeners after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();

    // Service Request Form Validation and Submission
    const serviceRequestForm = document.getElementById('serviceRequestForm');
    if (serviceRequestForm) {
        serviceRequestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Validate the form fields
            const isValid = validateServiceRequestForm();

            if (isValid) {
                // Here you would typically send the form data to an API endpoint.
                // For now, we simply simulate a successful submission.
                alert("Service request validated and submitted successfully!");
                // Optionally, clear form fields or update the UI.
                serviceRequestForm.reset();
                // Also, remove validation classes if desired:
                const inputs = serviceRequestForm.querySelectorAll('.form-control');
                inputs.forEach(input => {
                    input.classList.remove('is-valid');
                });
            } else {
                alert("Please correct the errors in the form.");
            }
        });
    }
});
