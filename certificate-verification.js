(() => {
  const form = document.querySelector('#certificate-form');
  const input = document.querySelector('#certificate-id');
  const message = document.querySelector('#verification-message');
  const result = document.querySelector('#verification-result');
  const resultId = document.querySelector('#result-id');
  const resultLearner = document.querySelector('#result-learner');
  const resultCourse = document.querySelector('#result-course');
  const resultIssuedAt = document.querySelector('#result-issued-at');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const certificateId = input.value.trim();
    if (!certificateId) {
      result.hidden = true;
      message.textContent = 'Please enter a certificate ID to continue.';
      message.classList.remove('is-valid');
      input.focus();
      return;
    }
    if (!window.CERTIFICATE_VERIFY_API_URL) {
      result.hidden = true;
      message.textContent = 'Certificate verification is not configured yet.';
      message.classList.remove('is-valid');
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    message.textContent = 'Verifying certificate...';
    message.classList.remove('is-valid');
    try {
      const response = await fetch(window.CERTIFICATE_VERIFY_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificate_id: certificateId }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'We could not verify this certificate.');

      const certificate = body.certificate;
      resultId.textContent = certificate.certificate_id;
      resultLearner.textContent = certificate.learner_name;
      resultCourse.textContent = certificate.course_name;
      resultIssuedAt.textContent = new Date(`${certificate.issued_at}T00:00:00`).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      result.hidden = false;
      message.textContent = 'Certificate ID found - this credential is valid.';
      message.classList.add('is-valid');
    } catch (error) {
      result.hidden = true;
      message.textContent = error.message || 'We could not verify this certificate.';
    } finally {
      button.disabled = false;
    }
  }, true);
})();
