(function () {
  'use strict';

  var form = document.querySelector('[data-partner-form]');
  var success = document.querySelector('[data-partner-success]');
  var submitted = new URLSearchParams(window.location.search).get('submitted');

  if (submitted === 'thanks' && form && success) {
    form.hidden = true;
    success.hidden = false;
    window.history.replaceState(null, '', window.location.pathname + '#kontakt');
  }
})();
