/* ==========================================================
   FluentSpring – shared script (loaded on every page)
   Header/footer, progress storage, and the reusable question engine.
   All answers are checked with pre-written rules (no AI).
   ========================================================== */

const NAV_ITEMS = [
  { page: "home", label: "Home", href: "index.html" },
  { page: "objectives", label: "Objectives", href: "objectives.html" },
  { page: "warmup", label: "Warm-up", href: "warmup.html" },
  { page: "techniques", label: "Techniques", href: "techniques.html" },
  { page: "practice", label: "Guided Practice", href: "guided-practice.html" },
  { page: "main", label: "Main Activity", href: "main-activity.html" },
  { page: "assessment", label: "Assessment", href: "assessment.html" },
  { page: "feedback", label: "Feedback", href: "feedback.html" }
];

const STAGES = [
  { id: "warmup", label: "1. Warm-up", desc: "Activate what you already know", href: "warmup.html" },
  { id: "techniques", label: "2. Delivery and modelling", desc: "Learn how skimming and scanning work", href: "techniques.html" },
  { id: "practice", label: "3. Guided practice", desc: "Try the steps with hints", href: "guided-practice.html" },
  { id: "main", label: "4. Main task", desc: "University Reading Week challenges", href: "main-activity.html" },
  { id: "assessment", label: "5. Review and assessment", desc: "10 questions with a score", href: "assessment.html" },
  { id: "feedback", label: "6. Feedback and revision", desc: "Learn from mistakes and try again", href: "feedback.html" }
];

/* ---------- Header and footer ---------- */
function buildHeader(currentPage) {
  const links = NAV_ITEMS.map(item => {
    const current = item.page === currentPage ? ' aria-current="page"' : "";
    return `<li><a href="${item.href}"${current}>${item.label}</a></li>`;
  }).join("");
  return `
    <header class="site-header">
      <nav class="container nav-bar" aria-label="Main navigation">
        <a class="brand" href="index.html" aria-label="FluentSpring home">
          <span class="brand-mark" aria-hidden="true">F</span>
          <span>Fluent<span class="accent">Spring</span></span>
        </a>
        <button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="navLinks" aria-label="Toggle menu">&#9776;</button>
        <ul class="nav-links" id="navLinks">${links}</ul>
      </nav>
    </header>`;
}

function buildFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <p><strong>FluentSpring – Skimming and Scanning</strong></p>
        <p>Group C10 · Introduction to ELT (ENG 0231-34) · Related course: ENG 0232-05 Reading and Writing Skills</p>
        <p>CLO1: Summarise and answer questions about academic reading materials.</p>
        <p>All universities, events and people in the reading passages are fictional examples created for learning.
           Answers are checked by pre-written rules, not by AI. Your teacher remains responsible for your learning decisions.</p>
      </div>
    </footer>`;
}

function setupMobileMenu() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

/* ---------- LocalStorage helper (fails safely if storage is blocked) ---------- */
const Store = {
  prefix: "fluentspring_",
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(this.prefix + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(this.prefix + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  },
  clearAll() {
    try {
      Object.keys(localStorage).filter(k => k.startsWith(this.prefix)).forEach(k => localStorage.removeItem(k));
    } catch (e) { /* ignore */ }
  }
};

/* ---------- Progress tracking ---------- */
function markComplete(stageId) {
  const progress = Store.get("progress", {});
  if (!progress[stageId]) { progress[stageId] = true; Store.set("progress", progress); }
}

function renderProgress() {
  const list = document.getElementById("stageList");
  if (!list) return;
  const progress = Store.get("progress", {});
  const done = STAGES.filter(s => progress[s.id]).length;
  list.innerHTML = STAGES.map(s => `
    <li class="stage-item${progress[s.id] ? " done" : ""}">
      <a href="${s.href}">
        <span class="stage-check" aria-hidden="true">${progress[s.id] ? "✔" : ""}</span>
        <span class="stage-name">${s.label}<span class="stage-desc">${s.desc}</span></span>
        <span class="stage-status">${progress[s.id] ? "Completed" : "Not started"}</span>
      </a>
    </li>`).join("");
  const text = document.getElementById("progressText");
  const bar = document.getElementById("progressBar");
  if (text) text.textContent = `${done} of ${STAGES.length} stages completed`;
  if (bar) bar.style.width = `${Math.round((done / STAGES.length) * 100)}%`;
  const reset = document.getElementById("resetProgress");
  if (reset) {
    reset.addEventListener("click", () => {
      if (confirm("This will delete your saved progress, scores and reflection on this device. Continue?")) {
        Store.clearAll();
        location.reload();
      }
    });
  }
}

/* ---------- Persisted self-check boxes ---------- */
function setupSavedChecks() {
  const saved = Store.get("checks", {});
  document.querySelectorAll("input[data-save]").forEach(box => {
    box.checked = !!saved[box.dataset.save];
    box.addEventListener("change", () => {
      const current = Store.get("checks", {});
      current[box.dataset.save] = box.checked;
      Store.set("checks", current);
    });
  });
}

/* ==========================================================
   Question engine
   question = { type: "mc"|"text", text, options[], answer (index),
                keywords [[any of],[any of]] (text), display (text),
                hint, explain, section }
   ========================================================== */
function esc(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function normalise(value) {
  return " " + String(value).toLowerCase()
    .replace(/(\d)(st|nd|rd|th)\b/g, "$1")
    .replace(/[.,;:!?"'()\/\-+]/g, " ")
    .replace(/\s+/g, " ").trim() + " ";
}

function textMatches(question, value) {
  const v = normalise(value);
  return question.keywords.every(group => group.some(word => v.includes(" " + word + " ")));
}

function renderQuestions(container, questions, prefix, startAt = 1) {
  container.innerHTML = questions.map((q, i) => {
    const id = `${prefix}-${i}`;
    const body = q.type === "text"
      ? `<div class="text-answer"><label class="sr-only" for="${id}">Your answer</label>
           <input type="text" id="${id}" name="${id}" maxlength="60" autocomplete="off" placeholder="Type your answer here"></div>`
      : `<div class="options">${q.options.map((opt, j) =>
          `<label class="option"><input type="radio" name="${id}" value="${j}"><span>${esc(opt)}</span></label>`).join("")}</div>`;
    const hint = q.hint
      ? `<button type="button" class="hint-btn" aria-expanded="false">Need a hint?</button><p class="hint-box" hidden>💡 ${esc(q.hint)}</p>`
      : "";
    return `<fieldset class="question" id="${id}-box">
      <legend><span class="q-num">${startAt + i}</span>${esc(q.text)}</legend>
      ${body}${hint}<div class="q-feedback" aria-live="polite"></div></fieldset>`;
  }).join("");
  container.querySelectorAll(".hint-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const box = btn.nextElementSibling;
      box.hidden = !box.hidden;
      btn.setAttribute("aria-expanded", String(!box.hidden));
    });
  });
}

function readAnswer(prefix, index, question) {
  if (question.type === "text") {
    const input = document.getElementById(`${prefix}-${index}`);
    return input ? input.value.trim() : "";
  }
  const checked = document.querySelector(`input[name="${prefix}-${index}"]:checked`);
  return checked ? checked.value : "";
}

/* Returns { incomplete:true, missing:[…] } or { score, total, details:[…] } */
function gradeQuestions(container, questions, prefix, options = {}) {
  const answers = questions.map((q, i) => readAnswer(prefix, i, q));
  const boxes = questions.map((q, i) => document.getElementById(`${prefix}-${i}-box`));
  boxes.forEach(box => box.classList.remove("unanswered", "is-correct", "is-wrong"));

  const missing = answers.map((a, i) => (a === "" ? i : -1)).filter(i => i >= 0);
  if (missing.length) {
    missing.forEach(i => boxes[i].classList.add("unanswered"));
    boxes[missing[0]].scrollIntoView({ behavior: "smooth", block: "center" });
    return { incomplete: true, missing };
  }

  const details = questions.map((q, i) => {
    const given = answers[i];
    const correct = q.type === "text" ? textMatches(q, given) : Number(given) === q.answer;
    const correctText = q.type === "text" ? q.display : q.options[q.answer];
    boxes[i].classList.add(correct ? "is-correct" : "is-wrong");
    boxes[i].querySelector(".q-feedback").innerHTML = correct
      ? `<p class="feedback correct">✔ Correct. ${esc(q.explain)}</p>`
      : `<p class="feedback incorrect">✘ Not quite. Correct answer: ${esc(correctText)}. ${esc(q.explain)}</p>`;
    if (options.lock) boxes[i].querySelectorAll("input").forEach(el => (el.disabled = true));
    return {
      section: q.section || "", text: q.text, correct, correctText,
      given: q.type === "text" ? given : q.options[given], explain: q.explain
    };
  });
  return { incomplete: false, score: details.filter(d => d.correct).length, total: questions.length, details };
}

function showMessage(element, type, message) {
  element.className = `feedback ${type}`;
  element.textContent = message;
  element.hidden = false;
}

function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function initSite() {
  const page = document.body.dataset.page;
  const headerSlot = document.getElementById("site-header");
  const footerSlot = document.getElementById("site-footer");
  if (headerSlot) headerSlot.innerHTML = buildHeader(page);
  if (footerSlot) footerSlot.innerHTML = buildFooter();
  setupMobileMenu();
  renderProgress();
  setupSavedChecks();
}

document.addEventListener("DOMContentLoaded", initSite);
