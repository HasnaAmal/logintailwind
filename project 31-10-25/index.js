(function () {
  const form = document.querySelector('.sign form') || document.querySelector('form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (!form || !emailInput || !passwordInput) return;

  // Helpers
  function createErrorEl(input) {
    const existing = input.parentElement.querySelector('.input-error');
    if (existing) return existing;
    const el = document.createElement('div');
    el.className = 'input-error';
    el.style.color = '#bf1650';
    el.style.fontSize = '13px';
    el.style.marginTop = '6px';
    input.parentElement.appendChild(el);
    return el;
  }

  function setError(input, message) {
    const err = createErrorEl(input);
    err.textContent = message;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input) {
    const err = input.parentElement.querySelector('.input-error');
    if (err) err.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  function validateEmail(value) {
    // simple, practical regex (not perfect but good enough)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return re.test(value.trim());
  }

  function validatePassword(value) {
    // rules: at least 8 chars, contains letter and number
    const v = value || '';
    if (v.length < 8) return { ok: false, reason: 'Password must be at least 8 characters.' };
    if (!/[a-zA-Z]/.test(v)) return { ok: false, reason: 'Password must contain at least one letter.' };
    if (!/[0-9]/.test(v)) return { ok: false, reason: 'Password must contain at least one number.' };
    return { ok: true };
  }

  // live validation
  emailInput.addEventListener('input', () => {
    const val = emailInput.value;
    if (val === '') {
      setError(emailInput, 'Email is required.');
    } else if (!validateEmail(val)) {
      setError(emailInput, 'Please enter a valid email (example@domain.com).');
    } else {
      clearError(emailInput);
    }
  });

  passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    const res = validatePassword(val);
    if (val === '') {
      setError(passwordInput, 'Password is required.');
    } else if (!res.ok) {
      setError(passwordInput, res.reason);
    } else {
      clearError(passwordInput);
    }
  });

  // accessibility: validate on blur too
  emailInput.addEventListener('blur', () => {
    const val = emailInput.value;
    if (val === '') setError(emailInput, 'Email is required.');
    else if (!validateEmail(val)) setError(emailInput, 'Please enter a valid email.');
  });

  passwordInput.addEventListener('blur', () => {
    const val = passwordInput.value;
    const res = validatePassword(val);
    if (val === '') setError(passwordInput, 'Password is required.');
    else if (!res.ok) setError(passwordInput, res.reason);
  });

  // on submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;

    // email check
    const emailVal = emailInput.value.trim();
    if (emailVal === '') {
      setError(emailInput, 'Email is required.');
      valid = false;
    } else if (!validateEmail(emailVal)) {
      setError(emailInput, 'Please enter a valid email.');
      valid = false;
    } else {
      clearError(emailInput);
    }

    // password check
    const pwdVal = passwordInput.value;
    const pwdRes = validatePassword(pwdVal);
    if (pwdVal === '') {
      setError(passwordInput, 'Password is required.');
      valid = false;
    } else if (!pwdRes.ok) {
      setError(passwordInput, pwdRes.reason);
      valid = false;
    } else {
      clearError(passwordInput);
    }

    if (!valid) {
      // focus the first invalid field
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const success = document.createElement('div');
    success.className = 'form-success';
    success.textContent = 'Signed in successfully (demo).';
    success.style.color = '#0a8a3f';
    success.style.marginTop = '12px';
    form.appendChild(success);

    // disable button briefly
    const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
    if (submitBtn) {
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.disabled = false;
      }, 1500);
    }

    // reset after short delay (demo)
    setTimeout(() => {
      if (success && success.parentElement) success.parentElement.removeChild(success);
      form.reset();
    }, 1200);
  });
})();
