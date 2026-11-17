/* Stage 6 – Feedback and revision */
const assessmentData = Store.get("assessment", null);

/* ---------- 1–3: results, explanations, improvement areas ---------- */
const improvementTips = {
  skimming: [
    "Before reading, look at the title, first sentences and last sentences.",
    "Ask: what is the writer trying to tell me overall?",
    "A main idea covers the whole text. Do not choose an answer just because it mentions one detail you saw."
  ],
  scanning: [
    "Decide first what type of information you need: a date, number, name or place.",
    "Look for digits, month names and capital letters instead of reading every word.",
    "Read the words around your answer. Texts often contain similar dates or numbers that are distractors."
  ]
};

function renderReviewList(onlyWrong) {
  const list = document.getElementById("reviewList");
  const items = assessmentData.details
    .map((d, i) => ({ d, n: i + 1 }))
    .filter(item => !onlyWrong || !item.d.correct);
  if (!items.length) {
    list.innerHTML = `<p class="feedback correct">You answered every question correctly. Nothing to review here.</p>`;
    return;
  }
  list.innerHTML = items.map(({ d, n }) => `
    <div class="review-item ${d.correct ? "ok" : "no"}">
      <p><span class="tag">${esc(d.section)}</span> <strong>Question ${n}.</strong> ${esc(d.text)}</p>
      <p>${d.correct ? "✔ Correct" : "✘ Incorrect"} · Your answer: ${esc(d.given)}</p>
      ${d.correct ? "" : `<p>Correct answer: <strong>${esc(d.correctText)}</strong></p>`}
      <p>${esc(d.explain)}</p>
    </div>`).join("");
}

function renderImprovement() {
  const sections = [
    { key: "skimming", label: "Skimming", score: assessmentData.skim },
    { key: "scanning", label: "Scanning", score: assessmentData.scan }
  ];
  document.getElementById("improveList").innerHTML = sections.map(s => {
    const missed = assessmentData.details.filter(d => d.section === s.key && !d.correct);
    if (!missed.length) {
      return `<article class="card card-accent-blue"><h3>${s.label}: strong</h3><p>You answered all 5 correctly. Keep using the same strategy in the revision exercise to check it works on a new text.</p></article>`;
    }
    return `<article class="card card-accent-purple"><h3>${s.label}: needs practice (${s.score}/5)</h3>
      <p>Questions to review:</p><ul class="steps-list">${missed.map(m => `<li>${esc(m.text)}</li>`).join("")}</ul>
      <p><strong>Try this:</strong></p><ul class="steps-list">${improvementTips[s.key].map(t => `<li>${esc(t)}</li>`).join("")}</ul></article>`;
  }).join("");
}

if (assessmentData && assessmentData.details) {
  document.getElementById("summaryCard").hidden = false;
  document.getElementById("fbScore").textContent = `${assessmentData.score} / 10 (${assessmentData.pct}%)`;
  document.getElementById("fbBar").style.width = `${assessmentData.pct}%`;
  document.getElementById("fbSkim").textContent = `${assessmentData.skim} out of 5 correct`;
  document.getElementById("fbScan").textContent = `${assessmentData.scan} out of 5 correct`;
  document.getElementById("reviewSection").hidden = false;
  document.getElementById("improveSection").hidden = false;
  renderReviewList(false);
  renderImprovement();
  const showAll = document.getElementById("showAll");
  const showWrong = document.getElementById("showWrong");
  showAll.addEventListener("click", () => {
    renderReviewList(false); showAll.setAttribute("aria-pressed", "true"); showWrong.setAttribute("aria-pressed", "false");
  });
  showWrong.addEventListener("click", () => {
    renderReviewList(true); showWrong.setAttribute("aria-pressed", "true"); showAll.setAttribute("aria-pressed", "false");
  });
} else {
  document.getElementById("noAssessment").hidden = false;
}

/* ---------- 4: revision exercise (second, comparable passage) ---------- */
const revisionQuestions = [
  { type: "mc", section: "skimming", text: "What is the main idea of the passage?",
    options: ["Green Campus Day is a university event that encourages students and staff to care for the campus environment",
              "A new environmental science course will start next year",
              "The Registrar's Office is moving to a new building",
              "Students must pay to join a student club"],
    answer: 0, explain: "The first paragraph states the aim of the day, and the rest of the passage describes activities that support it." },
  { type: "mc", section: "skimming", text: "Which title is the most appropriate?",
    options: ["How to Become an Environmental Science Lecturer", "The History of the Main Gate Field",
              "Green Campus Day: Taking Care of Our University Environment", "A Guide to Online Registration"],
    answer: 2, explain: "The best title covers the whole passage. The other titles describe small details or topics that are not discussed." },
  { type: "mc", section: "skimming", text: "What is the general purpose of the passage?",
    options: ["To describe a scientific experiment", "To inform readers about an event and encourage students to take part",
              "To criticise student clubs", "To explain step by step how to plant a tree"],
    answer: 1, explain: "The writer gives information about the event and invites volunteers. It does not describe an experiment or give instructions." },
  { type: "text", section: "scanning", text: "How many trees will volunteers plant?", display: "300",
    keywords: [["300"]], hint: "Look for the word 'trees' and the number before it.",
    explain: "The second paragraph says volunteers will plant 300 trees." },
  { type: "text", section: "scanning", text: "Who will lead the waste-sorting workshop?", display: "Ms. Sabrina Chowdhury",
    keywords: [["sabrina", "chowdhury"]], hint: "Scan for a name with a title after the word 'workshop'.",
    explain: "The workshop will be led by Ms. Sabrina Chowdhury. Arif Mahmud is the club president." },
  { type: "text", section: "scanning", text: "By what date should volunteers register online?", display: "28 May",
    keywords: [["28"], ["may", "05", "5"]], hint: "There are two dates in the passage. Find the one next to the word 'register'.",
    explain: "Volunteers should register online by 28 May. The event itself is on 3 June." }
];

const revisionBox = document.getElementById("revisionQuestions");
const revisionMsg = document.getElementById("revisionMessage");
renderQuestions(revisionBox, revisionQuestions, "rv");

document.getElementById("checkRevision").addEventListener("click", () => {
  const result = gradeQuestions(revisionBox, revisionQuestions, "rv");
  if (result.incomplete) { showMessage(revisionMsg, "info", "Please answer all six questions before checking."); return; }
  const pct = Math.round((result.score / result.total) * 100);
  let text = `Revision result: ${result.score} out of ${result.total} (${pct}%).`;
  if (assessmentData) {
    const diff = pct - assessmentData.pct;
    if (diff > 0) text += ` That is ${diff} percentage points higher than your assessment (${assessmentData.pct}%). Your revision is working.`;
    else if (diff === 0) text += ` This matches your assessment score (${assessmentData.pct}%). Check the explanations to move higher.`;
    else text += ` Your assessment score was ${assessmentData.pct}%. The passages are different, so compare your mistakes rather than only the numbers.`;
  }
  showMessage(revisionMsg, pct >= 80 ? "correct" : "info", text);
  Store.set("revision", { score: result.score, total: result.total, pct, date: new Date().toISOString() });
});

document.getElementById("retryRevision").addEventListener("click", () => {
  renderQuestions(revisionBox, revisionQuestions, "rv");
  revisionMsg.hidden = true;
  revisionBox.scrollIntoView({ behavior: "smooth" });
});

/* ---------- 5: reflection ---------- */
const reflectionText = document.getElementById("reflectionText");
const reflectionCount = document.getElementById("reflectionCount");
const reflectionMsg = document.getElementById("reflectionMessage");

function updateCount() { reflectionCount.textContent = `${reflectionText.value.length} / 1200 characters`; }
const savedReflection = Store.get("reflection", null);
if (savedReflection) {
  reflectionText.value = savedReflection.text;
  showMessage(reflectionMsg, "correct", `Saved on ${new Date(savedReflection.date).toLocaleString()}.`);
}
updateCount();
reflectionText.addEventListener("input", updateCount);

document.getElementById("saveReflection").addEventListener("click", () => {
  const text = reflectionText.value.trim();
  if (text.length < 20) {
    showMessage(reflectionMsg, "info", "Please write at least 20 characters. Describe what you learned and which technique needs more practice.");
    reflectionText.focus();
    return;
  }
  Store.set("reflection", { text, date: new Date().toISOString() });
  showMessage(reflectionMsg, "correct", "Reflection saved on this device.");
  markComplete("feedback");
});

document.getElementById("downloadRecord").addEventListener("click", () => {
  const a = Store.get("assessment", null);
  const r = Store.get("revision", null);
  const refl = reflectionText.value.trim() || (Store.get("reflection", { text: "(not written yet)" }).text);
  const lines = [
    "FluentSpring – Skimming and Scanning: learning record",
    "Group C10 | Introduction to ELT (ENG 0231-34) | CLO1",
    `Date: ${new Date().toLocaleString()}`,
    "",
    a ? `Initial assessment: ${a.score}/10 (${a.pct}%) – Skimming ${a.skim}/5, Scanning ${a.scan}/5` : "Initial assessment: not completed",
    r ? `Revision exercise: ${r.score}/${r.total} (${r.pct}%)` : "Revision exercise: not completed",
    ""
  ];
  if (a && a.details) {
    const wrong = a.details.filter(d => !d.correct);
    lines.push("Questions answered incorrectly in the assessment:");
    if (!wrong.length) lines.push("- none");
    wrong.forEach(d => lines.push(`- (${d.section}) ${d.text} | Your answer: ${d.given} | Correct: ${d.correctText}`));
    lines.push("");
  }
  lines.push("Reflection:", refl);
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "fluentspring-learning-record.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
});
