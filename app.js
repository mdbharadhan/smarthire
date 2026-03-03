const state = {
  route: 'home',
  dashboardTab: 'overview',
  authMode: 'login',
  user: JSON.parse(localStorage.getItem('ainex_user') || 'null'),
  analysis: JSON.parse(localStorage.getItem('ainex_latest_analysis') || 'null'),
  history: JSON.parse(localStorage.getItem('ainex_history') || '[]'),
  statusMessage: '',
  draftResume: '',
  draftJD: '',
  lastResumeName: ''
};

const SKILL_PATTERNS = {
  javascript: [/\bjavascript\b/i, /\bjs\b/i, /\bes6\b/i],
  typescript: [/\btypescript\b/i, /\bts\b/i],
  react: [/\breact\b/i, /\breactjs\b/i, /\breact\.js\b/i],
  node: [/\bnode\b/i, /\bnodejs\b/i, /\bnode\.js\b/i],
  python: [/\bpython\b/i],
  sql: [/\bsql\b/i, /\bmysql\b/i],
  postgresql: [/\bpostgresql\b/i, /\bpostgres\b/i],
  mongodb: [/\bmongodb\b/i, /\bmongo\b/i],
  aws: [/\baws\b/i, /\bamazon web services\b/i],
  docker: [/\bdocker\b/i],
  kubernetes: [/\bkubernetes\b/i, /\bk8s\b/i],
  git: [/\bgit\b/i, /\bgithub\b/i, /\bgitlab\b/i],
  html: [/\bhtml\b/i, /\bhtml5\b/i],
  css: [/\bcss\b/i, /\bcss3\b/i, /\btailwind\b/i, /\bbootstrap\b/i],
  'next.js': [/\bnext\.js\b/i, /\bnextjs\b/i],
  java: [/\bjava\b/i],
  spring: [/\bspring\b/i, /\bspring boot\b/i],
  excel: [/\bexcel\b/i],
  'power bi': [/\bpower bi\b/i],
  communication: [/\bcommunication\b/i, /\bstakeholder\b/i],
  leadership: [/\bleadership\b/i, /\bled\b/i],
  agile: [/\bagile\b/i, /\bscrum\b/i, /\bkanban\b/i],
  'rest api': [/\brest\b/i, /\bapi\b/i, /\brestful\b/i],
  testing: [/\btesting\b/i, /\bunit test\b/i, /\bjest\b/i, /\bcypress\b/i],
  'machine learning': [/\bmachine learning\b/i, /\bml\b/i],
  'data analysis': [/\bdata analysis\b/i, /\banalytics\b/i]
  statusMessage: ''
};

const skillsBank = [
  'javascript', 'typescript', 'react', 'node', 'python', 'sql', 'aws', 'docker',
  'kubernetes', 'ci/cd', 'git', 'html', 'css', 'next.js', 'java', 'spring',
  'power bi', 'excel', 'communication', 'leadership', 'agile', 'rest api',
  'mongodb', 'postgresql', 'machine learning', 'data analysis', 'figma', 'testing'
];

const synonyms = {
  js: 'javascript',
  'node.js': 'node',
  kubernetes: 'kubernetes',
  postgres: 'postgresql',
  'restful api': 'rest api',
  'ml': 'machine learning'
};

const navLinks = document.querySelectorAll('.nav-link');
const sideLinks = document.querySelectorAll('.side-link');
const homeView = document.getElementById('homeView');
const analyzeView = document.getElementById('analyzeView');
const dashboardView = document.getElementById('dashboardView');
const sidebar = document.getElementById('sidebar');
const authActions = document.getElementById('authActions');
const authDialog = document.getElementById('authDialog');
const authTitle = document.getElementById('authTitle');
const authForm = document.getElementById('authForm');
const closeAuth = document.getElementById('closeAuth');
const appLayout = document.getElementById('appLayout');

if (window.pdfjsLib) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

function persist() {
  localStorage.setItem('ainex_user', JSON.stringify(state.user));
  localStorage.setItem('ainex_latest_analysis', JSON.stringify(state.analysis));
  localStorage.setItem('ainex_history', JSON.stringify(state.history));
}

function setStatus(message = '') {
  state.statusMessage = message;
}

function extractSkills(text = '') {
  const found = [];
  Object.entries(SKILL_PATTERNS).forEach(([skill, patterns]) => {
    if (patterns.some((pattern) => pattern.test(text))) {
      found.push(skill);
    }
  });
  return found;
function dedupe(items) {
  return [...new Set(items)];
}

function normalizeText(text = '') {
  let output = text.toLowerCase().replace(/[.,;:()]/g, ' ');
  Object.entries(synonyms).forEach(([key, value]) => {
    output = output.replaceAll(key, value);
  });
  return output;
}

function extractSkills(text = '') {
  const normalized = normalizeText(text);
  return dedupe(skillsBank.filter((skill) => normalized.includes(skill)));
}

function inferRole(jd) {
  const lower = jd.toLowerCase();
  if (lower.includes('data')) return 'Data Analyst';
  if (lower.includes('data analyst') || lower.includes('analytics')) return 'Data Analyst';
  if (lower.includes('frontend') || lower.includes('react')) return 'Frontend Engineer';
  if (lower.includes('backend') || lower.includes('api')) return 'Backend Engineer';
  if (lower.includes('full stack')) return 'Full Stack Engineer';
  return 'General Applicant';
}

function runGrammarCheck(text) {
  const checks = [
    { pattern: /\bi\b/g, replacement: 'I', reason: 'Capitalize first-person pronoun' },
    { pattern: /\bteh\b/gi, replacement: 'the', reason: 'Correct spelling: teh → the' },
    { pattern: /\brecieve\b/gi, replacement: 'receive', reason: 'Correct spelling: recieve → receive' },
    { pattern: /\bacheive\b/gi, replacement: 'achieve', reason: 'Correct spelling: acheive → achieve' },
    { pattern: /\s{2,}/g, replacement: ' ', reason: 'Remove extra spaces' }
  const corrections = [
    { pattern: /\bi\b/g, replacement: 'I', reason: 'Capitalize first-person pronoun' },
    { pattern: /\bteh\b/gi, replacement: 'the', reason: 'Spelling correction' },
    { pattern: /\brecieve\b/gi, replacement: 'receive', reason: 'Spelling correction' },
    { pattern: /\bacheive\b/gi, replacement: 'achieve', reason: 'Spelling correction' },
    { pattern: /\s{2,}/g, replacement: ' ', reason: 'Remove repeated spaces' }
  ];

  let corrected = text;
  const issues = [];

  checks.forEach(({ pattern, replacement, reason }) => {
    if (pattern.test(corrected)) {
      corrected = corrected.replace(pattern, replacement);
      issues.push(reason);
  corrections.forEach(({ pattern, replacement, reason }) => {
    if (pattern.test(corrected)) {
      corrected = corrected.replace(pattern, replacement);
      issues.push(`${reason}: replaced using ${pattern}`);
    }
  });

  return {
    issues: issues.length ? issues : ['No major grammar issues detected in quick scan.'],
    corrected
  };
}

function generateSuggestions({ role, required, missing, matched, resumeText }) {
  const suggestions = [];

  missing.slice(0, 5).forEach((skill) => {
    suggestions.push(`Add one quantified bullet for ${skill}. Example: "Used ${skill} to improve a KPI by X% in Y months."`);
  });

  if (!/\b(project|experience|work history)\b/i.test(resumeText)) {
    suggestions.push('Add a clear "Experience" or "Projects" section to improve recruiter readability.');
  }

  if (!/\d+%|\$\d+|\d+\s*(days|weeks|months|users|clients)/i.test(resumeText)) {
    suggestions.push('Include measurable outcomes (%, money saved, time reduced, users impacted) in achievements.');
  }

  if (matched.length) {
    suggestions.push(`Align your professional summary with the role (${role}) using matched skills: ${matched.slice(0, 4).join(', ')}.`);
  }

  if (required.length > matched.length) {
    suggestions.push('Reorder sections so the most relevant skills and projects appear in the top half of page 1.');
  }

  return [...new Set(suggestions)].slice(0, 7);
}

function analyzeResume(resumeText, jdText, resumeName = 'Resume') {
  const required = extractSkills(jdText);
  const found = extractSkills(resumeText);
  const matched = required.filter((skill) => found.includes(skill));
  const missing = required.filter((skill) => !found.includes(skill));

  const keywordMatchScore = required.length ? Math.round((matched.length / required.length) * 100) : 35;
  const skillAlignmentScore = found.length ? Math.round((matched.length / found.length) * 100) : 0;
  const formattingScore = Math.max(50, Math.min(100, Math.round((resumeText.split('\n').filter(Boolean).length / 18) * 100)));
  const score = Math.min(100, Math.max(0, Math.round(keywordMatchScore * 0.5 + skillAlignmentScore * 0.25 + formattingScore * 0.25)));
function analyzeResume(resumeText, jdText, resumeName = 'Resume') {
  const required = extractSkills(jdText);
  const resumeSkills = extractSkills(resumeText);
  const matched = required.filter((s) => resumeSkills.includes(s));
  const missing = required.filter((s) => !resumeSkills.includes(s));

  const keywordMatchScore = required.length ? Math.round((matched.length / required.length) * 100) : 40;
  const skillAlignmentScore = resumeSkills.length ? Math.round((matched.length / resumeSkills.length) * 100) : 0;
  const formattingScore = Math.max(50, Math.min(100, Math.round((resumeText.split('\n').length / 18) * 100)));
  const score = Math.round((keywordMatchScore * 0.45) + (skillAlignmentScore * 0.3) + (formattingScore * 0.25));

  const grammar = runGrammarCheck(resumeText);
  const suggestions = generateSuggestions(missing, matched, inferRole(jdText));

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    resumeName,
    role: inferRole(jdText),
    required,
    matched,
    missing,
    score,
    keywordMatchScore,
    skillAlignmentScore,
    formattingScore,
    suggestions: generateSuggestions({ role: inferRole(jdText), required, missing, matched, resumeText }),
    grammar: runGrammarCheck(resumeText)
  };
}

async function parsePdfToText(file) {
  if (!window.pdfjsLib) throw new Error('PDF parser not loaded');
  const buffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;

  const pages = [];
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    pages.push(pageText);
  }

  return pages.join('\n').replace(/\s{2,}/g, ' ').trim();
    role: inferRole(jdText),
    resumeName,
    required,
    matched,
    missing,
    score: Math.min(100, Math.max(0, score)),
    keywordMatchScore,
    skillAlignmentScore,
    formattingScore,
    suggestions,
    grammar
  };
}

function generateSuggestions(missing, matched, role) {
  const suggestions = [];

  missing.slice(0, 5).forEach((skill) => {
    suggestions.push(`Add a quantified bullet showing your ${skill} impact for ${role} responsibilities.`);
  });

  if (matched.length) {
    suggestions.push(`Strengthen your summary with top aligned skills: ${matched.slice(0, 4).join(', ')}.`);
  }

  suggestions.push('Include measurable outcomes (%, $, time saved) in each experience section.');
  return dedupe(suggestions);
}

function openAuth(mode) {
  state.authMode = mode;
  authTitle.textContent = mode === 'login' ? 'Login' : 'Sign Up';
  authDialog.showModal();
}

function renderAuthActions() {
  if (!state.user) {
    authActions.innerHTML = '<button class="btn" id="loginBtn">Login</button><button class="btn" id="signupBtn">Sign Up</button>';
    authActions.innerHTML = `
      <button class="btn" id="loginBtn">Login</button>
      <button class="btn" id="signupBtn">Sign Up</button>
    `;
    document.getElementById('loginBtn').onclick = () => openAuth('login');
    document.getElementById('signupBtn').onclick = () => openAuth('signup');
    return;
  }

  authActions.innerHTML = `<span>Welcome, ${state.user.name}</span> <button class="btn" id="logoutBtn">Logout</button>`;
  authActions.innerHTML = `<span>Welcome, ${state.user.name}</span><button class="btn" id="logoutBtn">Logout</button>`;
  document.getElementById('logoutBtn').onclick = () => {
    state.user = null;
    setStatus('Logged out successfully.');
    persist();
    setRoute('home');
  };
}

function setRoute(route) {
  if ((route === 'analyze' || route === 'dashboard') && !state.user) {
    setStatus('Please login first to access Analyze and Dashboard.');
    route = 'home';
  }

  state.route = route;
  navLinks.forEach((item) => item.classList.toggle('active', item.dataset.route === route));
  homeView.classList.toggle('hidden', route !== 'home');
  analyzeView.classList.toggle('hidden', route !== 'analyze');
  dashboardView.classList.toggle('hidden', route !== 'dashboard');

  const showDashboard = route === 'dashboard';
  sidebar.classList.toggle('hidden', !showDashboard);
  appLayout.classList.toggle('dashboard-mode', showDashboard);

  render();
}

function uploadFormTemplate() {
  return `
    <form id="analyzeForm" class="panel">
      <div class="grid-two">
        <div>
          <label for="resumeFile">Upload Resume (PDF/TXT/DOC)</label>
          <input id="resumeFile" type="file" accept=".txt,.md,.doc,.docx,.pdf" />
          <label for="resumeText">Or Paste Resume Text
            <textarea id="resumeText" rows="11" placeholder="Paste resume content here...">${state.draftResume}</textarea>
          <label for="resumeFile">Upload Resume (text readable file recommended)</label>
          <input id="resumeFile" type="file" accept=".txt,.md,.doc,.docx,.pdf" />
          <label for="resumeText">Or Paste Resume Text
            <textarea id="resumeText" rows="11" placeholder="Paste resume content here..."></textarea>
          </label>
        </div>
        <div>
          <label for="jobDescription">Paste Job Description
            <textarea id="jobDescription" rows="14" placeholder="Paste full job description here...">${state.draftJD}</textarea>
            <textarea id="jobDescription" rows="14" placeholder="Paste full job description here..."></textarea>
          </label>
          <button class="btn" type="submit">Analyze Resume</button>
        </div>
      </div>
    </form>
  `;
}

function bindHomeEvents() {
  if (!state.user) return;

  const fileInput = document.getElementById('resumeFile');
  const resumeText = document.getElementById('resumeText');
  const jdText = document.getElementById('jobDescription');

  resumeText.addEventListener('input', (e) => {
    state.draftResume = e.target.value;
  });

  jdText.addEventListener('input', (e) => {
    state.draftJD = e.target.value;
  });
function renderHome() {
  homeView.innerHTML = `
    <h2>Welcome to AINEX</h2>
    <p class="small">Upload your resume, paste a job description, and get complete AI-guided analysis with dashboard insights.</p>
    ${state.statusMessage ? `<p class="small">${state.statusMessage}</p>` : ''}
    ${state.user ? uploadFormTemplate() : '<div class="panel"><h3>Please login or sign up to start your analysis.</h3></div>'}
  `;

  if (!state.user) return;

  const fileInput = document.getElementById('resumeFile');
  const textArea = document.getElementById('resumeText');

  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let parsed = '';
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        parsed = await parsePdfToText(file);
      } else {
        parsed = await file.text();
      }

      if (!parsed.trim()) {
        setStatus('Could not extract readable text from this file. Please paste text manually for best results.');
      } else {
        state.lastResumeName = file.name;
        state.draftResume = parsed;
        resumeText.value = parsed;
        setStatus(`Resume parsed successfully from ${file.name}.`);
      }
    } catch {
      setStatus('Resume parsing failed for this file. Please paste resume text manually.');
    }

    renderHome();
      const text = await file.text();
      if (!text.trim()) {
        setStatus('Uploaded file is empty. Please paste resume text manually.');
      } else {
        textArea.value = text;
        setStatus(`Loaded resume from ${file.name}.`);
      }
    } catch {
      setStatus('Could not parse this file. Please paste resume text manually.');
    }

    renderHome();
    document.getElementById('resumeText').value = textArea.value;
  });

  document.getElementById('analyzeForm').onsubmit = (e) => {
    e.preventDefault();
    const resume = resumeText.value.trim();
    const jd = jdText.value.trim();

    if (!resume || !jd) {
    const resumeText = document.getElementById('resumeText').value.trim();
    const jdText = document.getElementById('jobDescription').value.trim();
    const uploadedFile = document.getElementById('resumeFile').files?.[0];

    if (!resumeText || !jdText) {
      setStatus('Please provide both resume text and job description.');
      renderHome();
      return;
    }

    const result = analyzeResume(resume, jd, state.lastResumeName || `Resume v${state.history.length + 1}`);
    state.analysis = result;
    const result = analyzeResume(resumeText, jdText, uploadedFile?.name || `Resume v${state.history.length + 1}`);
    state.analysis = result;

    state.history.unshift({
      sNo: state.history.length + 1,
      id: result.id,
      resumeName: result.resumeName,
      role: result.role,
      score: result.score,
      keywordMatchScore: result.keywordMatchScore,
      skillAlignmentScore: result.skillAlignmentScore,
      formattingScore: result.formattingScore,
      timestamp: result.timestamp
    });

    state.history = state.history.slice(0, 25).map((row, idx) => ({ ...row, sNo: idx + 1 }));
    persist();
    setStatus('Analysis completed successfully.');
    state.history = state.history.slice(0, 25).map((item, i) => ({ ...item, sNo: i + 1 }));
    setStatus('Analysis completed successfully.');
    persist();
    setRoute('analyze');
  };
}

function renderHome() {
  homeView.innerHTML = `
    <h2>Welcome to AINEX</h2>
    <p class="small">Upload resume, add job description, and get detailed analysis with suggestions.</p>
    ${state.statusMessage ? `<p class="small">${state.statusMessage}</p>` : ''}
    ${state.user ? uploadFormTemplate() : '<div class="panel"><h3>Please login or sign up to start.</h3></div>'}
  `;

  bindHomeEvents();
}

function renderAnalyze() {
  if (!state.analysis) {
    analyzeView.innerHTML = '<h2>No analysis yet</h2><p>Go to Home and analyze your resume first.</p>';
    return;
  }

  const a = state.analysis;
  const angle = -90 + (a.score / 100) * 180;

  analyzeView.innerHTML = `
    <h2>Resume Analysis (${a.role})</h2>
    <p class="small">Resume: ${a.resumeName}</p>
    <div class="grid-two">
      <div class="speedometer-wrap">
        <div class="speedometer"><div class="needle" style="transform: rotate(${angle}deg)"></div></div>
        <div class="score">Resume Strength: <strong>${a.score}%</strong></div>
      </div>
      <div class="panel">
        <h3>AI Suggestions</h3>
        <ul>${a.suggestions.map((s) => `<li>${s}</li>`).join('')}</ul>
function renderAnalyze() {
  if (!state.analysis) {
    analyzeView.innerHTML = '<h2>No analysis yet</h2><p>Go to Home, upload resume, and analyze first.</p>';
    return;
  }

  const angle = -90 + (state.analysis.score / 100) * 180;

  analyzeView.innerHTML = `
    <h2>Resume Analysis (${state.analysis.role})</h2>
    <p class="small">Resume: ${state.analysis.resumeName}</p>

    <div class="grid-two">
      <div class="speedometer-wrap">
        <div class="speedometer"><div class="needle" style="transform: rotate(${angle}deg)"></div></div>
        <div class="score">Resume Strength: <strong>${state.analysis.score}%</strong></div>
      </div>

      <div class="panel">
        <h3>AI Suggestions</h3>
        <ul>${state.analysis.suggestions.map((s) => `<li>${s}</li>`).join('')}</ul>
      </div>
    </div>

    <div class="panel">
      <h3>Skill Analysis Table</h3>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr><th>Required Skills</th><th>Matched Skills</th><th>Missing Skills</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>${a.required.join(', ') || '-'}</td>
              <td>${a.matched.join(', ') || '-'}</td>
              <td>${a.missing.join(', ') || '-'}</td>
              <td>${state.analysis.required.join(', ') || '-'}</td>
              <td>${state.analysis.matched.join(', ') || '-'}</td>
              <td>${state.analysis.missing.join(', ') || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="panel">
      <h3>Grammar Check</h3>
      <ul>${a.grammar.issues.map((issue) => `<li>${issue}</li>`).join('')}</ul>
      <p><strong>Corrected Resume Preview:</strong></p>
      <textarea rows="7" readonly>${a.grammar.corrected}</textarea>
      <p><strong>Detected Issues:</strong></p>
      <ul>${state.analysis.grammar.issues.map((issue) => `<li>${issue}</li>`).join('')}</ul>
      <p><strong>Corrected Resume Preview:</strong></p>
      <textarea rows="7" readonly>${state.analysis.grammar.corrected}</textarea>
    </div>
  `;
}

function generateQuestions(analysis) {
  if (!analysis) return ['Run analysis first to generate interview questions.'];

  const top = analysis.matched.slice(0, 4);
  const gaps = analysis.missing.slice(0, 3);

  return [
    `Describe a project where you used ${top[0] || 'your strongest skill'} and delivered measurable impact.`,
    `How do you prioritize work for a ${analysis.role} role under tight deadlines?`,
    `How would you improve quality and performance in this role?`,
    `What is your 30-60-90 day plan for this position?`,
    ...gaps.map((skill) => `How will you close your ${skill} gap quickly if hired?`)
  if (!analysis) return ['Run resume analysis first to generate role-specific interview questions.'];

  const matched = analysis.matched.slice(0, 4);
  const missing = analysis.missing.slice(0, 3);

  return [
    `Walk me through a project where you used ${matched[0] || 'your strongest technical skill'} and delivered measurable business impact.`,
    `How do you prioritize tasks and communicate risk in a ${analysis.role} role?`,
    `What metrics would you track in your first 90 days for this position?`,
    `Tell me about a challenge where you improved quality or performance under deadline pressure.`,
    ...missing.map((skill) => `What is your plan to upskill quickly in ${skill} for this role?`)
  ];
}

function drawHistoryChart() {
  const canvas = document.getElementById('historyChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(255,255,255,.35)';
  ctx.lineWidth = 1;

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255,255,255,.35)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i += 1) {
    const y = 20 + (i * (height - 40)) / 5;
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(width - 20, y);
    ctx.stroke();
  }

  const points = state.history.slice(0, 10).reverse();
  if (!points.length) return;

  ctx.strokeStyle = '#CFE8C9';
  ctx.fillStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.beginPath();

  points.forEach((item, idx) => {
    const x = 30 + idx * ((width - 60) / Math.max(points.length - 1, 1));
    const y = height - 20 - (item.score / 100) * (height - 40);
    idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });

  ctx.stroke();
  points.forEach((item, idx) => {
    const x = 30 + idx * ((width - 60) / Math.max(points.length - 1, 1));
    const y = height - 20 - (item.score / 100) * (height - 40);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderDashboard() {
  if (!state.user) {
    dashboardView.innerHTML = '<h2>Please login first.</h2>';
    return;
  }

  const tab = state.dashboardTab;
  const latest = state.analysis || { keywordMatchScore: 0, skillAlignmentScore: 0, formattingScore: 0, matched: [], missing: [] };

  if (tab === 'overview') {
    const avgKeyword = state.history.length
      ? Math.round(state.history.reduce((sum, item) => sum + item.keywordMatchScore, 0) / state.history.length)
  const latest = state.analysis || { keywordMatchScore: 0, skillAlignmentScore: 0, formattingScore: 0 };

  if (tab === 'overview') {
    const avgKeyword = state.history.length
      ? Math.round(state.history.reduce((acc, x) => acc + x.keywordMatchScore, 0) / state.history.length)
      : latest.keywordMatchScore;

    dashboardView.innerHTML = `
      <h2>Dashboard Overview</h2>
      <div class="stat-cards">
        <div class="stat"><div>Overall Keyword Match Score</div><strong>${avgKeyword}%</strong></div>
        <div class="stat"><div>Skill Alignment Score</div><strong>${latest.skillAlignmentScore}%</strong></div>
        <div class="stat"><div>Formatting Score</div><strong>${latest.formattingScore}%</strong></div>
      </div>

      <div class="panel">
        <h3>Resume Score History</h3>
        <canvas class="chart" id="historyChart" width="900" height="220"></canvas>
      </div>
    `;
    drawHistoryChart();
  }

  if (tab === 'interview') {
    const questions = generateQuestions(state.analysis);

    dashboardView.innerHTML = `
      <h2>Interview Preparation</h2>
      <div class="grid-two">
        <div class="panel">
          <h3>Interview Question Generator</h3>
          <ol>${questions.map((q) => `<li>${q}</li>`).join('')}</ol>
        </div>
        <div class="panel">
          <h3>Skills for this role</h3>
          <p><strong>Matched:</strong> ${latest.matched.join(', ') || '-'}</p>
          <p><strong>Missing:</strong> ${latest.missing.join(', ') || '-'}</p>

        <div class="panel">
          <h3>Matched Skills for Job Role</h3>
          <p><strong>Matched Skills:</strong> ${(state.analysis?.matched || []).join(', ') || '-'}</p>
          <p><strong>Missing Skills:</strong> ${(state.analysis?.missing || []).join(', ') || '-'}</p>
        </div>
      </div>
    `;
  }

  if (tab === 'history') {
    dashboardView.innerHTML = `
      <h2>Application History</h2>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr><th>Serial No.</th><th>Resume</th><th>Job Role</th><th>Resume Strength</th></tr>
          </thead>
          <tbody>
            ${state.history.length ? state.history.map((row) => `
              <tr>
                <td>${row.sNo}</td>
                <td>${row.resumeName}</td>
                <td>${row.role}</td>
                <td>${row.score}%</td>
              </tr>
            `).join('') : '<tr><td colspan="4">No history yet.</td></tr>'}
            <tr>
              <th>Serial No.</th>
              <th>Resume</th>
              <th>Job Role</th>
              <th>Resume Strength</th>
            </tr>
          </thead>
          <tbody>
            ${state.history.length
              ? state.history.map((row) => `
                <tr>
                  <td>${row.sNo}</td>
                  <td>${row.resumeName}</td>
                  <td>${row.role}</td>
                  <td>${row.score}%</td>
                </tr>
              `).join('')
              : '<tr><td colspan="4">No history yet.</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }
}

function render() {
  renderAuthActions();
  renderHome();
  renderAnalyze();
  renderDashboard();
  sideLinks.forEach((item) => item.classList.toggle('active', item.dataset.tab === state.dashboardTab));
}

navLinks.forEach((btn) => btn.addEventListener('click', () => setRoute(btn.dataset.route)));
sideLinks.forEach((btn) => btn.addEventListener('click', () => {
  state.dashboardTab = btn.dataset.tab;
  render();
}));

authForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value.trim();

  if (!email || password.length < 6) {
    setStatus('Please enter valid email and password (min 6 chars).');
    setStatus('Please enter a valid email and password (minimum 6 characters).');
    authDialog.close();
    render();
    return;
  }

  state.user = { name: email.split('@')[0], email };
  state.user = { name: email.split('@')[0], email, mode: state.authMode };
  setStatus(`${state.authMode === 'login' ? 'Login' : 'Sign up'} successful.`);
  persist();
  authDialog.close();
  render();
});

closeAuth.addEventListener('click', () => authDialog.close());
setRoute('home');
