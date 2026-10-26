/* Menu, clipboard, and animation controls. Project selection is build-time only. */
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
function closeMenu() {
  if (!mobileNav || !menuToggle) return;
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  menuToggle.querySelector('use').setAttribute('href', '#icon-menu');
  document.body.classList.remove('menu-open');
}
menuToggle?.addEventListener('click', () => {
  const opening = mobileNav.hidden;
  mobileNav.hidden = !opening;
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
  menuToggle.querySelector('use').setAttribute('href', opening ? '#icon-close' : '#icon-menu');
  document.body.classList.toggle('menu-open', opening);
});
mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && mobileNav && !mobileNav.hidden) { closeMenu(); menuToggle.focus(); } });
window.matchMedia('(min-width: 921px)').addEventListener('change', event => { if (event.matches && mobileNav && !mobileNav.hidden) closeMenu(); });

let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove('visible'), 2700);
}
const copyButton = document.getElementById('copyEmail');
copyButton?.addEventListener('click', async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(copyButton.dataset.email);
    } else {
      const tempInput = document.createElement('textarea');
      tempInput.value = copyButton.dataset.email;
      tempInput.style.position = 'fixed';
      tempInput.style.opacity = '0';
      document.body.appendChild(tempInput);
      tempInput.select();
      try {
        if (!document.execCommand('copy')) throw new Error('Copy unavailable');
      } finally { tempInput.remove(); copyButton.focus(); }
    }
    showToast('EMAIL COPIED TO CLIPBOARD');
    copyButton.innerHTML = 'COPIED <svg aria-hidden="true"><use href="#icon-check"/></svg>';
    setTimeout(() => { copyButton.innerHTML = 'COPY EMAIL <svg aria-hidden="true"><use href="#icon-copy"/></svg>'; }, 2600);
  } catch (_) { showToast('COPY UNAVAILABLE — SELECT THE EMAIL ABOVE'); }
});

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: .06, rootMargin: '0px 0px -28px 0px' });
  document.querySelectorAll('.reveal').forEach(node => observer.observe(node));
  document.documentElement.classList.add('reveal-enabled');
} else { document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible')); }

const motionToggle = document.getElementById('motionToggle');
if (motionToggle) {
  motionToggle.hidden = motionPreference.matches;
  motionToggle.addEventListener('click', () => {
    const paused = document.body.classList.toggle('motion-paused');
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionToggle.textContent = paused ? 'RESUME ANIMATION' : 'PAUSE ANIMATION';
  });
  motionPreference.addEventListener('change', event => {
    motionToggle.hidden = event.matches;
    if (event.matches) document.documentElement.classList.remove('reveal-enabled');
  });
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
