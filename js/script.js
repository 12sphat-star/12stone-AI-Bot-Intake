const form = document.getElementById('intakeForm');
const progressFill = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');
const successScreen = document.getElementById('successScreen');

const TOTAL_SECTIONS = 6;

function sectionComplete(section) {
  const requiredFields = section.querySelectorAll('[required]');
  if (requiredFields.length === 0) {
    const filledText = section.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea, select');
    const checked = section.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked');
    let hasValue = false;

    filledText.forEach(field => {
      if (field.value.trim()) hasValue = true;
    });

    return hasValue || checked.length > 0;
  }

  let complete = true;

  requiredFields.forEach(field => {
    if (field.type === 'radio') {
      const group = section.querySelectorAll(`input[name="${field.name}"]`);
      const oneChecked = [...group].some(r => r.checked);
      if (!oneChecked) complete = false;
    } else if (!field.value.trim()) {
      complete = false;
    }
  });

  return complete;
}

function updateProgress() {
  let completeCount = 0;
  const sections = document.querySelectorAll('.section');

  sections.forEach(section => {
    if (sectionComplete(section)) completeCount++;
  });

  const pct = Math.round((completeCount / TOTAL_SECTIONS) * 100);
  progressFill.style.width = `${pct}%`;
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

  console.log('Form submission data:', data);

  setTimeout(() => {
    form.style.display = 'none';
    successScreen.style.display = 'block';
    progressFill.style.width = '100%';
    progressLabel.textContent = '6 of 6 sections complete';
  }, 700);
});

updateProgress();