/* Portfolio interactions. No frameworks, trackers, API keys, or build tools required. */
const repositories = [
  { name: 'AI-Engineering-Agent-Platform', language: 'Java', area: 'AI agents, RAG & orchestration' },
  { name: 'FlashScale', language: 'Java', area: 'Distributed caching & rate limiting' },
  { name: 'Concurrent-Message-Broker', language: 'Java', area: 'Kafka-inspired message broker' },
  { name: 'SecureNet-and-NIDS', language: 'Jupyter Notebook', area: 'Network intrusion detection & ML' },
  { name: 'Smart_Campus_Facility', language: 'Java', area: 'Scheduling & algorithms' },
  { name: 'E-Commerce', language: 'JavaScript', area: 'Web commerce application' },
  { name: 'Context_MCP', language: 'Java', area: 'Java repository' },
  { name: 'AegisAiBank', language: 'TypeScript', area: 'TypeScript repository' },
  { name: 'GetSocial--MicroServices-', language: 'TypeScript', area: 'TypeScript repository' },
  { name: 'E-Commerce_Order_Management', language: 'TypeScript', area: 'TypeScript repository' },
  { name: 'MiniSearchEngine', language: 'TypeScript', area: 'TypeScript repository' },
  { name: 'ChatApplication', language: 'JavaScript', area: 'JavaScript repository' },
  { name: 'StudentClassifier', language: 'Jupyter Notebook', area: 'Notebook repository' },
  { name: 'DSAA_CP', language: 'TypeScript', area: 'TypeScript repository' },
  { name: 'DSAA_Project', language: 'JavaScript', area: 'JavaScript repository' },
  { name: 'EDI_PROJECT_2ndYear', language: 'C++', area: 'C++ repository' },
  { name: 'Employee_CRUD_Project', language: 'JavaScript', area: 'JavaScript repository' },
  { name: 'github-final-project', language: 'Shell', area: 'Shell repository' },
  { name: 'HealthcareAlly', language: 'TypeScript', area: 'TypeScript repository' },
  { name: 'mcino-Introduction-to-Git-and-GitHub', language: null, area: 'GitHub repository' },
  { name: 'MyTasks', language: 'TypeScript', area: 'TypeScript repository' },
  { name: 'Sumit4374', language: null, area: 'GitHub profile repository' },
  { name: 'TaskManager', language: 'JavaScript', area: 'JavaScript repository' },
  { name: 'WorkSpace', language: 'Jupyter Notebook', area: 'Notebook repository' }
];

const repoGrid = document.getElementById('repoGrid');
const repoCount = document.getElementById('repoCount');
const repoEmpty = document.getElementById('repoEmpty');
const repoSearch = document.getElementById('repoSearch');
const repoDrawer = document.getElementById('repoDrawer');
const toggleRepos = document.getElementById('toggleRepos');
const filters = [...document.querySelectorAll('[data-filter]')];
let activeFilter = 'all';

function renderRepositories() {
  const query = repoSearch.value.toLocaleLowerCase().trim();
  const result = repositories.filter(repo => {
    const languageFits = activeFilter === 'all' || (activeFilter === 'other' ? !['Java', 'TypeScript'].includes(repo.language) : repo.language === activeFilter);
    const textFits = `${repo.name} ${repo.language || ''} ${repo.area}`.toLocaleLowerCase().includes(query);
    return languageFits && textFits;
  });
  repoGrid.replaceChildren(...result.map(repo => {
    const link = document.createElement('a');
    link.className = 'repo-item';
    link.href = `https://github.com/Sumit4374/${encodeURIComponent(repo.name)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const info = document.createElement('span');
    const name = document.createElement('span');
    name.className = 'repo-name';
    name.textContent = repo.name;
    const description = document.createElement('span');
    description.className = 'repo-sub';
    description.textContent = `${repo.language || 'Not specified'} / ${repo.area}`;
    info.append(name, description);
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#icon-arrow-up-right');
    arrow.append(use);
    arrow.setAttribute('aria-hidden', 'true');
    link.append(info, arrow);
    return link;
  }));
  repoCount.textContent = `${result.length} OF ${repositories.length} REPOSITORIES`;
  repoEmpty.hidden = result.length !== 0;
}

if (toggleRepos && repoDrawer) {
  toggleRepos.addEventListener('click', () => {
    const opening = repoDrawer.hidden;
    repoDrawer.hidden = !opening;
    toggleRepos.setAttribute('aria-expanded', String(opening));
    toggleRepos.firstChild.textContent = opening ? 'CLOSE REPOSITORY ARCHIVE ' : 'BROWSE ALL REPOSITORIES ';
    if (opening) { renderRepositories(); repoSearch.focus(); }
  });
  repoSearch.addEventListener('input', renderRepositories);
  filters.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filters.forEach(b => {
      const selected = b === button;
      b.classList.toggle('active', selected);
      b.setAttribute('aria-pressed', String(selected));
    });
    renderRepositories();
  }));
}

const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
function closeMenu() {
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
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) closeMenu(); });
window.matchMedia('(min-width: 921px)').addEventListener('change', event => { if (event.matches && !mobileNav.hidden) closeMenu(); });

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
      await navigator.clipboard.writeText('kusumit437@gmail.com');
    } else {
      const tempInput = document.createElement('textarea');
      tempInput.value = 'kusumit437@gmail.com';
      tempInput.style.position = 'fixed';
      tempInput.style.opacity = '0';
      document.body.appendChild(tempInput);
      tempInput.select();
      if (!document.execCommand('copy')) throw new Error('Copy unavailable');
      tempInput.remove();
    }
    showToast('EMAIL COPIED TO CLIPBOARD');
    copyButton.innerHTML = 'COPIED <svg aria-hidden="true"><use href="#icon-check"/></svg>';
    setTimeout(() => { copyButton.innerHTML = 'COPY EMAIL <svg aria-hidden="true"><use href="#icon-copy"/></svg>'; }, 2600);
  } catch (_) { showToast('COPY UNAVAILABLE — SELECT THE EMAIL ABOVE'); }
});

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: .06, rootMargin: '0px 0px -28px 0px' });
  document.querySelectorAll('.reveal').forEach(node => observer.observe(node));
} else { document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible')); }

document.getElementById('year').textContent = new Date().getFullYear();
