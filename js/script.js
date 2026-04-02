const form = document.getElementById('intakeForm');
const progressFill = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');
const successScreen = document.getElementById('successScreen');

const TOTAL_SECTIONS = 6;
const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/E6kJjCkXCeOgpU5OhZJh/webhook-trigger/17c0408e-e682-45ed-985e-692ca0b1c962';

function sectionComplete(section) {
  const requiredFields = section.querySelectorAll('[required]');

  if (requiredFields.length === 0) {
    const filledFields = section.querySelectorAll(
      'input[type="text"], input[type="email"], input[type="tel"], textarea, select'
    );
    const checkedFields = section.querySelectorAll(
      'input[type="checkbox"]:checked, input[type="radio"]:checked'
    );

    let hasValue = false;

    filledFields.forEach((field) => {
      if (field.value.trim()) {
        hasValue = true;
      }
    });

    return hasValue || checkedFields.length > 0;
  }

  let complete = true;

  requiredFields.forEach((field) => {
    if (field.type === 'radio') {
      const group = section.querySelectorAll(`input[name="${field.name}"]`);
      const oneChecked = [...group].some((radio) => radio.checked);
      if (!oneChecked) {
        complete = false;
      }
    } else if (!field.value.trim()) {
      complete = false;
    }
  });

  return complete;
}

function updateProgress() {
  let completeCount = 0;
  const sections = document.querySelectorAll('.section');

  sections.forEach((section) => {
    if (sectionComplete(section)) {
      completeCount++;
    }
  });

  const percentage = Math.round((completeCount / TOTAL_SECTIONS) * 100);
  progressFill.style.width = `${percentage}%`;
  progressLabel.textContent = `${completeCount} of ${TOTAL_SECTIONS} sections complete`;
}

form.addEventListener('input', updateProgress);
form.addEventListener('change', updateProgress);

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const btnText = document.getElementById('btnText');
  const btnSpinner = document.getElementById('btnSpinner');
  const submitBtn = document.getElementById('submitBtn');

  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-flex';
  submitBtn.disabled = true;

  const formData = new FormData(form);
  const data = {};

  for (const [key, value] of formData.entries()) {
    if (data[key]) {
      data[key] = `${data[key]}, ${value}`;
    } else {
      data[key] = value;
    }
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`);
    }

    form.style.display = 'none';
    successScreen.style.display = 'block';
    progressFill.style.width = '100%';
    progressLabel.textContent = '6 of 6 sections complete';
  } catch (error) {
    console.error('Form submission failed:', error);
    alert('There was a problem submitting the form. Please try again.');

    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
    submitBtn.disabled = false;
  }
});

updateProgress();