/**
 * Swind Platform — Dashboard Logic
 * 
 * Token verification, user info display, and logout handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── Auth Guard ──────────────────────────────────────
  const token    = localStorage.getItem('swind_token');
  const userName = localStorage.getItem('swind_user_name');

  if (!token) {
    window.location.href = '/pages/login.html';
    return;
  }

  // ── Display User Initials ──────────────────────────
  const avatarEl = document.getElementById('userAvatar');
  if (avatarEl && userName) {
    const initials = userName
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
    avatarEl.textContent = initials;
  }

  // ── Logout ─────────────────────────────────────────
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('swind_token');
      localStorage.removeItem('swind_user_name');
      localStorage.removeItem('swind_user_email');
      window.location.href = '/pages/login.html';
    });
  }
});
