(function () {
  'use strict';

  var form = document.querySelector('[data-partner-form]');
  var success = document.querySelector('[data-partner-success]');
  var status = document.querySelector('[data-partner-status]');
  var submitted = new URLSearchParams(window.location.search).get('submitted');

  var copy = function () {
    return document.documentElement.lang === 'en'
      ? { sending: 'Sending…', error: 'Something went wrong. Please try again or email us directly.' }
      : { sending: 'Skickar…', error: 'Något gick fel. Försök igen eller mejla oss direkt.' };
  };

  var showSuccess = function () {
    if (!form || !success) return;
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (submitted === 'thanks' && form && success) {
    showSuccess();
    window.history.replaceState(null, '', window.location.pathname + '#kontakt');
  }

  if (!form) return;

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var honeypot = form.elements._honey;
    if (honeypot && honeypot.value) {
      showSuccess();
      return;
    }

    var submitButton = form.querySelector('button[type="submit"]');
    var submitLabel = submitButton.querySelector('span');
    var originalLabel = submitLabel.textContent;
    var messages = copy();

    submitButton.disabled = true;
    submitLabel.textContent = messages.sending;
    status.hidden = true;

    var payload = {};
    new FormData(form).forEach(function (value, key) {
      if (key !== '_next' && key !== '_honey') payload[key] = value;
    });

    try {
      var response = await fetch('https://formsubmit.co/ajax/infomentmarkers@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Form submission failed: ' + response.status);

      form.reset();
      showSuccess();
    } catch (error) {
      console.error('Partner form submission failed', error);
      status.textContent = messages.error;
      status.hidden = false;
      submitButton.disabled = false;
      submitLabel.textContent = originalLabel;
    }
  });
})();
