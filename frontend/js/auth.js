/**
 * Swind Platform — Auth Page Logic
 * 
 * Handles form submissions, client-side validation,
 * and navigation for Login, Signup, and Forgot Password pages.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── Detect which page we're on ──────────────────────
  const loginForm     = document.getElementById('loginForm');
  const signupForm    = document.getElementById('signupForm');
  const forgotForm    = document.getElementById('forgotForm');

  if (loginForm)  initLogin(loginForm);
  if (signupForm) initSignup(signupForm);
  if (forgotForm) initForgotPassword(forgotForm);

  // ── Password visibility toggles ────────────────────
  document.querySelectorAll('.password-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      btn.innerHTML = isHidden ? eyeOffSVG() : eyeSVG();
    });
  });

  // ── Password strength indicator (signup) ───────────
  const passwordInput = document.getElementById('signupPassword');
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      updatePasswordStrength(passwordInput.value);
    });
  }
});

/* ═══════════════════════════════════════════════════════
   LOGIN
   ═══════════════════════════════════════════════════════ */
function initLogin(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const email    = form.querySelector('#loginEmail');
    const password = form.querySelector('#loginPassword');
    let valid = true;

    if (!email.value.trim()) {
      showFieldError(email, 'Email is required.');
      valid = false;
    } else if (!isValidEmail(email.value)) {
      showFieldError(email, 'Please enter a valid email address.');
      valid = false;
    }

    if (!password.value) {
      showFieldError(password, 'Password is required.');
      valid = false;
    } else if (password.value.length < 6) {
      showFieldError(password, 'Password must be at least 6 characters.');
      valid = false;
    }

    if (!valid) return;

    const btn = form.querySelector('.btn-submit');
    setLoading(btn, true);

    try {
      const data = await apiRequest('/api/auth/login', 'POST', {
        email: email.value.trim(),
        password: password.value,
      });

      // Store token and user info
      localStorage.setItem('swind_token', data.token);
      localStorage.setItem('swind_user_name', data.user.name);
      localStorage.setItem('swind_user_email', data.user.email);

      showToast('Login successful! Redirecting…', 'success');

      setTimeout(() => {
        window.location.href = '/pages/dashboard.html';
      }, 600);
    } catch (err) {
      showErrorBanner(err.data?.detail || err.message);
      setLoading(btn, false);
    }
  });
}

/* ═══════════════════════════════════════════════════════
   SIGNUP
   ═══════════════════════════════════════════════════════ */
function initSignup(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name            = form.querySelector('#signupName');
    const email           = form.querySelector('#signupEmail');
    const password        = form.querySelector('#signupPassword');
    const confirmPassword = form.querySelector('#signupConfirmPassword');
    let valid = true;

    if (!name.value.trim()) {
      showFieldError(name, 'Full name is required.');
      valid = false;
    }

    if (!email.value.trim()) {
      showFieldError(email, 'Email is required.');
      valid = false;
    } else if (!isValidEmail(email.value)) {
      showFieldError(email, 'Please enter a valid email address.');
      valid = false;
    }

    if (!password.value) {
      showFieldError(password, 'Password is required.');
      valid = false;
    } else if (password.value.length < 6) {
      showFieldError(password, 'Password must be at least 6 characters.');
      valid = false;
    }

    if (!confirmPassword.value) {
      showFieldError(confirmPassword, 'Please confirm your password.');
      valid = false;
    } else if (password.value !== confirmPassword.value) {
      showFieldError(confirmPassword, 'Passwords do not match.');
      valid = false;
    }

    if (!valid) return;

    const btn = form.querySelector('.btn-submit');
    setLoading(btn, true);

    try {
      const data = await apiRequest('/api/auth/signup', 'POST', {
        name: name.value.trim(),
        email: email.value.trim(),
        password: password.value,
      });

      showToast(data.message || 'Account created successfully!', 'success');

      setTimeout(() => {
        window.location.href = '/pages/login.html';
      }, 2000);
    } catch (err) {
      showErrorBanner(err.data?.detail || err.message);
      setLoading(btn, false);
    }
  });
}

/* ═══════════════════════════════════════════════════════
   FORGOT PASSWORD
   ═══════════════════════════════════════════════════════ */
function initForgotPassword(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const email = form.querySelector('#forgotEmail');
    let valid = true;

    if (!email.value.trim()) {
      showFieldError(email, 'Email is required.');
      valid = false;
    } else if (!isValidEmail(email.value)) {
      showFieldError(email, 'Please enter a valid email address.');
      valid = false;
    }

    if (!valid) return;

    const btn = form.querySelector('.btn-submit');
    setLoading(btn, true);

    try {
      const data = await apiRequest('/api/auth/forgot-password', 'POST', {
        email: email.value.trim(),
      });

      // Hide form and show success message
      form.style.display = 'none';
      const successMsg = document.getElementById('forgotSuccess');
      if (successMsg) {
        successMsg.classList.add('visible');
      }
    } catch (err) {
      showErrorBanner(err.data?.detail || err.message);
      setLoading(btn, false);
    }
  });
}

/* ═══════════════════════════════════════════════════════
   VALIDATION HELPERS
   ═══════════════════════════════════════════════════════ */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ═══════════════════════════════════════════════════════
   PASSWORD STRENGTH
   ═══════════════════════════════════════════════════════ */
function updatePasswordStrength(password) {
  const fill  = document.querySelector('.strength-bar-fill');
  const label = document.querySelector('.strength-label');
  if (!fill || !label) return;

  // Remove existing classes
  fill.classList.remove('weak', 'medium', 'strong');
  label.classList.remove('weak', 'medium', 'strong');

  if (!password) {
    fill.style.width = '0%';
    label.textContent = '';
    return;
  }

  let score = 0;
  if (password.length >= 6)  score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    fill.classList.add('weak');
    label.classList.add('weak');
    label.textContent = 'Weak';
  } else if (score <= 3) {
    fill.classList.add('medium');
    label.classList.add('medium');
    label.textContent = 'Medium';
  } else {
    fill.classList.add('strong');
    label.classList.add('strong');
    label.textContent = 'Strong';
  }
}

/* ═══════════════════════════════════════════════════════
   UI HELPERS
   ═══════════════════════════════════════════════════════ */
function showFieldError(input, message) {
  input.classList.add('input-error');
  const errorEl = input.closest('.form-group').querySelector('.field-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

function clearErrors() {
  document.querySelectorAll('.input-error').forEach((el) =>
    el.classList.remove('input-error')
  );
  document.querySelectorAll('.field-error').forEach((el) => {
    el.textContent = '';
    el.classList.remove('visible');
  });
  const banner = document.querySelector('.error-banner');
  if (banner) banner.classList.remove('visible');
}

function showErrorBanner(message) {
  const banner = document.querySelector('.error-banner');
  if (banner) {
    banner.textContent = message;
    banner.classList.add('visible');
  }
}

function setLoading(btn, loading) {
  if (loading) {
    btn.classList.add('loading');
  } else {
    btn.classList.remove('loading');
  }
}

function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  // Auto-remove
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ═══════════════════════════════════════════════════════
   SVG ICONS
   ═══════════════════════════════════════════════════════ */
function eyeSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
}

function eyeOffSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
}
