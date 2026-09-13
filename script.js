const form = document.querySelector('#details-form');
const nameInput = document.querySelector('#name');
const codeInput = document.querySelector('#code');
const websiteInput = document.querySelector('#website');
const submitButton = document.querySelector('#submit-button');
const buttonLabel = document.querySelector('#button-label');
const formMessage = document.querySelector('#form-message');

function setFieldError(input, message) {
  const error = document.querySelector(`#${input.id}-error`);
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  error.textContent = message;
}

function validate(name, code) {
  let valid = true;
  setFieldError(nameInput, '');
  setFieldError(codeInput, '');

  if (!name) {
    setFieldError(nameInput, 'Please enter your name.');
    valid = false;
  } else if (name.length > 100) {
    setFieldError(nameInput, 'Name must be 100 characters or fewer.');
    valid = false;
  }

  if (!code) {
    setFieldError(codeInput, 'Please enter your code.');
    valid = false;
  } else if (code.length > 100) {
    setFieldError(codeInput, 'Code must be 100 characters or fewer.');
    valid = false;
  }

  return valid;
}

function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message ${type}`;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const code = codeInput.value.trim();

  showMessage('', '');
  if (!validate(name, code)) {
    showMessage('Please enter your name and code.', 'error');
    return;
  }

  submitButton.disabled = true;
  buttonLabel.textContent = 'Submitting...';

  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, code, website: websiteInput.value }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) {
      throw new Error('submission_failed');
    }

    showMessage('Details submitted successfully.', 'success');
    form.reset();
    setFieldError(nameInput, '');
    setFieldError(codeInput, '');
  } catch (error) {
    showMessage(error instanceof TypeError ? 'Unable to connect. Please try again.' : 'Unable to submit your details. Please try again.', 'error');
  } finally {
    submitButton.disabled = false;
    buttonLabel.textContent = 'Submit to BookyMyTest';
  }
});
