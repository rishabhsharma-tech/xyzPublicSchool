const form = document.getElementById('admissionForm');
const message = document.getElementById('formMessage');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = 'Submitting admission application...';
  submitButton.disabled = true;

  // Only form text fields are sent in this first version. Document files are not uploaded.
  const application = {
    studentName: document.getElementById('studentName').value,
    dob: document.getElementById('dob').value,
    gender: document.getElementById('gender').value,
    classApplyingFor: document.getElementById('class').value,
    fatherName: document.getElementById('fatherName').value,
    motherName: document.getElementById('motherName').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    pincode: document.getElementById('pincode').value,
    previousSchool: document.getElementById('previousSchool').value,
    previousClass: document.getElementById('previousClass').value,
    agreement: document.getElementById('agreement').checked
  };

  try {
    const response = await fetch('/api/admissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(application)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Application could not be saved.');

    message.textContent = `Application submitted successfully. Reference ID: ${result.applicationId}`;
    form.reset();
  } catch (error) {
    message.textContent = error.message || 'Could not connect to the server. Please try again.';
  } finally {
    submitButton.disabled = false;
  }
});
